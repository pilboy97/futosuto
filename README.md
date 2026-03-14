# FUTOSUTO

A lightweight visual novel engine that runs in the browser.  
Scenarios are written in a custom scripting language called `.molu`.

ブラウザで動作する軽量ビジュアルノベルエンジンです。  
独自スクリプト言語 `.molu` でシナリオを記述します。

---

## Demo / デモ

```
<<INIT>>
(玄関 / Entryway)
@A.tired "I'm home."
@B.smile "Welcome back. Dinner first, or bath first?"
[
    <"Dinner first">
        !goto dinner
    </>
    <"Bath first">
        !goto bath
    </>
]
<</>>
```

---

## Project Structure / プロジェクト構成

```
/
├── index.html          # Entry point / エントリーポイント
├── index.js            # Engine initialization / エンジン初期化
├── index.css           # Styles / スタイル
├── script.molu         # Game scenario / ゲームシナリオ
└── script/
    ├── engine.js       # Game loop & scene runner / ゲームループ・シーン実行
    ├── screen.js       # Canvas rendering / Canvas描画
    ├── parser.js       # .molu parser / パーサー
    ├── token.js        # Lexer / レクサー
    ├── symbol.js       # Token symbol definitions / トークン定義
    ├── struct.js       # AST node structures / ASTノード構造体
    ├── script.js       # Script loading pipeline / スクリプト読み込み
    └── common.js       # Utility functions / ユーティリティ
```

---

## Getting Started / 始め方

A local web server is required due to ES Modules and `fetch` usage (`file://` protocol is not supported).  
ES Moduleと`fetch`を使用しているため、ローカルWebサーバーが必要です（`file://`プロトコル不可）。

```bash
# Using Python's built-in server / Pythonの内蔵サーバーを使う場合
python -m http.server 8080
```

Open `http://localhost:8080` in your browser to start the game.  
ブラウザで `http://localhost:8080` を開くとゲームが起動します。

---

## .molu Script Syntax / スクリプト文法

### Scene / シーン

The basic unit of a scenario. The `INIT` scene is the entry point.  
シナリオの基本単位です。`INIT` シーンが開始地点になります。

```
<<SceneName>>
    ...content...
<</>>
```

### Location / 場所

```
(LocationName)
```

### Dialogue / 台詞

```
@CharacterName "Dialogue text"
@CharacterName.emotion "Dialogue with emotion tag"
```

### Choices / 選択肢

```
[
    <"Option text">
        ...actions...
    </>
    <"Another option">
        ...actions...
    </>
]
```

### Commands / コマンド

| Command / コマンド | Description / 説明 |
|---|---|
| `!goto SceneName` | Jump to the specified scene / 指定シーンへ移動 |
| `!title Text` | Display a title on screen / タイトルテキストを表示 |

### Comments / コメント

```
// This line is ignored. / この行は無視されます。
```

---

## Tech Stack / 技術スタック

| | |
|---|---|
| Language / 言語 | Vanilla JavaScript (ES Modules) |
| Rendering / 描画 | HTML5 Canvas API |
| Font / フォント | [Gowun Dodum](https://fonts.google.com/specimen/Gowun+Dodum) (Google Fonts) |
| Build Tool / ビルドツール | None — runs directly in browser / なし（ブラウザで直接実行） |

---

## License / ライセンス

See the `LICENSE` file for details. / 詳細は `LICENSE` ファイルを参照してください。
