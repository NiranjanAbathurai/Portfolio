# Portfolio

Niranjan Abathurai's portfolio website built with Angular and optional Netlify Functions for the chatbot experience.

## Project structure
- Frontend app: app/
- Netlify serverless functions: app/netlify/functions/

## Prerequisites
- Node.js 22.22.3+ or 24.15+ (required by the Angular CLI version used in this project)
- npm

## 1) Install dependencies
From the repository root, run:

```bash
cd app
npm install
```

## 2) Start the Angular app
Run the app with:

```bash
cd app
npm start
```

This runs:

```bash
ng serve --proxy-config proxy.conf.json
```

Open the app in your browser at:

```text
http://localhost:4200/
```

If you want to use a different port:

```bash
cd app
npm start -- --port 4210
```

## 3) Start the chatbot / Netlify functions (optional)
Open a second terminal and run:

```bash
cd app/netlify/functions
npm install
npm run local
```

## 4) Build for production
```bash
cd app
npm run build:prod
```

## Troubleshooting
- If you see a Node.js version error, update Node.js to 22.22.3+ or 24.15+.
- If dependencies are missing, run npm install again in the app folder.
- If the app does not open, check the terminal output for the actual local URL shown by Angular.