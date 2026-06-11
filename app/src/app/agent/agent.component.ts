import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { AgentService, Agent, ChatMessage, SSEEvent } from './agent.service';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


interface PendingImage {
  type: string;
  source: {
    type: string;
    media_type: string;
    data: string;
  };
  preview: string;
  fileName: string;
}

interface FileItem {
  path: string;
  status: 'creating' | 'done' | 'error';
}

interface DisplayMessage {
  role: 'user' | 'assistant';
  text: string;
  images?: string[];
}

@Component({
  selector: 'app-agent',
  standalone: true,
  templateUrl: './agent.component.html',
  styleUrl: './agent.component.scss',
  imports: [CommonModule, TranslateModule,FormsModule]
})
export class AgentComponent {
   @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('messageInput') messageInputRef!: ElementRef;
  @ViewChild('imageInput') imageInputRef!: ElementRef;

  // State
  messages: ChatMessage[] = [];
  displayMessages: DisplayMessage[] = [];
  agents: Agent[] = [];
  currentAgentSlug = 'ui-developer';
  previousAgentSlug = 'ui-developer';
  // Per-agent saved conversations so switching agents preserves each chat + context
  private conversations: { [slug: string]: { messages: ChatMessage[]; displayMessages: DisplayMessage[] } } = {};
  pendingImages: PendingImage[] = [];
  filesCreated: FileItem[] = [];
  messageText = '';

  // UI State
  isLoading = false;
  isGenerating = false;
  sessionEnded = false;
  showWelcome = true;
  showGenerationPanel = false;
  showCompletedPanel = false;
  showTypingIndicator = false;
  isDragOver = false;
  includeNodeModules = false;

  // Progress
  progressWidth = '0%';
  progressText = 'Starting...';
  totalFilesCreated = 0;

  private shouldScrollToBottom = false;

  constructor(private figmaService: AgentService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetchAgents();
    this.fetchHealth();
    this.cdr.detectChanges();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  // ============================================================
  // AGENTS & HEALTH
  // ============================================================

  async fetchAgents(): Promise<void> {
    try {
      this.agents = await this.figmaService.getAgents();

      // Default to UI Developer; fall back to the first available agent.
      const hasUiDeveloper = this.agents.find(a => a.slug === 'ui-developer');
      const initialSlug = hasUiDeveloper ? 'ui-developer' : (this.agents[0]?.slug || 'ui-developer');

      this.currentAgentSlug = initialSlug;
      this.previousAgentSlug = initialSlug;
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Failed to load agents:', error);
    }
  }

  async fetchHealth(): Promise<void> {
    try {
      await this.figmaService.getHealth();
    } catch (error) {
      console.error('Health check failed:', error);
    }
  }

  onAgentChange(): void {
    // Save the conversation we're leaving, so we can restore it later
    this.conversations[this.previousAgentSlug] = {
      messages: this.messages,
      displayMessages: this.displayMessages
    };

    // Restore the target agent's conversation (with its context), or start a new chat
    const saved = this.conversations[this.currentAgentSlug];
    this.messages = saved ? saved.messages : [];
    this.displayMessages = saved ? saved.displayMessages : [];
    this.previousAgentSlug = this.currentAgentSlug;

    // Reset transient UI so each switch is a clean slate
    this.showWelcome = this.displayMessages.length === 0;
    this.sessionEnded = false;
    this.isLoading = false;
    this.isGenerating = false;
    this.showTypingIndicator = false;
    this.showGenerationPanel = false;
    this.showCompletedPanel = false;
    this.filesCreated = [];
    this.totalFilesCreated = 0;
    this.pendingImages = [];
    this.messageText = '';
    this.progressWidth = '0%';
    this.progressText = 'Starting...';

    this.shouldScrollToBottom = true;
    this.cdr.detectChanges();
  }

  // ============================================================
  // IMAGE HANDLING
  // ============================================================

  triggerImageUpload(): void {
    this.imageInputRef.nativeElement.click();
  }

  handleImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.processFiles(Array.from(input.files));
      input.value = '';
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(): void {
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    if (event.dataTransfer?.files) {
      const files = Array.from(event.dataTransfer.files).filter(f => f.type.startsWith('image/'));
      if (files.length > 0) {
        this.processFiles(files);
      }
    }
  }

  processFiles(files: File[]): void {
    for (const file of files) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64Data = e.target?.result as string;
          this.pendingImages.push({
            type: 'image',
            source: {
              type: 'base64',
              media_type: file.type,
              data: base64Data.split(',')[1]
            },
            preview: base64Data,
            fileName: file.name
          });
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removeImage(index: number): void {
    this.pendingImages.splice(index, 1);
  }

  // ============================================================
  // INPUT HANDLING
  // ============================================================

  get canSend(): boolean {
    const hasText = this.messageText.trim().length > 0;
    const hasImages = this.pendingImages.length > 0;
    return (hasText || hasImages) && !this.isLoading && !this.sessionEnded;
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (this.canSend) {
        this.sendMessage();
      }
    }
  }

  adjustTextareaHeight(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px';
  }

  // ============================================================
  // MESSAGE SENDING
  // ============================================================

  async sendMessage(): Promise<void> {
    const textContent = this.messageText.trim();
    if (!textContent && this.pendingImages.length === 0) return;
    if (this.isLoading || this.sessionEnded) return;

    // Hide welcome state
    this.showWelcome = false;

    const hasImages = this.pendingImages.length > 0;

    // Build message content
    let messageContent: any;
    if (hasImages) {
      messageContent = [];
      for (const item of this.pendingImages) {
        messageContent.push({
          type: 'image',
          source: {
            type: 'base64',
            media_type: item.source.media_type,
            data: item.source.data
          }
        });
      }
      if (textContent) {
        messageContent.push({ type: 'text', text: textContent });
      } else {
        messageContent.push({ type: 'text', text: 'Convert this Figma design to code. Create a complete, production-ready application.' });
      }
    } else {
      messageContent = textContent;
    }

    // Render user message
    this.displayMessages.push({
      role: 'user',
      text: textContent || 'Convert this Figma design to code.',
      images: this.pendingImages.map(i => i.preview)
    });
    this.shouldScrollToBottom = true;

    // Add to messages
    this.messages.push({ role: 'user', content: messageContent });

    // Clear input
    this.messageText = '';
    this.pendingImages = [];
    this.isLoading = true;
    this.cdr.detectChanges();

    try {
      if (hasImages) {
        await this.startCodeGeneration();
      } else {
        await this.sendChatMessage();
      }
    } catch (error: any) {
      this.displayMessages.push({
        role: 'assistant',
        text: `⚠️ Error: ${error.message}`
      });
    }

    this.isLoading = false;
    this.shouldScrollToBottom = true;
    this.cdr.detectChanges();
  }

  // Normal chat (no code generation)
  async sendChatMessage(): Promise<void> {
    this.showTypingIndicator = true;
    this.cdr.detectChanges();

    try {
      const data = await this.figmaService.sendChat(this.messages, this.currentAgentSlug);

      this.showTypingIndicator = false;

      if (data.error) throw new Error(data.error);

      const assistantContent = data.content[0].text;
      this.messages.push({ role: 'assistant', content: assistantContent });
      this.displayMessages.push({
        role: 'assistant',
        text: assistantContent
      });
      this.shouldScrollToBottom = true;
      this.cdr.detectChanges();
    } catch (error) {
      this.showTypingIndicator = false;
      this.cdr.detectChanges();
      throw error;
    }
  }

  // Code generation with progress tracking
  async startCodeGeneration(): Promise<void> {
    this.isGenerating = true;
    this.filesCreated = [];
    this.totalFilesCreated = 0;

    // Show generation panel
    this.showGenerationPanel = true;
    this.progressWidth = '2%';
    this.progressText = 'Preparing workspace...';

    // Clean workspace before generating
    try {
      await this.figmaService.cleanWorkspace();
    } catch (e) {
      console.warn('Could not clean workspace:', e);
    }

    this.progressWidth = '5%';
    this.progressText = 'Analyzing your design...';

    // Start SSE stream
    const response = await this.figmaService.startAgentChat(this.messages, this.currentAgentSlug);

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || `HTTP ${response.status}`);
    }

    return new Promise<void>((resolve, reject) => {
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      const processStream = async () => {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (!line.startsWith('data: ')) continue;
              const jsonStr = line.slice(6);

              try {
                const event: SSEEvent = JSON.parse(jsonStr);
                this.handleSSEEvent(event);
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }

          // If we didn't get a 'done' event, still complete
          if (this.isGenerating) {
            this.onGenerationComplete();
          }
          resolve();
        } catch (error) {
          reject(error);
        }
      };

      processStream();
    });
  }

  handleSSEEvent(event: SSEEvent): void {
    switch (event.type) {
      case 'text':
        const shortText = (event.content || '').substring(0, 100).replace(/\n/g, ' ');
        if (shortText.trim()) {
          this.progressText = shortText.trim();
        }
        break;

      case 'tool_call':
        if (event.toolName === 'create_file') {
          this.totalFilesCreated++;
          this.filesCreated.push({
            path: event.toolInput.path,
            status: 'creating'
          });
          this.updateProgress(this.totalFilesCreated);
        } else if (event.toolName === 'execute_command') {
          this.progressText = `Running: ${event.toolInput.command}`;
        } else if (event.toolName === 'list_files') {
          this.progressText = 'Scanning project structure...';
        }
        break;

      case 'tool_result':
        if (event.toolName === 'create_file') {
          const lastFile = this.filesCreated[this.filesCreated.length - 1];
          if (lastFile) {
            lastFile.status = event.result?.success ? 'done' : 'error';
          }
        }
        break;

      case 'error':
        this.progressText = `⚠️ ${event.message}`;
        break;

      case 'done':
        this.onGenerationComplete();
        break;
    }
  }

  updateProgress(fileCount: number): void {
    const progress = Math.min(5 + (fileCount * 8), 90);
    this.progressWidth = `${progress}%`;
    this.progressText = `Creating files... (${fileCount} file${fileCount > 1 ? 's' : ''})`;
  }

  onGenerationComplete(): void {
    this.isGenerating = false;
    this.progressWidth = '100%';
    this.progressText = `Done! ${this.filesCreated.length} file${this.filesCreated.length !== 1 ? 's' : ''} generated.`;

    setTimeout(() => {
      this.showGenerationPanel = false;
      this.showCompletedPanel = true;
      this.sessionEnded = true;

      this.cdr.detectChanges();
    }, 1500);
  }

  // ============================================================
  // DOWNLOAD
  // ============================================================

  get downloadUrl(): string {
    return this.figmaService.getDownloadUrl(this.includeNodeModules);
  }

  // ============================================================
  // UTILITIES
  // ============================================================

  formatMessage(text: string): string {
    if (!text) return '';
    let formatted = this.escapeHtml(text);
    formatted = formatted.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
    formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');
    formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    formatted = formatted.replace(/\n/g, '<br>');
    return formatted;
  }

  escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  private scrollToBottom(): void {
    if (this.messagesContainer) {
      const el = this.messagesContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }
}