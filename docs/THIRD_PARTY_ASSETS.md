# Third-party reference assets

## Phonetics teaching assets

教師用の形状参照として、次の公開資料をGitHub Pagesのデプロイ時に取得します。

- Upstream: `drammock/phonetics-teaching-assets`
- Pinned commit: `4d02e4aadcef2f8f6b92d2e55b43e8d61e8ce39e`
- License: CC0 1.0 Universal
- Original context: University of Washington Linguistics Departmentで作成された音声学教育用の口腔矢状断図

| 保存先 | 上流ファイル | Git blob SHA |
|---|---|---|
| `site/assets/vendor/phonetics/neutral.svg` | `midsaggital_articulations/consonants/svg/neutral.svg` | `fed35bbdaf29939a4d8601e1449e2153767d7f74` |
| `site/assets/vendor/phonetics/vowel_i.svg` | `midsaggital_articulations/vowels/svg/i.svg` | `4d0f137ed8608cb7df2b65564a0b1c6b9f9f5ff9` |

`scripts/fetch_reference_assets.sh`は固定コミットから取得し、`git hash-object`によって内容を照合します。

## 使用上の位置づけ

これらは形状・部位関係を検討するための教師用基準資料です。現行アニメーションの正確性、日本語・北部ベトナム語・Cebu City系セブアノ語の調音、個々の学習者の口腔形状を保証するものではありません。
