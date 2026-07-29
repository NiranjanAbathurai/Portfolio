
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {
  "src/app/mini-projects/mini-projects.module.ts": [
    "chunk-HPCHMOG5.js"
  ]
},
  assets: {
    'index.csr.html': {size: 6974, hash: 'e7be7fba1fd1594decf485c0232dd8623e3151a3e684ba9dcb1d1ac7e4a7ee18', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 2665, hash: '07553eb53abaab0db3669f59c3ef642ff03b5a424622ee0a5cb3ae94d6b9772e', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-UI424BWB.css': {size: 227715, hash: 'ejrSw3WuaNU', text: () => import('./assets-chunks/styles-UI424BWB_css.mjs').then(m => m.default)}
  },
};
