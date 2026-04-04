@echo off
chcp 65001 >nul

REM 自动 Git 提交脚本
REM 用法: auto-commit.bat "提交描述"

cd /d "%~dp0"

set COMMIT_MSG=%~1
if "%COMMIT_MSG%"=="" set COMMIT_MSG=自动提交

REM 检查是否有修改
git diff --quiet HEAD && git diff --cached --quiet HEAD
if %errorlevel% == 0 (
    echo 没有需要提交的修改
    exit /b 0
)

REM 添加并提交
git add -A
git commit -m "%COMMIT_MSG%"

if %errorlevel% == 0 (
    echo.
    echo ==========================================
    echo 本次任务所修改代码已提交至Git!!!
    echo ==========================================
    echo.

    REM 播放提示音
    powershell -c "[console]::beep(800, 300)" 2>nul
    powershell -c "[console]::beep(1000, 300)" 2>nul
) else (
    echo 提交失败
    exit /b 1
)
