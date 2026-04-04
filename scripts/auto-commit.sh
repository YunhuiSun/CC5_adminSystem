#!/bin/bash

# 自动 Git 提交脚本
# 用法: ./auto-commit.sh "提交描述"

COMMIT_MSG="${1:-自动提交}"

cd "$(dirname "$0")"

# 检查是否有修改需要提交
if git diff --quiet HEAD && git diff --cached --quiet HEAD; then
    echo "没有需要提交的修改"
    exit 0
fi

# 添加所有修改的文件
git add -A

# 提交并推送
git commit -m "$COMMIT_MSG"

if [ $? -eq 0 ]; then
    echo ""
    echo "=========================================="
    echo "本次任务所修改代码已提交至Git!!!"
    echo "=========================================="
    echo ""

    # 播放提示音（Windows）
    if command -v powershell &> /dev/null; then
        powershell -c "[System.Media.SystemSounds]::Beep.Play()" 2>/dev/null || true
    fi
else
    echo "提交失败"
    exit 1
fi
