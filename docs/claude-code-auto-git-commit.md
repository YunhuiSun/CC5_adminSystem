# Claude Code 自动 Git 提交方案

## 方案概述

本方案实现 Claude Code 在完成代码修改任务后，自动将变更提交到本地 Git 仓库，以用户提问内容作为提交描述，便于追踪和管理代码变更历史。

---

## 实现原理

利用 Claude Code 的 `TaskCompleted` Hook 事件，在任务完成时触发 Git 提交命令。

### Hook 机制

- **事件类型**：`TaskCompleted`
- **触发时机**：Claude Code 完成一个任务（如代码修改）后
- **执行方式**：PowerShell 命令

---

## 配置步骤

### 1. 初始化 Git 仓库（如未初始化）

```bash
git init
```

### 2. 配置 settings.json

在 Claude Code 的配置文件 `~/.claude/settings.json` 中添加 `TaskCompleted` Hook：

```json
{
  "hooks": {
    "TaskCompleted": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "cd \"$PWD\"; if (git rev-parse --git-dir 2>$null) { $status = git status --porcelain; if ($status) { $files = ($status | ForEach-Object { $_.Substring(3) }) -join ', '; git add -A; git commit -m \"$(cat <<'EOF'\n$ARGUMENTS\nEOF\n)\" -m \"修改文件: $files\" --no-verify 2>$null | Out-Null; Write-Host \"已自动提交到Git: $files\" } }",
            "shell": "powershell",
            "async": false
          }
        ]
      }
    ]
  }
}
```

### 3. 重启 Claude Code 或执行 `/hooks` 使配置生效

---

## 配置详解

### 命令解析

```powershell
cd "$PWD"                                                    # 切换到当前工作目录
if (git rev-parse --git-dir 2>$null) {                       # 检查是否是 Git 仓库
    $status = git status --porcelain                          # 获取变更文件列表
    if ($status) {                                            # 如果有变更
        $files = ($status | ForEach-Object { $_.Substring(3) }) -join ', '  # 提取文件名
        git add -A                                            # 添加所有变更
        git commit -m "$ARGUMENTS" -m "修改文件: $files" --no-verify  # 提交
        Write-Host "已自动提交到Git: $files"                   # 输出提示
    }
}
```

### 关键参数

| 参数 | 说明 |
|------|------|
| `$PWD` | 当前工作目录 |
| `$ARGUMENTS` | 用户提问内容（作为提交标题） |
| `--no-verify` | 跳过 Git 钩子检查，避免阻塞 |
| `2>$null \| Out-Null` | 隐藏错误输出，静默执行 |

---

## 提交信息格式

```
<用户提问内容>

修改文件: <文件1>, <文件2>, ...
```

### 示例

```
把现代风格 这四个字改为 简约风格

修改文件: admin-system/src/components/Header/index.tsx
```

---

## 使用流程

1. **用户提问**：向 Claude Code 提出代码修改需求
2. **Claude 执行**：完成代码修改
3. **自动提交**：任务完成后自动触发 Git 提交
4. **查看历史**：使用 `git log` 查看提交记录

---

## 查看提交历史

```bash
# 简洁格式
git log --oneline -20

# 详细格式
git log --stat -5

# 图形化展示
git log --graph --oneline -10
```

---

## 注意事项

### 1. 首次提交需手动

初始项目文件需要手动提交一次：

```bash
git add -A
git commit -m "初始提交"
```

### 2. 提交范围

- 仅提交当前工作目录下的变更
- 自动添加所有变更文件（`git add -A`）
- 不推送到远程仓库（仅本地提交）

### 3. 冲突处理

如果存在合并冲突，自动提交会失败，需要手动解决：

```bash
git status          # 查看冲突文件
git add <文件>      # 解决后添加
git commit          # 手动提交
```

### 4. 大文件警告

如果修改了大量文件，提交信息中的文件列表可能很长，这是正常现象。

---

## 扩展配置

### 添加语音通知

在自动提交后添加语音播报：

```json
{
  "hooks": {
    "TaskCompleted": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "$voice = New-Object -ComObject SAPI.SPVoice; $voice.Speak('任务完成，已自动提交') | Out-Null",
            "shell": "powershell",
            "async": true
          },
          {
            "type": "command",
            "command": "cd ...",
            "shell": "powershell",
            "async": false
          }
        ]
      }
    ]
  }
}
```

### 推送到远程仓库

如需自动推送，在提交命令后添加：

```powershell
git push origin $(git branch --show-current) 2>$null | Out-Null
```

---

## 故障排查

### 提交未触发

1. 检查 settings.json 语法是否正确
2. 确认 Hook 已加载（执行 `/hooks`）
3. 检查当前目录是否是 Git 仓库

### 提交信息不正确

- `$ARGUMENTS` 变量可能在某些情况下不可用
- 可考虑使用固定格式的提交信息

### 权限问题

- Windows 需要 PowerShell 执行权限
- Git 需要配置用户名和邮箱：

```bash
git config user.name "Your Name"
git config user.email "your@email.com"
```

---

## 方案优势

| 优势 | 说明 |
|------|------|
| 自动化 | 无需手动执行 Git 命令 |
| 可追溯 | 每次修改都有明确的提交记录 |
| 上下文完整 | 提交信息包含用户原始需求 |
| 零侵入 | 不修改项目代码，仅配置 Claude Code |

---

## 适用场景

- 个人项目开发
- 快速原型迭代
- 代码实验和测试
- 需要频繁修改和记录的场景

---

## 不适用场景

- 团队协作项目（需代码审查）
- 生产环境部署
- 需要严格提交规范的项目
- 涉及敏感信息的修改

---

## 版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| v1.0 | 2026-04-03 | 初始版本，实现基本自动提交功能 |

---

## 参考文档

- [Claude Code Hooks 文档](https://docs.anthropic.com/claude-code/hooks)
- [Git 官方文档](https://git-scm.com/doc)
- [PowerShell 文档](https://docs.microsoft.com/powershell/)
