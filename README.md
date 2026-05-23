# 🚀 Goldfish Android Emulator - 部署至 GitHub Pages 說明指南

若您在部署至 GitHub Pages 後遇到 **全白畫面 (Blank White Screen)**，這是非常正常的現象！

這是因為 GitHub Pages 預設會直接將您的原始碼目錄（包含 `.tsx` 以及 `.ts` 檔案）當成靜態網頁直接傳給瀏覽器。然而，**瀏覽器看不懂未編譯的 TypeScript 與 React 語章 (JSX)**，因此會直接報出 JS 執行語法錯誤，導致畫面呈現一片空白。

為了完美解決這個問題，我們為您配置了自動化的 **GitHub Actions 工作流**。每次您將程式碼推送到 GitHub，系統將自動為您編譯為高品質、最佳化的純 HTML/JS 靜態檔案並一鍵安全部屬！

---

## 🛠️ 三步修復！設定 GitHub Pages 使用 GitHub Actions 部署

請按照以下簡單步驟調整您的 GitHub 儲存庫 (Repository) 設定：

1. **進入專案設定：**
   - 開啟您的 GitHub 儲存庫頁面 (`https://github.com/您的帳號/Frozen-Village`)。
   - 點擊上方導覽列的 **⚙️ Settings (設定)**。

2. **切換到 Pages 頁面：**
   - 在左側選單中，找到 **Code and automation** 區塊，點擊 **Pages**。

3. **變更部署來源 (Source)：**
   - 在 **Build and deployment** 下方的 **Source** 下拉選單中。
   - 將原本的 `Deploy from a branch` 改選為 **`GitHub Actions`**。

✨ **完成了！** 現在，只要您向 `main` 或 `master` 分支推送任何一筆代碼 commit，GitHub Actions 就會自動觸發並完成構建。您可以在儲存庫的 **Actions** 頁籤中即時觀察部署進度，部署完成後，您的 GitHub Pages 便可完美運行，不再出現空白頁面囉！

---

## ❄️ 離線沙盒相容設計 (Offline/Static Compatibility)

本模擬器已針對 GitHub Pages 靜態代管環境做了全面的極致優化：
- **網頁瀏覽器 (Chrome) & 聊天 (Chat App) 離線模擬**：在 GitHub Pages 靜態預覽下，若連結外部伺服器失效，系統會自動在瀏覽器中啟動「本機靜態代理解析」與「本地 AI 對答機制」，讓您可以完美體驗模擬器所有功能。
- **APK 直接安裝與合成**：拖放 APK 安裝檔案至桌面後，本機內核將完美接管解析，為您生對應的虛擬應用組件，不需要任何雲端伺服器！
