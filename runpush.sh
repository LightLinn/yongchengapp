#!/bin/bash

# 定義變數
REPO_PATH="/Users/lightlin/Desktop/TCStudio/Sourcecode/Projects/yongchengapp"
BRANCH_NAME="main"

# 獲取當前日期和時間
DATE_TIME=$(date +"%Y-%m-%d %H:%M:%S")


cd $REPO_PATH

git add .

# 提交更改並使用當前日期和時間作為 commit 信息
git commit -m "Update: $DATE_TIME"

# 推送更改到 GitHub
git push origin $BRANCH_NAME
