# 录播演示系统

自动录制系统演示视频，配备 AI 语音解说和字幕。

## 功能特性

- **自动录制**: 使用 Playwright 自动录制屏幕操作
- **AI 语音解说**: 支持 **Edge TTS（免费）** 和 **Azure AI 语音（付费）**
- **自动生成字幕**: 支持 SRT 和 ASS 格式，自动烧录到视频中
- **时间轴控制**: 通过 JSON 配置精确控制每个场景的操作和解说

## 快速开始

### 方式一：使用 Edge TTS（推荐，免费）

无需任何配置，直接运行：

```bash
npm run demo:record
```

### 方式二：使用 Azure AI 语音（需要订阅）

```bash
# 设置 Azure 语音密钥
$env:AZURE_SPEECH_KEY="your-azure-speech-key"

# 运行
npm run demo:record -- --azure
```

## 使用说明

```bash
# 默认使用 Edge TTS（免费）
npm run demo:record

# 显示浏览器窗口（便于调试）
npm run demo:headed

# 保留临时文件
npm run demo:keep

# 使用 Azure AI 语音（需要配置密钥）
npm run demo:record -- --azure
```

## TTS 方案对比

| 特性 | Edge TTS | Azure AI 语音 |
|------|----------|---------------|
| **价格** | **完全免费** | 每月 50 万字符免费，超出后付费 |
| **语音质量** | 神经网络语音，质量高 | 神经网络语音，质量高 |
| **稳定性** | 非官方 API，可能变化 | 官方 API，稳定可靠 |
| **网络要求** | 需要联网 | 需要联网 |
| **配置** | 无需配置 | 需要订阅密钥 |

**推荐**：日常使用选择 **Edge TTS**，企业级应用选择 **Azure AI 语音**。

## 配置演示场景

编辑 `demo-recorder/timeline.json`：

```json
{
  "title": "演示标题",
  "description": "演示描述",
  "scenes": [
    {
      "id": "login",
      "title": "登录",
      "duration": 8000,
      "narration": "欢迎使用系统，首先进行登录。",
      "actions": [
        { "type": "goto", "url": "http://localhost:5178" },
        { "type": "fill", "selector": "input[name='username']", "value": "admin" },
        { "type": "click", "selector": "button[type='submit']" }
      ]
    }
  ]
}
```

## 可用语音

### Edge TTS / Azure 共同支持的语音

| 语音名称 | 性别 | 描述 |
|---------|------|------|
| `zh-CN-XiaoxiaoNeural` | 女 | 晓晓，活泼自然 |
| `zh-CN-XiaoyiNeural` | 女 | 晓伊，温柔甜美 |
| `zh-CN-YunjianNeural` | 男 | 云健，专业稳重 |
| `zh-CN-YunxiNeural` | 男 | 云希，年轻活力 |
| `zh-CN-YunxiaNeural` | 男 | 云夏，成熟磁性 |

修改 `index.js` 中的 `voiceName` 即可切换语音。

## 场景操作类型

支持以下 Playwright 操作：

| 类型 | 参数 | 说明 |
|-----|------|------|
| `goto` | `url` | 导航到指定 URL |
| `click` | `selector` | 点击元素 |
| `fill` | `selector`, `value` | 填写输入框 |
| `wait` | `ms` | 等待指定毫秒 |
| `waitForURL` | `pattern` | 等待 URL 匹配 |
| `waitForSelector` | `selector` | 等待元素出现 |
| `screenshot` | `path`, `fullPage` | 截图 |

## 输出文件

运行后生成以下文件：

```
demo-recorder/output/
├── audio/              # 临时音频文件（自动清理）
├── videos/
│   └── demo-final-*.mp4  # 最终视频文件
└── subtitles/          # 临时字幕文件（自动清理）
```

## 故障排除

### Edge TTS 生成失败

1. 检查网络连接（需要访问微软服务器）
2. 确保已安装 Python 和 pip
3. 尝试手动安装 edge-tts：`pip install edge-tts`

### Azure 语音合成失败

1. 检查 `AZURE_SPEECH_KEY` 是否正确设置
2. 检查网络连接（需要访问 Azure 服务）
3. 查看 Azure 订阅是否有足够额度

### ffmpeg 未找到

确保 ffmpeg 已安装并添加到 PATH：
```bash
ffmpeg -version
```

### Playwright 浏览器未找到

```bash
npx playwright install chromium
```

## 技术栈

- **录制**: Playwright
- **语音**: 
  - Edge TTS（免费，基于微软 Edge）
  - Azure Cognitive Services Speech SDK（付费，官方）
- **字幕**: 自定义 SRT/ASS 生成器
- **合并**: ffmpeg

## 许可证

MIT
