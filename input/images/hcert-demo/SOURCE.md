# hcert live demo

Built from [litlfred/smart-trust-tools](https://github.com/litlfred/smart-trust-tools)
at commit `f862552c4e7c272d28055027f805dd84a78f44d0` by `tools/hcert-rust/bundle-demo.sh`. Do not edit
these files here; change them there and rebuild.

| File | sha256 |
|---|---|
| hcert.wasm | `2847771bce598f590aa9fef2fc57bd57d56fedc693d12e58b07777d2851b2e3c` |
| hcert.js | `232c7709f9cd34a642514be927c31b74a7ce7dcc5bf53365008b080b33e10cb2` |
| hcert-demo.js | `116199f34c1214a04309f67556c7590bdb35ff67029e6980601ffefbdcc3f209` |
| hcert-demo.css | `f671101ae2d406a610c0245cebc9a7e5a140561e829167fe6e1a08e590319f6a` |
| dvc-qr-example-XXR.json | `43131a23adf01d9393cbcc4322296de242e5607893004dde02358c4ff64a2e5c` |
| XXR-DSC-did.json | `3f661f7d9f010c362c586324c5e52750c012d90f628889a6697e5f15e623bad2` |

The WebAssembly module imports nothing. Keys are generated and used by
WebCrypto in the reader's browser, and everything issued is TEST ONLY.
