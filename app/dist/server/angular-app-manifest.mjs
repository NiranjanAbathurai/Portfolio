
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {
  "src/app/mini-projects/mini-projects.module.ts": [
    "chunk-AQ6TOWUJ.js"
  ]
},
  assets: {
    'index.csr.html': {size: 6433, hash: '8c78784bb54809cfd7a703caa5b5176293d3f760351283b11cb09f7116e6c0be', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 2122, hash: 'fdf8db3e22da83d5e8d902eeecbf3f8156365abb06b6937d029add7c111438ab', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-UI424BWB.css': {size: 227715, hash: 'ejrSw3WuaNU', text: () => import('./assets-chunks/styles-UI424BWB_css.mjs').then(m => m.default)}
  },
};
