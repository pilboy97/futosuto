# FUTOSUTO

A browser-based visual novel engine powered by a custom scripting language called `.molu`.  
独自スクリプト言語 `.molu` で動作する、ブラウザベースのビジュアルノベルエンジンです。

---

## Demo / デモ

```
<<INIT>>
(Entryway / 玄関)
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

<<dinner>>
(Kitchen / 台所)
@A "Thanks for the meal."
@A.smile "Delicious!"
@B.smile "Hehehe~"
<</>>

<<bath>>
(Bathroom / お風呂)
@A.relaxed "Ahhh, so refreshing."
@B "I left some clean clothes for you."
@A "Thanks."
<</>>
```

---

## Getting Started / 始め方

A local web server is required because the engine uses ES Modules and `fetch`.  
ES Moduleと`fetch`を使用しているため、ローカルWebサーバーが必要です。

```bash
# Python / Pythonの場合
python -m http.server 8080
```

Open `http://localhost:8080` in your browser.  
ブラウザで `http://localhost:8080` を開いてください。

To use your own scenario, edit `script.molu` in the project root.  
シナリオを変更するには、プロジェクトルートの `script.molu` を編集してください。

---

## .molu Script Syntax / スクリプト文法

### Scene / シーン

The basic unit of a scenario. Execution begins from the `INIT` scene.  
シナリオの基本単位です。`INIT` シーンから実行が始まります。

```
<<SceneName>>
    ...content...
<</>>
```

### Location / 場所

Displays the current location on screen.  
現在地をスクリーンに表示します。

```
(LocationName)
```

### Dialogue / 台詞

```
@CharacterName "Dialogue text"
@CharacterName.emotion "Dialogue with an emotion tag"
```

The emotion tag (e.g. `.smile`, `.tired`) can be used to drive sprite expressions.  
感情タグ（例：`.smile`、`.tired`）はキャラクタースプライトの表情制御に使えます。

### Choices / 選択肢

```
[
    <"Option A">
        ...actions...
    </>
    <"Option B">
        ...actions...
    </>
]
```

### Commands / コマンド

| Command / コマンド | Description / 説明 |
|---|---|
| `!goto SceneName` | Jump to a scene / 指定シーンへジャンプ |
| `!title Text` | Display title text / タイトルテキストを表示 |

### Comments / コメント

```
// This line is ignored. / この行は無視されます。
```

---

## Project Structure / プロジェクト構成

```
/
├── index.html          # Entry point / エントリーポイント
├── index.js            # Engine initialization / エンジン初期化
├── index.css           # Styles / スタイル
├── script.molu         # Scenario file / シナリオファイル
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

### Pipeline / 処理フロー

```
script.molu
  → Lexer / 字句解析 (token.js)
    → Parser / 構文解析 (parser.js)
      → AST
        → Engine / 実行 (engine.js)
          → Screen / 描画 (screen.js)
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
