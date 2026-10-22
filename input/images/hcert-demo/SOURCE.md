# hcert live demo

Built from [litlfred/smart-trust-tools](https://github.com/litlfred/smart-trust-tools)
at commit `b6c88bb6c005ec5f15fdb066100df43ac14be865` by `tools/hcert-rust/bundle-demo.sh`. Do not edit
these files here; change them there and rebuild.

| File | sha256 |
|---|---|
| hcert.wasm | `e95999591bf7fcfb2dc22afba98114a267e77c422fb4d5a3f1e6c5f76c82a114` |
| hcert.js | `232c7709f9cd34a642514be927c31b74a7ce7dcc5bf53365008b080b33e10cb2` |
| hcert-demo.js | `36c4e9474698dbccefba5fc5a00837879146eac3ab8d64e58b964f7ddbd0855e` |
| hcert-demo.css | `f671101ae2d406a610c0245cebc9a7e5a140561e829167fe6e1a08e590319f6a` |
| dvc-qr-example-XXR.json | `43131a23adf01d9393cbcc4322296de242e5607893004dde02358c4ff64a2e5c` |

The WebAssembly module imports nothing. Keys are generated and used by
WebCrypto in the reader's browser, and everything issued is TEST ONLY.
