
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {
  "src/app/mini-projects/mini-projects.module.ts": [
    "chunk-DQSUUH7Q.js"
  ]
},
  assets: {
    'index.csr.html': {size: 6353, hash: 'eb38b2e66541e115a2ce78cf4c04516c71243789f76ffc33f888d506309e4d82', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 2122, hash: '569099f131d23ee6ad21eedefe40e8977837c5c4c75556765c2b99ca0f0a5f9e', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-BKGDJYTQ.css': {size: 227632, hash: 'ZsYQghLbFRc', text: () => import('./assets-chunks/styles-BKGDJYTQ_css.mjs').then(m => m.default)}
  },
};
