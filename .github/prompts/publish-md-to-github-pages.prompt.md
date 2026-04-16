---
mode: agent
description: 將 Markdown 旅遊/文件頁面轉換為 HTML 並發佈到 GitHub Pages（含 git push）
---

# 📄 Markdown → GitHub Pages 發佈流程

## 使用情境
當你有一份 Markdown 文件（旅遊行程、筆記、文件等），需要：
1. 轉換為美觀的 HTML 靜態頁面
2. 整合到現有的 GitHub Pages 專案
3. Git commit & push 發佈上線

---

## 專案資訊（請依實際情況填寫）

- **本地 GitHub Pages 目錄**：`/home/shwang/mywork/github-pages`
- **GitHub 遠端**：`https://github.com/shwang1979/shwang1979.github.io.git`
- **發佈後網址**：`https://shwang1979.github.io/`
- **共用 CSS**：`assets/css/common.css`（含 CSS variables、button、body font）

---

## 步驟 SOP

### Step 1 — 確認來源 Markdown
- 閱讀完整 Markdown 檔案，掌握：結構（標題層級）、特殊區塊（表格、清單、警告）、外部連結
- 確認目標輸出目錄（通常與 .md 同層）

### Step 2 — 建立 HTML 頁面

#### 檔案位置
```
github-pages/
  docs/
    <類別>/           ← 例如 travel/
      <子目錄>/       ← 例如 2026-日本福岡/
        index.html    ← 新建此檔
        <source>.md   ← 原始 Markdown
```

#### HTML 頁面必備結構
```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="...">
  <title>頁面標題</title>
  <!-- 相對路徑引用共用 CSS（從 docs/travel/<子目錄>/ 算起）-->
  <link rel="stylesheet" href="../../../assets/css/common.css">
  <style>/* 頁面專屬 CSS */</style>
</head>
<body>
  <!-- header、nav、main content、footer -->
  <!-- 返回首頁連結：<a href="../../../index.html"> -->
</body>
</html>
```

#### 旅遊行程頁面設計模式（可複用）
- **黏性導覽列**：`position: sticky; top: 0` 含錨點連結
- **Day 卡片**：每天一個 `<section id="dayN">`，含標題色帶 + 景點卡
- **可展開參考文章**：`<button onclick="toggleRef(this)">` + `display:none` 切換
- **互動清單**：`<input type="checkbox">` + `<label>`
- **航班/重要資訊 Banner**：深色背景全寬橫幅

#### CSS 設計原則
- 使用 `common.css` 的 CSS variables（`--color-primary`、`--shadow-small` 等）
- 色系以日本風為例：`#BC2131`（日本紅）、`#FDF6EC`（奶油米）、`#1a6fa8`（藍）
- `clamp()` 處理響應式字體；`flex-wrap` 處理小螢幕

### Step 3 — 更新首頁入口

編輯 `github-pages/index.html`，在 `.app-grid` 中新增卡片：
```html
<a href="docs/<類別>/<子目錄>/" class="app-card">
  <span class="app-badge">新上線</span>
  <div class="app-icon">🗾</div>
  <h2>頁面標題</h2>
  <p>簡短描述</p>
</a>
```
> 將原本的 `Coming Soon` 佔位卡片替換，並在後面補一個新的 `Coming Soon`。

### Step 4 — 驗證（可選）
```bash
# 本地預覽（需 Python）
cd /home/shwang/mywork/github-pages
python3 -m http.server 8080
# 開啟 http://localhost:8080
```

### Step 5 — Git 發佈
```bash
cd /home/shwang/mywork/github-pages

# 加入所有新增/修改的檔案
git add index.html docs/

# Commit（使用語義化 commit message）
git commit -m "feat: 新增<頁面名稱>頁面 v<版本>

- 新增 docs/<路徑>/index.html：<簡述>
- index.html：首頁新增<頁面名稱>入口卡片"

# Push（GitHub Pages 會自動部署，約 1–2 分鐘後生效）
git push origin master
```

---

## 常見注意事項

| 問題 | 解法 |
|------|------|
| CSS 路徑錯誤（頁面無樣式）| 從 HTML 檔案位置數相對路徑層數，`docs/travel/子目錄/` = `../../../` |
| 中文目錄名稱 | git 支援，但 URL 需 URL encode；HTML 內 `href` 直接寫中文即可 |
| 圖片資源 | 放在 `assets/images/` 或頁面同層，避免空格 |
| Push 需要認證 | 使用 GitHub PAT 或 SSH key，確認 remote URL 格式 |
| 更新後看到舊版 | GitHub Pages 約 1–2 分鐘部署，強制刷新（Ctrl+Shift+R）|

---

## 輸出確認清單

- [ ] `docs/<類別>/<子目錄>/index.html` 建立完成
- [ ] `index.html` 首頁卡片更新
- [ ] `git add` 包含所有新增/修改檔案
- [ ] `git commit` 有語義化訊息
- [ ] `git push origin master` 成功（看到 `master -> master`）
- [ ] GitHub Pages 網址可正常瀏覽

---

## 實際案例參考

- **福岡旅遊行程 v1.3**（2026-04-16）
  - 來源：`docs/travel/2026-日本福岡/fukuoka-2026-v1.3.md`
  - 輸出：`docs/travel/2026-日本福岡/index.html`
  - 上線：`https://shwang1979.github.io/docs/travel/2026-日本福岡/`
  - Commit：`4622d3a`
