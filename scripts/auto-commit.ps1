# 自动 Git 提交脚本
# 用法: .\auto-commit.ps1 "提交描述"

$ErrorActionPreference = "Stop"

$CommitMsg = $args[0]
if (-not $CommitMsg) {
    $CommitMsg = "自动提交"
}

Set-Location $PSScriptRoot

# 检查是否有修改
$hasChanges = git status --porcelain
if (-not $hasChanges) {
    Write-Host "没有需要提交的修改" -ForegroundColor Yellow
    exit 0
}

# 添加并提交
git add -A
git commit -m "$CommitMsg"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host "本次任务所修改代码已提交至Git!!!" -ForegroundColor Green
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host ""

    # 播放提示音
    [console]::beep(800, 300)
    [console]::beep(1000, 300)
} else {
    Write-Host "提交失败" -ForegroundColor Red
    exit 1
}
