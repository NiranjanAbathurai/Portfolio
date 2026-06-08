import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';

export interface Agent {
  slug: string;
  name: string;
  description: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: any;
}

export interface SSEEvent {
  type: 'text' | 'tool_call' | 'tool_result' | 'error' | 'done';
  content?: string;
  message?: string;
  toolName?: string;
  toolInput?: any;
  toolId?: string;
  result?: any;
  stopReason?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AgentService {
  private baseUrl = environment.apiBaseUrl;

  constructor() {}

  // Get available agents
  async getAgents(): Promise<Agent[]> {
    const response = await fetch(`${this.baseUrl}/api/agents`);
    return response.json();
  }

  // Health check
  async getHealth(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/health`);
    return response.json();
  }

  // Simple chat (non-agentic)
  async sendChat(messages: ChatMessage[], agentSlug: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, agentSlug })
    });
    return response.json();
  }

  // Clean workspace
  async cleanWorkspace(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/workspace/clean`, {
      method: 'POST'
    });
    return response.json();
  }

  // Start agentic chat (returns Response for SSE streaming)
  startAgentChat(messages: ChatMessage[], agentSlug: string): Promise<Response> {
    return fetch(`${this.baseUrl}/api/chat/agent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, agentSlug })
    });
  }

  // Get download URL
  getDownloadUrl(includeNodeModules: boolean): string {
    return `${this.baseUrl}/api/workspace/download?includeNodeModules=${includeNodeModules}`;
  }

  // Get workspace info
  async getWorkspace(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/workspace`);
    return response.json();
  }

  // List workspace files
  async getWorkspaceFiles(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/workspace/files`);
    return response.json();
  }
}
