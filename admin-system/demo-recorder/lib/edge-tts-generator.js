import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Edge TTS 音频生成器 - 使用微软 Edge 免费在线语音合成
 * 优点：完全免费，语音质量高，支持多种中文语音
 * 缺点：需要联网，非官方 API
 */
class EdgeTTSGenerator {
  constructor(options = {}) {
    this.outputDir = options.outputDir || path.join(__dirname, '../output/audio');
    // 默认使用晓晓（女声）
    this.voice = options.voice || 'zh-CN-XiaoxiaoNeural';
    // 语速调整 (-50% 到 +50%)
    this.rate = options.rate || '+0%';
    // 音量调整
    this.volume = options.volume || '+0%';
    // 音调调整
    this.pitch = options.pitch || '+0Hz';
  }

  /**
   * 初始化输出目录
   */
  init() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * 生成 SSML 文本
   * @param {string} text - 要转换的文本
   * @returns {string} - SSML 格式文本
   */
  generateSSML(text) {
    // 转义 XML 特殊字符
    const escapedText = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

    return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="zh-CN">
  <voice name="${this.voice}">
    <prosody rate="${this.rate}" pitch="${this.pitch}" volume="${this.volume}">
      ${escapedText}
    </prosody>
  </voice>
</speak>`;
  }

  /**
   * 生成单个音频文件（使用 Edge TTS）
   * @param {string} text - 要转换的文本
   * @param {string} outputFile - 输出文件路径
   * @returns {Promise<string>} - 返回输出文件路径
   */
  async generateAudio(text, outputFile) {
    const ssml = this.generateSSML(text);

    // 构建 edge-tts 命令行参数
    const args = [
      'edge-tts',
      '--voice', this.voice,
      '--rate', this.rate,
      '--volume', this.volume,
      '--pitch', this.pitch,
      '--write-media', `"${outputFile}"`,
      '--text', `"${text.replace(/"/g, '\\"')}"`
    ];

    try {
      // 尝试使用 npx 运行 edge-tts
      execSync(`npx ${args.join(' ')}`, {
        stdio: 'pipe',
        timeout: 60000,
        cwd: process.cwd()
      });

      console.log(`✓ 音频生成成功: ${path.basename(outputFile)}`);
      return outputFile;
    } catch (error) {
      // 如果 npx 失败，尝试使用 Python 版本的 edge-tts
      return this.generateAudioWithPython(text, outputFile);
    }
  }

  /**
   * 使用 Python 版本的 edge-tts 作为备选
   */
  async generateAudioWithPython(text, outputFile) {
    const ssml = this.generateSSML(text);
    const tempSsmlFile = path.join(this.outputDir, `temp-${Date.now()}.ssml`);

    fs.writeFileSync(tempSsmlFile, ssml, 'utf-8');

    try {
      // 检查 Python edge-tts 是否安装
      execSync('python -m edge_tts --help', { stdio: 'pipe' });
    } catch {
      console.log('  正在安装 edge-tts...');
      execSync('pip install edge-tts -q', { stdio: 'pipe' });
    }

    try {
      const cmd = `python -m edge_tts --voice "${this.voice}" --rate "${this.rate}" --volume "${this.volume}" --pitch "${this.pitch}" --write-media "${outputFile}" -f "${tempSsmlFile}"`;

      execSync(cmd, {
        stdio: 'pipe',
        timeout: 60000
      });

      // 清理临时文件
      fs.unlinkSync(tempSsmlFile);

      console.log(`✓ 音频生成成功: ${path.basename(outputFile)}`);
      return outputFile;
    } catch (error) {
      if (fs.existsSync(tempSsmlFile)) {
        fs.unlinkSync(tempSsmlFile);
      }
      throw new Error(`Edge TTS 生成失败: ${error.message}`);
    }
  }

  /**
   * 生成音频并获取预估时长
   * @param {string} text - 要转换的文本
   * @param {string} outputFile - 输出文件路径
   * @returns {Promise<{file: string, duration: number}>} - 返回文件路径和预估时长
   */
  async generateAudioWithDuration(text, outputFile) {
    await this.generateAudio(text, outputFile);

    // 预估时长（中文字符约 0.3-0.4 秒/字）
    const estimatedDuration = text.length * 350;

    return {
      file: outputFile,
      duration: estimatedDuration
    };
  }

  /**
   * 根据时间轴生成所有场景的音频
   * @param {Array} scenes - 场景数组
   * @returns {Promise<Array>} - 返回生成的音频文件信息
   */
  async generateAllAudio(scenes) {
    this.init();

    const audioFiles = [];
    let currentTime = 0;

    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      const outputFile = path.join(this.outputDir, `scene-${String(i + 1).padStart(2, '0')}-${scene.id}.mp3`);

      console.log(`\n[${i + 1}/${scenes.length}] 生成音频: ${scene.title}`);
      console.log(`    解说词: ${scene.narration.substring(0, 50)}...`);

      try {
        const result = await this.generateAudioWithDuration(scene.narration, outputFile);

        // 使用实际音频时长或场景配置的时长，取较大值
        const duration = Math.max(result.duration, scene.duration || 5000);

        audioFiles.push({
          sceneId: scene.id,
          file: outputFile,
          startTime: currentTime,
          duration: duration
        });

        currentTime += duration;
      } catch (error) {
        console.error(`    ✗ 音频生成失败: ${error.message}`);
        console.error(`    跳过场景: ${scene.title}`);
      }
    }

    return audioFiles;
  }

  /**
   * 获取音频文件时长（秒）
   * @param {string} audioFile - 音频文件路径
   * @returns {number} - 时长（秒）
   */
  getAudioDuration(audioFile) {
    try {
      // MP3 文件时长估算：文件大小 / 比特率
      const stats = fs.statSync(audioFile);
      // 假设平均比特率 32kbps = 4000 bytes/second
      return stats.size / 4000;
    } catch (error) {
      return 0;
    }
  }

  /**
   * 清理临时音频文件
   */
  cleanup() {
    if (fs.existsSync(this.outputDir)) {
      const files = fs.readdirSync(this.outputDir);
      for (const file of files) {
        if (file.endsWith('.mp3') || file.endsWith('.wav') || file.endsWith('.ssml')) {
          fs.unlinkSync(path.join(this.outputDir, file));
        }
      }
      console.log('✓ 临时音频文件已清理');
    }
  }
}

export default EdgeTTSGenerator;
