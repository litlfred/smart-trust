# hcert live demo

Built from [litlfred/smart-trust-tools](https://github.com/litlfred/smart-trust-tools)
at commit `1c2d309cb1bd07b93fb257df8c623330b3244db2` by `tools/hcert-rust/bundle-demo.sh`. Do not edit
these files here; change them there and rebuild.

| File | sha256 |
|---|---|
| hcert.wasm | `d15a1768be1f2b6452b41455ad9bf31a9d9f3343d853740e77f94da9a7540a46` |
| hcert.js | `232c7709f9cd34a642514be927c31b74a7ce7dcc5bf53365008b080b33e10cb2` |
| hcert-demo.js | `974ba34c822aa799d5d6dd34ea61e16d34f0d15d1ee70f6f7b355c5469b58624` |
| hcert-demo.css | `f671101ae2d406a610c0245cebc9a7e5a140561e829167fe6e1a08e590319f6a` |
| dvc-qr-example-XXR.json | `43131a23adf01d9393cbcc4322296de242e5607893004dde02358c4ff64a2e5c` |

The WebAssembly module imports nothing. Keys are generated and used by
WebCrypto in the reader's browser, and everything issued is TEST ONLY.
