# Portfolio App

This folder contains the Angular frontend for the portfolio website.

## Requirements
- Node.js 22.22.3+ or 24.15+
- npm

## Install dependencies
```bash
cd app
npm install
```

## Start the development server
```bash
cd app
npm start
```

Then open:
```text
http://localhost:4200/
```

## Optional: use a custom port
```bash
cd app
npm start -- --port 4210
```

## Build for production
```bash
cd app
npm run build:prod
```

## Optional: run Netlify functions locally
```bash
cd app/netlify/functions
npm install
npm run local
```

## Troubleshooting
- If the start command fails with a Node.js version error, upgrade Node.js to a compatible version.
- If the app does not start, run npm install again and verify that the Angular CLI can resolve dependencies.
