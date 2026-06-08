// Netlify Serverless Function: agent.js
// Handles all backend API logic for the Figma-to-Code Gemini AI app
// Routes: /api/agents, /api/health, /api/chat, /api/chat/agent, /api/workspace/clean, /api/workspace/download, etc.

const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
const AdmZip = require('adm-zip');
// Load .env when running locally (non-fatal if missing)
try { require('dotenv').config(); } catch (e) {}

// Ensure `fetch` is available in Node environments that don't provide it
if (typeof global.fetch !== 'function') {
  try {
    // node-fetch v2 is CommonJS-compatible
    // If not installed, code will continue and fetch calls will surface errors.
    global.fetch = require('node-fetch');
  } catch (e) {
    // leave fetch undefined; handler will report useful error if needed
  }
}

// ============================================================
// CONFIGURATION
// ============================================================
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_BASE_URL = process.env.GEMINI_BASE_URL || '';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

// Workspace directory (for Netlify, use /tmp which is writable)
const WORKSPACE_DIR = '/tmp/workspace';

// Ensure workspace exists
if (!fs.existsSync(WORKSPACE_DIR)) {
  fs.mkdirSync(WORKSPACE_DIR, { recursive: true });
}

// ============================================================
// TOOL DEFINITIONS - These are the tools Gemini can use
// ============================================================
const GEMINI_TOOLS = [
  {
    functionDeclarations: [
      {
        name: "create_file",
        description: "Create a new file or overwrite an existing file with the given content. Use this to write code files, configuration files, etc. Always provide the complete file content.",
        parameters: {
          type: "OBJECT",
          properties: {
            path: {
              type: "STRING",
              description: "The file path relative to the workspace directory (e.g., 'src/app/component.ts' or 'package.json')"
            },
            content: {
              type: "STRING",
              description: "The complete content to write to the file"
            }
          },
          required: ["path", "content"]
        }
      },
      {
        name: "read_file",
        description: "Read the contents of a file from the workspace. Use this to check existing files before modifying them.",
        parameters: {
          type: "OBJECT",
          properties: {
            path: {
              type: "STRING",
              description: "The file path relative to the workspace directory"
            }
          },
          required: ["path"]
        }
      },
      {
        name: "execute_command",
        description: "Execute a shell command in the workspace directory. Use this ONLY for npm install after creating all files. Do NOT use for scaffolding (ng new, create-react-app, etc).",
        parameters: {
          type: "OBJECT",
          properties: {
            command: {
              type: "STRING",
              description: "The shell command to execute (e.g., 'npm install')"
            }
          },
          required: ["command"]
        }
      },
      {
        name: "list_files",
        description: "List all files and directories in a given path within the workspace. Use this to understand the project structure.",
        parameters: {
          type: "OBJECT",
          properties: {
            path: {
              type: "STRING",
              description: "The directory path relative to the workspace (use '.' for root)"
            }
          },
          required: ["path"]
        }
      }
    ]
  }
];

// Default system prompt
const DEFAULT_FIGMA_SYSTEM_PROMPT = `You are an expert UI developer specializing in converting Figma designs to production-ready code.

## Your Role:
When given a Figma design screenshot, you MUST:
1. Analyze the design carefully — extract layout, colors, typography, spacing, icons, and all visual details.
2. Generate a COMPLETE, working application that matches the design pixel-perfectly.
3. Use the create_file tool to create ALL necessary files.

## Rules:
- **DO NOT use scaffolding commands** like \`ng new\`, \`create-react-app\`, \`npx create-next-app\`, etc.
- **Directly create all source files** — components, styles, configs, package.json, etc.
- After creating all files, run \`npm install\` using execute_command to install dependencies.
- Write COMPLETE file contents — no placeholders, no "// TODO", no truncation.
- Include proper package.json with all dependencies listed.
- Include all config files (tsconfig.json, angular.json, etc.) so the project runs with \`npm start\`.
- Match the design EXACTLY — colors, fonts, spacing, layout, icons.
- Use modern CSS/SCSS for styling.
- Keep text responses very brief — focus on creating files.

## Framework Selection:
- If the user specifies Angular, React, Vue, or HTML — use that.
- If not specified, ask the user which framework they prefer before generating code.

## Output:
Create every single file needed for the project to work. The user will download these files and run \`npm install && npm start\`.
`;

// ============================================================
// TOOL EXECUTION
// ============================================================
function executeTool(toolName, toolInput) {
  return new Promise((resolve) => {
    switch (toolName) {
      case 'create_file': {
        try {
          const filePath = path.join(WORKSPACE_DIR, toolInput.path);
          const dir = path.dirname(filePath);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          fs.writeFileSync(filePath, toolInput.content, 'utf8');
          resolve({ success: true, message: `File created successfully: ${toolInput.path}` });
        } catch (err) {
          resolve({ success: false, message: `Error creating file: ${err.message}` });
        }
        break;
      }

      case 'read_file': {
        try {
          const filePath = path.join(WORKSPACE_DIR, toolInput.path);
          if (!fs.existsSync(filePath)) {
            resolve({ success: false, message: `File not found: ${toolInput.path}` });
          } else {
            const content = fs.readFileSync(filePath, 'utf8');
            resolve({ success: true, content: content });
          }
        } catch (err) {
          resolve({ success: false, message: `Error reading file: ${err.message}` });
        }
        break;
      }

      case 'execute_command': {
        // In Netlify serverless, we can't run shell commands reliably
        // Return a simulated success for npm install
        resolve({
          success: true,
          stdout: 'Command noted. In serverless environment, npm install should be run locally after download.',
          stderr: '',
          exitCode: 0,
          message: 'Command acknowledged (serverless environment - run locally after download)'
        });
        break;
      }

      case 'list_files': {
        try {
          const dirPath = path.join(WORKSPACE_DIR, toolInput.path || '.');
          if (!fs.existsSync(dirPath)) {
            resolve({ success: false, message: `Directory not found: ${toolInput.path}` });
          } else {
            const items = listFilesRecursive(dirPath, WORKSPACE_DIR, 3);
            resolve({ success: true, files: items });
          }
        } catch (err) {
          resolve({ success: false, message: `Error listing files: ${err.message}` });
        }
        break;
      }

      default:
        resolve({ success: false, message: `Unknown tool: ${toolName}` });
    }
  });
}

function listFilesRecursive(dirPath, basePath, maxDepth, currentDepth = 0) {
  if (currentDepth >= maxDepth) return [];
  const items = [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === '.angular') continue;

    const relativePath = path.relative(basePath, path.join(dirPath, entry.name)).replace(/\\/g, '/');
    if (entry.isDirectory()) {
      items.push({ type: 'directory', path: relativePath });
      items.push(...listFilesRecursive(path.join(dirPath, entry.name), basePath, maxDepth, currentDepth + 1));
    } else {
      items.push({ type: 'file', path: relativePath });
    }
  }
  return items;
}

// ============================================================
// AGENT LOADING
// ============================================================
function loadAgents() {
  const agents = [];

  // In Netlify, agents are bundled with the function
  // Look for agents in the included files directory
  const agentsDir = path.join(__dirname, 'agents');

  if (!fs.existsSync(agentsDir)) {
    // Fallback: return default agents
    return [
      {
        slug: 'ui-developer',
        name: 'UI Developer',
        description: 'Interactive wizard for generating UI fields from images or documents.',
        systemPrompt: DEFAULT_FIGMA_SYSTEM_PROMPT
      },
      {
        slug: 'general-assistant',
        name: 'General Assistant',
        description: 'A general-purpose AI assistant for any task.',
        systemPrompt: 'You are a helpful AI assistant. Provide clear, accurate, and thoughtful responses.'
      }
    ];
  }

  const files = fs.readdirSync(agentsDir).filter(f => f.endsWith('.yaml') || f.endsWith('.yml'));

  for (const file of files) {
    try {
      const content = fs.readFileSync(path.join(agentsDir, file), 'utf8');
      const parsed = yaml.load(content);

      if (parsed && parsed.customModes) {
        for (const mode of parsed.customModes) {
          agents.push({
            slug: mode.slug,
            name: mode.name,
            description: mode.description || mode.whenToUse || '',
            systemPrompt: buildSystemPrompt(mode)
          });
        }
      }
    } catch (err) {
      console.error(`Error loading agent file ${file}:`, err.message);
    }
  }

  return agents.length > 0 ? agents : [
    {
      slug: 'ui-developer',
      name: 'UI Developer',
      description: 'Interactive wizard for generating UI fields from images or documents.',
      systemPrompt: DEFAULT_FIGMA_SYSTEM_PROMPT
    }
  ];
}

function buildSystemPrompt(mode) {
  let prompt = '';
  if (mode.roleDefinition) {
    prompt += mode.roleDefinition.trim() + '\n\n';
  }
  if (mode.customInstructions) {
    prompt += mode.customInstructions.trim() + '\n\n';
  }

  prompt += `
## IMPORTANT: Tool Usage Instructions

You have access to the following tools to accomplish tasks:

1. **create_file** - Create or overwrite files in the workspace. Always write complete file contents.
2. **read_file** - Read existing files to understand current state before making changes.
3. **execute_command** - Run shell commands. Use ONLY for \`npm install\` after creating all files. NEVER use for scaffolding (ng new, create-react-app, etc).
4. **list_files** - List the workspace file structure.

### Rules for Figma-to-Code Generation:
- When given a Figma design image, your job is to GENERATE THE ACTUAL UI CODE that matches the design pixel-perfectly.
- **DO NOT use scaffolding commands** like \`ng new\`, \`create-react-app\`, \`npx create-next-app\`. Instead, directly create ALL the source files.
- Create a proper project structure with all necessary config files (package.json, angular.json/tsconfig, etc.) so the project runs with \`npm start\`.
- USE THE TOOLS to actually create the files — do NOT just show code in your response text.
- Focus on creating the UI components, styles, and routing that match the Figma design exactly.
- Write COMPLETE file contents — no placeholders, no "// add logic here" comments, no truncation.
- Include all necessary imports, module declarations, and configurations.
- After creating ALL files, run \`npm install\` using execute_command.
- Keep your text responses very brief — focus on CREATING FILES via the create_file tool.
- Create every single file needed for the project to work (including index.html, main.ts, app.module.ts, styles, etc.)
`;

  return prompt.trim();
}

// ============================================================
// HELPER: Convert messages to Gemini format
// ============================================================
function convertToGeminiMessages(messages) {
  const geminiContents = [];

  for (const msg of messages) {
    const role = msg.role === 'assistant' ? 'model' : 'user';

    if (typeof msg.content === 'string') {
      geminiContents.push({
        role: role,
        parts: [{ text: msg.content }]
      });
    } else if (Array.isArray(msg.content)) {
      const parts = [];
      for (const block of msg.content) {
        if (block.type === 'text') {
          parts.push({ text: block.text });
        } else if (block.type === 'image') {
          parts.push({
            inlineData: {
              mimeType: block.source.media_type,
              data: block.source.data
            }
          });
        }
      }
      if (parts.length > 0) {
        geminiContents.push({ role: role, parts: parts });
      }
    }
  }

  return geminiContents;
}

// ============================================================
// ROUTE HANDLERS
// ============================================================

// Parse the route from the path
function getRoute(path) {
  const pathOnly = typeof path === 'string' ? path.split(/[?#]/)[0] : '';

  // Remove leading /api/ or /.netlify/functions/agent/
  const cleaned = pathOnly
    .replace(/^\/?\.netlify\/functions\/agent\/?/, '')
    .replace(/^\/?api\/?/, '')
    .replace(/\/$/, '');
  return cleaned;
}

// GET /api/agents
function handleGetAgents() {
  const agents = loadAgents();
  return {
    statusCode: 200,
    body: JSON.stringify(agents.map(a => ({
      slug: a.slug,
      name: a.name,
      description: a.description
    })))
  };
}

// GET /api/health
function handleHealth() {
  return {
    statusCode: 200,
    body: JSON.stringify({
      status: 'ok',
      model: GEMINI_MODEL,
      baseUrl: GEMINI_BASE_URL,
      agentsLoaded: loadAgents().length,
      workspace: WORKSPACE_DIR
    })
  };
}

// GET /api/workspace
function handleGetWorkspace() {
  return {
    statusCode: 200,
    body: JSON.stringify({
      path: WORKSPACE_DIR,
      exists: fs.existsSync(WORKSPACE_DIR)
    })
  };
}

// GET /api/workspace/files
function handleGetWorkspaceFiles() {
  try {
    const files = listFilesRecursive(WORKSPACE_DIR, WORKSPACE_DIR, 4);
    return {
      statusCode: 200,
      body: JSON.stringify(files)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}

// POST /api/workspace/clean
function handleCleanWorkspace() {
  try {
    if (fs.existsSync(WORKSPACE_DIR)) {
      fs.rmSync(WORKSPACE_DIR, { recursive: true, force: true });
    }
    fs.mkdirSync(WORKSPACE_DIR, { recursive: true });
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Workspace cleaned' })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Failed to clean workspace: ${err.message}` })
    };
  }
}

// POST /api/chat (simple, non-agentic)
async function handleChat(body) {
  const { messages, system, agentSlug } = body;

  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your-gemini-api-key-here') {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Gemini API key not configured. Please set GEMINI_API_KEY environment variable.' })
    };
  }

  const agents = loadAgents();
  let systemPrompt = system || '';
  if (agentSlug) {
    const agent = agents.find(a => a.slug === agentSlug);
    if (agent) systemPrompt = agent.systemPrompt;
  }

  try {
    const geminiContents = convertToGeminiMessages(messages);

    const requestBody = {
      contents: geminiContents,
      generationConfig: {
        maxOutputTokens: 4096,
        temperature: 0.7
      }
    };

    if (systemPrompt) {
      requestBody.systemInstruction = {
        parts: [{ text: systemPrompt }]
      };
    }

    const apiUrl = `${GEMINI_BASE_URL}/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.text();
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `Gemini API Error: ${errorData}` })
      };
    }

    const data = await response.json();

    if (data.error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: `Gemini Error: ${data.error.message}` })
      };
    }

    const candidate = data.candidates && data.candidates[0];
    if (!candidate || !candidate.content) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'No response from Gemini' })
      };
    }

    const textParts = candidate.content.parts
      .filter(p => p.text)
      .map(p => p.text)
      .join('');

    return {
      statusCode: 200,
      body: JSON.stringify({
        content: [{ type: 'text', text: textParts }],
        stop_reason: candidate.finishReason || 'STOP'
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server error: ${error.message}` })
    };
  }
}

// POST /api/chat/agent (agentic with SSE streaming)
async function handleAgentChat(body) {
  const { messages, agentSlug, system } = body;

  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your-gemini-api-key-here') {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'text/event-stream' },
      body: `data: ${JSON.stringify({ type: 'error', message: 'Gemini API key not configured.' })}\n\n`
    };
  }

  const agents = loadAgents();
  let systemPrompt = system || '';
  if (agentSlug) {
    const agent = agents.find(a => a.slug === agentSlug);
    if (agent) systemPrompt = agent.systemPrompt;
  }
  if (!systemPrompt) {
    systemPrompt = DEFAULT_FIGMA_SYSTEM_PROMPT;
  }

  const apiUrl = `${GEMINI_BASE_URL}/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  try {
    let geminiContents = convertToGeminiMessages(messages);
    let iterationCount = 0;
    let sseOutput = '';

    // Repetition detection
    const recentToolCalls = [];
    const MAX_REPEAT = 3;

    function getToolSignature(name, input) {
      return JSON.stringify({ name, path: input.path || '', command: input.command || '' });
    }

    function isRepeating(signature) {
      if (recentToolCalls.length < MAX_REPEAT) return false;
      const lastN = recentToolCalls.slice(-MAX_REPEAT);
      return lastN.every(s => s === signature);
    }

    function sendEvent(type, data) {
      sseOutput += `data: ${JSON.stringify({ type, ...data })}\n\n`;
    }

    while (true) {
      iterationCount++;

      if (iterationCount > 50) {
        sendEvent('error', { message: 'Maximum iterations reached (50). Stopping.' });
        sendEvent('done', { stopReason: 'max_iterations' });
        break;
      }

      const requestBody = {
        contents: geminiContents,
        tools: GEMINI_TOOLS,
        generationConfig: {
          maxOutputTokens: 8192,
          temperature: 0.7
        }
      };

      if (systemPrompt) {
        requestBody.systemInstruction = {
          parts: [{ text: systemPrompt }]
        };
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.text();
        sendEvent('error', { message: `Gemini API Error ${response.status}: ${errorData}` });
        break;
      }

      const data = await response.json();

      if (data.error) {
        sendEvent('error', { message: `Gemini Error: ${data.error.message}` });
        break;
      }

      const candidate = data.candidates && data.candidates[0];
      if (!candidate || !candidate.content) {
        sendEvent('error', { message: 'No response from Gemini' });
        break;
      }

      const responseParts = candidate.content.parts || [];
      let hasToolUse = false;
      let detectedLoop = false;
      const functionResponses = [];

      for (const part of responseParts) {
        if (part.text) {
          sendEvent('text', { content: part.text });
        } else if (part.functionCall) {
          hasToolUse = true;
          const funcCall = part.functionCall;
          const toolName = funcCall.name;
          const toolInput = funcCall.args || {};

          // Check for repetition
          const signature = getToolSignature(toolName, toolInput);
          if (isRepeating(signature)) {
            detectedLoop = true;
            sendEvent('error', {
              message: `Detected repeated action (${toolName} on "${toolInput.path || toolInput.command || ''}") called ${MAX_REPEAT}+ times. Stopping.`
            });
            break;
          }
          recentToolCalls.push(signature);

          sendEvent('tool_call', {
            toolName: toolName,
            toolInput: toolInput,
            toolId: toolName + '_' + iterationCount
          });

          // Execute the tool
          const result = await executeTool(toolName, toolInput);
          sendEvent('tool_result', {
            toolName: toolName,
            toolId: toolName + '_' + iterationCount,
            result: result
          });

          functionResponses.push({
            functionResponse: {
              name: toolName,
              response: result
            }
          });
        }
      }

      if (detectedLoop) {
        sendEvent('done', { stopReason: 'loop_detected' });
        break;
      }

      if (hasToolUse) {
        geminiContents.push({
          role: 'model',
          parts: responseParts
        });

        geminiContents.push({
          role: 'user',
          parts: functionResponses
        });
      } else {
        sendEvent('done', { stopReason: candidate.finishReason || 'STOP' });
        break;
      }

      if (candidate.finishReason === 'STOP' && !hasToolUse) {
        sendEvent('done', { stopReason: 'STOP' });
        break;
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      },
      body: sseOutput
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'text/event-stream' },
      body: `data: ${JSON.stringify({ type: 'error', message: `Server error: ${error.message}` })}\n\n`
    };
  }
}

// GET /api/workspace/download
function handleDownload() {
  try {
    const files = listFilesRecursive(WORKSPACE_DIR, WORKSPACE_DIR, 10);
    const zip = new AdmZip();

    for (const file of files) {
      if (file.type === 'file') {
        const filePath = path.join(WORKSPACE_DIR, file.path);
        try {
          const content = fs.readFileSync(filePath);
          zip.addFile(file.path, content);
        } catch (e) {
          // Skip unreadable files
        }
      }
    }

    const zipBuffer = zip.toBuffer();
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="workspace.zip"'
      },
      body: zipBuffer.toString('base64'),
      isBase64Encoded: true
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Download failed: ${err.message}` })
    };
  }
}

// ============================================================
// MAIN HANDLER
// ============================================================
exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  const route = getRoute(event.path);
  const method = event.httpMethod;

  let result;

  try {
    // Route matching
    if (method === 'GET' && route === 'agents') {
      result = handleGetAgents();
    } else if (method === 'GET' && route === 'health') {
      result = handleHealth();
    } else if (method === 'GET' && route === 'workspace') {
      result = handleGetWorkspace();
    } else if (method === 'GET' && (route === 'workspace/files')) {
      result = handleGetWorkspaceFiles();
    } else if (method === 'POST' && route === 'workspace/clean') {
      result = handleCleanWorkspace();
    } else if (method === 'GET' && (route === 'workspace/download' || route.startsWith('workspace/download'))) {
      result = handleDownload();
    } else if (method === 'POST' && route === 'chat') {
      const body = JSON.parse(event.body || '{}');
      result = await handleChat(body);
    } else if (method === 'POST' && (route === 'chat/agent')) {
      const body = JSON.parse(event.body || '{}');
      result = await handleAgentChat(body);
    } else {
      result = {
        statusCode: 404,
        body: JSON.stringify({ error: `Route not found: ${method} /${route}` })
      };
    }
  } catch (error) {
    result = {
      statusCode: 500,
      body: JSON.stringify({ error: `Internal server error: ${error.message}` })
    };
  }

  // Merge headers
  return {
    ...result,
    headers: { ...headers, ...(result.headers || {}) }
  };
};
