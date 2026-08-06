# 発音比較・口腔図アプリ MVP

技能実習生・育成就労生等への日本語発音指導で使用する、教師提示中心の静的Webアプリです。

## 現在のMVP範囲

- 日本語：東京方言を基礎とする共通語モデル
- 比較候補：北部ベトナム語・ハノイ系
- 比較候補：セブアノ語（Bisaya／Binisaya・Cebu City系）
- 対象音：「し」「ふ」「ら」
- 教師用画面と学習者用画面を分離
- `BroadcastChannel` と `localStorage` による同一ブラウザ内同期
- SVG＋JavaScriptによる口腔運動の暫定可視化

## 公開URL

GitHub Pagesのデプロイ成功後、次のURLで公開されます。

`https://testeste55555.github.io/pronunciation_comparision_practice/`

## 使い方

1. 教師用画面（トップページ）を開きます。
2. 「学習者画面を開く」を押します。
3. 学習者画面をプロジェクターまたは外部ディスプレイへ移動します。
4. 教師画面で、比較候補、対象音、提示内容を選択します。
5. 説明時には「投影をロック」、緊急時には「即時に無地」を使用します。

学習者画面には、文字、IPA、専門用語、言語名、操作部品を表示しません。

## ローカル起動

ES Modulesを使用しているため、ファイルを直接ダブルクリックせず、簡易HTTPサーバーを利用してください。

```bash
cd site
python -m http.server 8000
```

教師用：`http://localhost:8000/`

学習者用：`http://localhost:8000/learner.html`

## 音声について

現MVPには、模範音として使用できる音声を収録していません。ブラウザTTSを正確な発音モデルとして自動採用していません。

音声を追加する場合は、著作権、話者の同意、公開範囲を確認したファイルだけを `site/assets/audio/public/` に配置してください。

次のディレクトリは `.gitignore` により公開対象外です。

- `recordings/`
- `learner-recordings/`
- `participant-data/`
- `unreviewed-audio/`
- `site/assets/audio/private/`
- `site/assets/audio/staging/`
- `site/assets/audio/raw/`

## `.gitignore`の設計方針

本リポジトリは公開GitHub Pagesを前提としているため、通常の生成物だけでなく、次を明示的にGit管理対象外としています。

- APIキー、`.env`、証明書、認証情報
- 学習者の録音・個人情報
- 同意書・面談記録・生データ
- 未許諾または未監修の母語話者音声
- ローカル音声ステージング領域
- ビルド成果物、依存パッケージ、ログ、テスト出力
- OS・エディタ固有ファイル

公開可能な音声は、自動的に例外扱いしません。権利確認後に担当者が明示的に公開用ディレクトリへ移す運用です。

## データの扱い

現時点の口腔位置と母語比較モデルは、UI動作確認用の暫定値です。国籍・母語による発音の断定や、自動診断には使用できません。

各モデルには `status: provisional` と確度を保持しています。詳細は [`docs/DATA_STATUS.md`](docs/DATA_STATUS.md) を参照してください。

## ファイル構成

```text
.
├─ .github/workflows/pages.yml
├─ .gitignore
├─ README.md
├─ docs/
│  ├─ DATA_STATUS.md
│  └─ TEST_REPORT.md
└─ site/
   ├─ index.html
   ├─ learner.html
   └─ assets/
      ├─ data.js
      ├─ learner.js
      ├─ mouth.js
      ├─ styles.css
      └─ teacher.js
```

## 新しい音・言語の追加

`site/assets/data.js` に、教師情報とアニメーション用の数値モデルを追加します。UIコードへ音ごとの値を直接埋め込まないでください。

母語比較モデルを追加する際は、次を必須とします。

- 発音変種・地域を明記
- 参考資料を記録
- `status` と `confidence` を設定
- 母語話者または音声学担当者の確認状況を記録
- 「代表的傾向」であり個人診断ではないことを維持

## GitHub Pages

`main`へのpushで `.github/workflows/pages.yml` が静的サイトをデプロイします。ワークフローは `site/` だけを公開成果物としてアップロードするため、リポジトリ内の資料や非公開ディレクトリを誤ってPagesへ含めにくい構成です。
