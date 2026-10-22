# hcert live demo

Built from [litlfred/smart-trust-tools](https://github.com/litlfred/smart-trust-tools)
at commit `4ceb7a4d4d7832497b289cd140aef292c320ef5e` by `tools/hcert-rust/bundle-demo.sh`. Do not edit
these files here; change them there and rebuild.

| File | sha256 |
|---|---|
| hcert.wasm | `e003c8a0e49df8a77236603136f8d9638e70d6866ad6b5461d3364615a67a92b` |
| hcert.js | `232c7709f9cd34a642514be927c31b74a7ce7dcc5bf53365008b080b33e10cb2` |
| hcert-demo.js | `0dc30b94949b533422c0011de7e487721959cd407a2e06b4412d964e394792cd` |
| hcert-demo.css | `b5aab700f1c693da3f107d3b165f6f1821cfaa8dbf0bceef940eef82194209f4` |

The WebAssembly module imports nothing. Keys are generated and used by
WebCrypto in the reader's browser, and everything issued is TEST ONLY.
