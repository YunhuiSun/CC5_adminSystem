import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 音频生成器 - 使用 Azure AI 语音合成生成高质量解说音频
 */
class AudioGenerator {
  constructor(options = {}) {
    this.outputDir = options.outputDir || path.join(__dirname, '../output/audio');
    // Azure AI 语音配置
    this.subscriptionKey = options.subscriptionKey || process.env.AZURE_SPEECH_KEY;
    this.region = options.region || process.env.AZURE_SPEECH_REGION || 'eastasia';
    // 默认使用晓晓（女声），可选：zh-CN-YunjianNeural（男声）等
    this.voiceName = options.voiceName || 'zh-CN-XiaoxiaoNeural';
    // 语速调整 (-50% 到 +50%)
    this.rate = options.rate || '0%';
    // 音调调整
    this.pitch = options.pitch || '0%';
    // 音量调整
    this.volume = options.volume || '0%';
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
   * 获取语音配置
   * @returns {sdk.SpeechConfig} 语音配置对象
   */
  getSpeechConfig() {
    if (!this.subscriptionKey) {
      throw new Error('Azure Speech Key 未配置。请设置 AZURE_SPEECH_KEY 环境变量或在构造函数中传入 subscriptionKey');
    }

    const speechConfig = sdk.SpeechConfig.fromSubscription(this.subscriptionKey, this.region);
    speechConfig.speechSynthesisVoiceName = this.voiceName;
    speechConfig.speechSynthesisOutputFormat = sdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3;

    return speechConfig;
  }

  /**
   * 生成 SSML 文本（支持更精细的语音控制）
   * @param {string} text - 要转换的文本
   * @returns {string} - SSML 格式文本
   */
  generateSSML(text) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="zh-CN">
  <voice name="${this.voiceName}">
    <prosody rate="${this.rate}" pitch="${this.pitch}" volume="${this.volume}">
      ${text}
    </prosody>
  </voice>
</speak>`;
  }

  /**
   * 生成单个音频文件（使用 Azure AI 语音合成）
   * @param {string} text - 要转换的文本
   * @param {string} outputFile - 输出文件路径
   * @returns {Promise<string>} - 返回输出文件路径
   */
  async generateAudio(text, outputFile) {
    const speechConfig = this.getSpeechConfig();
    const audioConfig = sdk.AudioConfig.fromAudioFileOutput(outputFile);

    const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

    return new Promise((resolve, reject) => {
      const ssml = this.generateSSML(text);

      synthesizer.speakSsmlAsync(
        ssml,
        (result) => {
          synthesizer.close();

          if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
            console.log(`✓ 音频生成成功: ${path.basename(outputFile)}`);
            resolve(outputFile);
          } else {
            reject(new Error(`语音合成失败: ${result.errorDetails || result.reason}`));
          }
        },
        (error) => {
          synthesizer.close();
          reject(new Error(`语音合成错误: ${error.message}`));
        }
      );
    });
  }

  /**
   * 生成音频并获取时长（使用 Azure AI 语音）
   * @param {string} text - 要转换的文本
   * @param {string} outputFile - 输出文件路径
   * @returns {Promise<{file: string, duration: number}>} - 返回文件路径和预估时长
   */
  async generateAudioWithDuration(text, outputFile) {
    await this.generateAudio(text, outputFile);

    // Azure 生成的 MP3 文件，预估时长（中文字符约 0.3-0.4 秒/字）
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
        if (file.endsWith('.mp3') || file.endsWith('.wav')) {
          fs.unlinkSync(path.join(this.outputDir, file));
        }
      }
      console.log('✓ 临时音频文件已清理');
    }
  }
}

export default AudioGenerator;
