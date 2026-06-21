# Vertex 額外模型 (st-vertex-extra-models)

一個給 **SillyTavern（酒館）** 的小擴充：把 **Google Vertex AI** 還沒被內建清單收錄的新模型，補進模型下拉選單。

## 解決什麼問題

SillyTavern 的 Chat Completion → **Google Vertex AI** 來源，模型是一個寫死的下拉選單，而且**沒有自訂模型 ID 的輸入框**。所以當 Vertex 上線了新模型（例如 `gemini-3.5-flash`）、但你的 ST 版本還沒把它加進清單時，你就選不到、用不了——即使你已經是最新版酒館（代表上游還沒收錄）。

這個擴充每次載入時，自動把指定的模型補進 Vertex 下拉，選一次之後就持久（記在瀏覽器，並蓋過 ST 載入時把值重設回內建清單的行為）。

## 安裝

酒館 → 擴充面板（右上拼圖圖示）→ **Install Extension** → 貼上本 repo 的網址：

```
https://github.com/Minijinai75/st-vertex-extra-models
```

裝好後重整頁面，來源切到 **Google Vertex AI**，模型下拉最上面就會多一個「**自訂（額外）**」群組，裡面是你加的模型，選它即可。

> 它會安裝到 `data/<你的使用者>/extensions/`，所以在 Zeabur 等用 volume 跑官方映像的環境下也能持久，不用重 build 映像。

## 自訂要加哪些模型

編輯 `index.js` 最上面的陣列即可：

```js
const EXTRA_VERTEX_MODELS = [
    'gemini-3.5-flash',
    // 'gemini-3.5-flash-preview',
];
```

**請填 Vertex 實際的 model ID**（在 Google Cloud / Vertex Model Garden 看到的字串為準）。填錯的話選了會被 Vertex 回 404。

（透過網址安裝的話，要改清單就 fork 這個 repo 改你自己的，或直接改 volume 上的 `index.js`。）

## 運作原理

模型值在 ST 內部只是一個字串，後端會直接把它轉送給 Vertex；所以「在下拉多一個 `<option>` 並選它」就足夠，不需要改後端、不需要 API 金鑰。本擴充就是在前端注入那個 option，並記住你的選擇。

## 相容性

SillyTavern（Chat Completion → Google Vertex AI）。理論上同樣手法可套用到其他寫死下拉的來源，改 `model_vertexai_select` 這個 id 即可。

## License

MIT
