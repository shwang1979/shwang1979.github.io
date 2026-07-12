---
agent: agent
description: "將 github-pages 專案中已修改的內容 commit 並 push 到 GitHub Pages 發佈上線。Use when: 完成網頁編輯後要發佈、上線、部署、publish、push to github pages、發佈到 github pages。"
argument-hint: "(可選) 要發佈的檔案或目錄，預設為所有已變更檔案"
---

# 🚀 發佈到 GitHub Pages

將 `/home/shwang/mywork/github-pages` 專案中已修改的內容 commit 並 push 到
`origin/master`，觸發 GitHub Pages 自動部署。

## 專案資訊

- **本地目錄**：`/home/shwang/mywork/github-pages`
- **GitHub 遠端**：`https://github.com/shwang1979/shwang1979.github.io.git`
- **分支**：`master`
- **發佈網址**：`https://shwang1979.github.io/`

## 執行步驟

1. **確認變更**：在 `/home/shwang/mywork/github-pages` 執行 `git status` 與
   `git diff`（或針對 `$ARGUMENTS` 指定的路徑），了解本次修改了哪些檔案、改了什麼內容。
   - 若沒有任何變更，直接告知使用者「目前沒有需要發佈的變更」，並停止後續步驟。

2. **暫存變更**：
   - 若使用者有指定檔案／目錄（`$ARGUMENTS`），只 `git add` 這些路徑。
   - 否則 `git add -A` 加入所有新增/修改/刪除的檔案。

3. **產生 commit 訊息**：根據 `git diff --staged` 的實際內容，自動生成一句
   **繁體中文、語意化**的 commit message，precisely 描述這次改了什麼（例如新增了
   什麼功能、修改了哪個頁面/哪一天的行程、調整了什麼樣式)。
   - 參考本專案既有的 commit 慣例（`git log --oneline -10` 可查看），大多是直接的中文描述句，
     不強制要求 `feat:`/`fix:` 前綴，但若變更明確屬於某類型也可以加上。
   - 不要用「update files」「minor changes」這類空泛訊息。

4. **Commit**：使用產生的訊息執行 `git commit -m "..."`。

5. **Push 前確認**：因為這是 push 到公開的 `shwang1979.github.io` 正式站台，
   **务必先用 ask-questions 工具跟使用者確認一次**（顯示將要 push 的 commit
   訊息與檔案清單），使用者同意後才執行 `git push origin master`。

6. **完成回報**：push 成功後，簡短回覆：
   - commit hash 與訊息
   - 對應會更新的頁面網址（`https://shwang1979.github.io/<相對路徑>`）
   - 提醒 GitHub Pages 部署通常需要 1–2 分鐘，若看到舊版可強制重新整理（Ctrl+Shift+R）

## 注意事項

| 情境 | 處理方式 |
|------|----------|
| 目前分支不是 `master` | 提醒使用者，詢問是否仍要 push，或先切回 `master` |
| `git push` 失敗（例如落後 origin） | 建議先 `git pull --rebase origin master` 再重試，不要用 `--force` |
| 變更包含大量不相關檔案 | 提醒使用者確認是否要一併發佈，或改用指定路徑的方式只發佈部分檔案 |
