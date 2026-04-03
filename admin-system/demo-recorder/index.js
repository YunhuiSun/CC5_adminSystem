#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import AudioGenerator from './lib/audio-generator.js';
import EdgeTTSGenerator from './lib/edge-tts-generator.js';
import VideoRecorder from './lib/video-recorder.js';
import VideoMerger from './lib/video-merger.js';
import SubtitleGenerator from './lib/subtitle-generator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 录播演示主程序
 */
class DemoRecorder {
  constructor(options = {}) {
    this.timelinePath = options.timelinePath || path.join(__dirname, 'timeline.json');
    this.outputDir = options.outputDir || path.join(__dirname, 'output');
    this.headless = options.headless !== false;
    this.executablePath = options.executablePath;
    this.keepTemp = options.keepTemp || false;
    this.ttsProvider = options.ttsProvider || 'edge'; // 'azure' 或 'edge'

    this.timeline = null;
    this.audioGenerator = null;
    this.videoRecorder = null;
    this.videoMerger = null;
    this.subtitleGenerator = null;
  }

  /**
   * 加载时间轴配置
   */
  loadTimeline() {
    console.log(`\n📋 加载时间轴配置: ${this.timelinePath}`);

    if (!fs.existsSync(this.timelinePath)) {
      throw new Error(`时间轴配置文件不存在: ${this.timelinePath}`);
    }

    const content = fs.readFileSync(this.timelinePath, 'utf-8');
    this.timeline = JSON.parse(content);

    console.log(`✓ 加载成功: ${this.timeline.title}`);
    console.log(`  场景数量: ${this.timeline.scenes.length}`);
    console.log(`  描述: ${this.timeline.description}`);

    return this.timeline;
  }

  /**
   * 初始化组件
   */
  init() {
    console.log('\n🔧 初始化组件...');

    // 确保输出目录存在
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }

    // 初始化音频生成器
    if (this.ttsProvider === 'azure') {
      // 使用 Azure AI 语音（需要密钥）
      this.audioGenerator = new AudioGenerator({
        outputDir: path.join(this.outputDir, 'audio'),
        voiceName: 'zh-CN-XiaoxiaoNeural', // 晓晓女声
        rate: '0%',
        pitch: '0%',
        volume: '0%'
      });
      console.log('  使用 Azure AI 语音合成');
    } else {
      // 使用 Edge TTS（免费，无需密钥）
      this.audioGenerator = new EdgeTTSGenerator({
        outputDir: path.join(this.outputDir, 'audio'),
        voice: 'zh-CN-XiaoxiaoNeural', // 晓晓女声
        rate: '+0%',
        pitch: '+0Hz',
        volume: '+0%'
      });
      console.log('  使用 Edge TTS（免费）');
    }

    // 初始化视频录制器
    this.videoRecorder = new VideoRecorder({
      headless: this.headless,
      executablePath: this.executablePath,
      videoDir: path.join(this.outputDir, 'videos')
    });

    // 初始化视频合并器
    this.videoMerger = new VideoMerger({
      outputDir: path.join(this.outputDir, 'videos')
    });

    // 初始化字幕生成器
    this.subtitleGenerator = new SubtitleGenerator({
      outputDir: path.join(this.outputDir, 'subtitles'),
      fontSize: 24,
      fontName: 'Microsoft YaHei',
      primaryColor: '&H00FFFFFF',
      outlineColor: '&H00000000'
    });

    console.log('✓ 组件初始化完成');
  }

  /**
   * 生成所有音频
   */
  async generateAudio() {
    console.log('\n🎙️ 开始生成解说音频...');

    const audioFiles = await this.audioGenerator.generateAllAudio(this.timeline.scenes);

    console.log(`\n✓ 音频生成完成: ${audioFiles.length} 个文件`);
    return audioFiles;
  }

  /**
   * 生成字幕
   */
  generateSubtitles() {
    console.log('\n📝 开始生成字幕...');

    const subtitleFiles = this.subtitleGenerator.generateSubtitles(
      this.timeline.scenes,
      'demo-subtitles'
    );

    console.log(`✓ 字幕生成完成:`);
    console.log(`  SRT: ${path.basename(subtitleFiles.srt)}`);
    console.log(`  ASS: ${path.basename(subtitleFiles.ass)}`);

    return subtitleFiles;
  }

  /**
   * 录制视频
   */
  async recordVideo() {
    console.log('\n🎬 开始录制视频...');

    await this.videoRecorder.init();

    const videoName = `demo-${Date.now()}.webm`;
    await this.videoRecorder.startRecording(videoName);

    // 执行所有场景
    for (let i = 0; i < this.timeline.scenes.length; i++) {
      const scene = this.timeline.scenes[i];
      console.log(`\n[${i + 1}/${this.timeline.scenes.length}] ${scene.title}`);
      await this.videoRecorder.executeScene(scene);
    }

    const videoPath = await this.videoRecorder.stopRecording();
    await this.videoRecorder.close();

    console.log('\n✓ 视频录制完成');
    return videoPath;
  }

  /**
   * 合并视频、音频和字幕
   */
  async mergeVideoAudioSubtitles(videoPath, audioFiles, subtitleFiles) {
    console.log('\n🔀 开始合并视频、音频和字幕...');

    const outputFile = path.join(this.outputDir, 'videos', `demo-final-${Date.now()}.mp4`);

    // 使用 ASS 字幕格式（支持更多样式）
    const subtitleFile = subtitleFiles.ass;

    await this.videoMerger.mergeVideoAudioSubtitles(videoPath, audioFiles, subtitleFile, outputFile);

    return outputFile;
  }

  /**
   * 清理临时文件
   */
  cleanup(audioFiles, videoPath, subtitleFiles) {
    if (this.keepTemp) {
      console.log('\n💾 保留临时文件');
      return;
    }

    console.log('\n🧹 清理临时文件...');

    // 删除临时音频文件
    for (const audio of audioFiles) {
      if (fs.existsSync(audio.file)) {
        fs.unlinkSync(audio.file);
      }
    }

    // 删除原始视频文件（保留最终合并版本）
    if (videoPath && fs.existsSync(videoPath)) {
      fs.unlinkSync(videoPath);
    }

    // 删除字幕文件（可选，如果需要保留字幕可以注释掉）
    if (subtitleFiles) {
      if (fs.existsSync(subtitleFiles.srt)) {
        fs.unlinkSync(subtitleFiles.srt);
      }
      if (fs.existsSync(subtitleFiles.ass)) {
        fs.unlinkSync(subtitleFiles.ass);
      }
    }

    console.log('✓ 临时文件已清理');
  }

  /**
   * 运行完整流程
   */
  async run() {
    const startTime = Date.now();

    try {
      // 1. 加载配置
      this.loadTimeline();

      // 2. 初始化
      this.init();

      // 3. 生成音频（并行）
      const audioPromise = this.generateAudio();

      // 4. 录制视频
      const videoPromise = this.recordVideo();

      // 5. 生成字幕
      const subtitlePromise = this.generateSubtitles();

      // 等待音频和视频完成（字幕可以并行）
      const [audioFiles, videoPath, subtitleFiles] = await Promise.all([
        audioPromise,
        videoPromise,
        subtitlePromise
      ]);

      // 6. 合并视频、音频和字幕
      const finalVideo = await this.mergeVideoAudioSubtitles(videoPath, audioFiles, subtitleFiles);

      // 7. 清理临时文件
      this.cleanup(audioFiles, videoPath, subtitleFiles);

      const duration = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log('\n' + '='.repeat(50));
      console.log('✅ 录播演示生成成功！');
      console.log('='.repeat(50));
      console.log(`📁 输出文件: ${finalVideo}`);
      console.log(`⏱️  总耗时: ${duration} 秒`);
      console.log('='.repeat(50));

      return finalVideo;
    } catch (error) {
      console.error('\n❌ 生成失败:', error.message);
      throw error;
    }
  }
}

// 命令行入口
async function main() {
  const args = process.argv.slice(2);
  const options = {
    headless: !args.includes('--headed'), // 默认 headless，--headed 显示浏览器
    keepTemp: args.includes('--keep-temp'), // 保留临时文件
    ttsProvider: args.includes('--azure') ? 'azure' : 'edge', // 默认使用 Edge TTS
    executablePath: 'C:\\Users\\sunyu\\AppData\\Local\\ms-playwright\\chromium-1208\\chrome-win64\\chrome.exe'
  };

  // 检查端口 5178 是否可用
  console.log('🚀 录播演示生成器');
  console.log('==================');
  console.log('请确保:');
  console.log('  1. 前端服务运行在 http://localhost:5178');
  console.log('  2. 后端服务已启动');
  console.log('');
  console.log('参数:');
  console.log('  --headed      显示浏览器窗口');
  console.log('  --keep-temp   保留临时文件');
  console.log('  --azure       使用 Azure AI 语音（需要 AZURE_SPEECH_KEY）');
  console.log('');
  console.log('默认使用 Edge TTS（免费，无需配置）');
  console.log('');

  const recorder = new DemoRecorder(options);

  try {
    await recorder.run();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

// 如果直接运行此文件
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default DemoRecorder;
