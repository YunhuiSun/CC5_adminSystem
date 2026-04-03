import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 视频合并器 - 使用 ffmpeg 合并视频、音频和字幕
 */
class VideoMerger {
  constructor(options = {}) {
    this.ffmpegPath = options.ffmpegPath || 'ffmpeg';
    this.outputDir = options.outputDir || path.join(__dirname, '../output/videos');
  }

  /**
   * 检查 ffmpeg 是否可用
   */
  checkFFmpeg() {
    try {
      execSync(`${this.ffmpegPath} -version`, { stdio: 'pipe' });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * 获取音频文件时长（秒）
   * @param {string} audioFile - 音频文件路径
   * @returns {number} - 时长（秒）
   */
  getAudioDuration(audioFile) {
    try {
      const output = execSync(
        `${this.ffmpegPath} -i "${audioFile}" 2>&1`,
        { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }
      );

      const match = output.match(/Duration: (\d{2}):(\d{2}):(\d{2}\.\d{2})/);
      if (match) {
        const hours = parseInt(match[1]);
        const minutes = parseInt(match[2]);
        const seconds = parseFloat(match[3]);
        return hours * 3600 + minutes * 60 + seconds;
      }
    } catch (error) {
      // ffmpeg 会返回非零退出码，但会输出信息到 stderr
    }
    return 0;
  }

  /**
   * 合并视频、音频和字幕
   * @param {string} videoFile - 视频文件路径
   * @param {Array} audioFiles - 音频文件信息数组 [{file, startTime, duration}]
   * @param {string} subtitleFile - 字幕文件路径（可选）
   * @param {string} outputFile - 输出文件路径
   * @returns {Promise<string>} - 输出文件路径
   */
  async mergeVideoAudioSubtitles(videoFile, audioFiles, subtitleFile, outputFile) {
    if (!this.checkFFmpeg()) {
      throw new Error('ffmpeg 未安装或不在 PATH 中');
    }

    if (!fs.existsSync(videoFile)) {
      throw new Error(`视频文件不存在: ${videoFile}`);
    }

    // 过滤掉不存在的音频文件
    const validAudioFiles = audioFiles.filter(audio => {
      const exists = fs.existsSync(audio.file);
      if (!exists) {
        console.warn(`警告: 音频文件不存在，跳过: ${audio.file}`);
      }
      return exists;
    });

    if (validAudioFiles.length === 0) {
      throw new Error('没有有效的音频文件可以合并');
    }

    console.log('\n📹 开始合并视频和音频...');
    console.log(`   视频: ${path.basename(videoFile)}`);
    console.log(`   音频片段: ${validAudioFiles.length} 个`);
    if (subtitleFile && fs.existsSync(subtitleFile)) {
      console.log(`   字幕: ${path.basename(subtitleFile)}`);
    }

    // 构建 ffmpeg 命令
    const inputs = [videoFile, ...validAudioFiles.map(a => a.file)]
      .map(f => `-i "${f}"`)
      .join(' ');

    // 构建 filter_complex
    const audioDelays = validAudioFiles.map((audio, index) => {
      const delayMs = Math.round(audio.startTime);
      return `[${index + 1}:a]adelay=${delayMs}|${delayMs}[a${index}]`;
    }).join(';');

    const audioMix = validAudioFiles
      .map((_, index) => `[a${index}]`)
      .join('') + `amix=${validAudioFiles.length}:duration=first[aout]`;

    let filterComplex = `${audioDelays};${audioMix}`;

    // 如果有字幕，添加字幕滤镜
    let subtitleFilter = '';
    if (subtitleFile && fs.existsSync(subtitleFile)) {
      // 将字幕文件路径转换为 ffmpeg 支持的格式
      const subtitlePath = subtitleFile.replace(/\\/g, '/').replace(/:/g, '\\:');
      subtitleFilter = `;[0:v]subtitles='${subtitlePath}':force_style='FontSize=24,FontName=Microsoft YaHei,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,Outline=2'[vout]`;
      filterComplex += subtitleFilter;
    }

    // 构建输出映射
    const videoMap = subtitleFile && fs.existsSync(subtitleFile) ? '-map "[vout]"' : '-map 0:v';

    // 构建完整命令
    const cmd = `${this.ffmpegPath} ${inputs} -filter_complex "${filterComplex}" ${videoMap} -map "[aout]" -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 192k -shortest "${outputFile}" -y`;

    console.log(`\n   执行命令: ${cmd.substring(0, 120)}...`);

    try {
      execSync(cmd, { stdio: 'inherit' });
      console.log(`\n✓ 合并完成: ${outputFile}`);
      return outputFile;
    } catch (error) {
      console.error('\n✗ 合并失败:', error.message);
      throw error;
    }
  }

  /**
   * 合并视频和多个音频片段（兼容旧版本）
   * @param {string} videoFile - 视频文件路径
   * @param {Array} audioFiles - 音频文件信息数组 [{file, startTime, duration}]
   * @param {string} outputFile - 输出文件路径
   * @returns {Promise<string>} - 输出文件路径
   */
  async mergeVideoAudio(videoFile, audioFiles, outputFile) {
    return this.mergeVideoAudioSubtitles(videoFile, audioFiles, null, outputFile);
  }

  /**
   * 添加背景音乐
   * @param {string} videoFile - 视频文件路径
   * @param {string} bgmFile - 背景音乐文件路径
   * @param {string} outputFile - 输出文件路径
   * @param {number} bgmVolume - 背景音乐音量 (0-1)
   */
  async addBackgroundMusic(videoFile, bgmFile, outputFile, bgmVolume = 0.3) {
    if (!fs.existsSync(bgmFile)) {
      console.warn(`背景音乐文件不存在: ${bgmFile}`);
      return videoFile;
    }

    const cmd = `${this.ffmpegPath} -i "${videoFile}" -i "${bgmFile}" -filter_complex "[1:a]volume=${bgmVolume}[bgm];[0:a][bgm]amix=2:duration=first[aout]" -map 0:v -map "[aout]" -c:v copy -c:a aac "${outputFile}" -y`;

    try {
      execSync(cmd, { stdio: 'inherit' });
      console.log(`✓ 添加背景音乐完成: ${outputFile}`);
      return outputFile;
    } catch (error) {
      console.error('✗ 添加背景音乐失败:', error.message);
      throw error;
    }
  }

  /**
   * 压缩视频
   * @param {string} inputFile - 输入文件路径
   * @param {string} outputFile - 输出文件路径
   * @param {string} quality - 质量 (high/medium/low)
   */
  async compressVideo(inputFile, outputFile, quality = 'medium') {
    const crf = quality === 'high' ? 18 : quality === 'medium' ? 23 : 28;
    const preset = quality === 'high' ? 'slow' : quality === 'medium' ? 'medium' : 'fast';

    const cmd = `${this.ffmpegPath} -i "${inputFile}" -c:v libx264 -crf ${crf} -preset ${preset} -c:a copy "${outputFile}" -y`;

    try {
      execSync(cmd, { stdio: 'inherit' });
      console.log(`✓ 视频压缩完成: ${outputFile}`);
      return outputFile;
    } catch (error) {
      console.error('✗ 视频压缩失败:', error.message);
      throw error;
    }
  }

  /**
   * 单独添加字幕到视频
   * @param {string} videoFile - 视频文件路径
   * @param {string} subtitleFile - 字幕文件路径
   * @param {string} outputFile - 输出文件路径
   * @returns {Promise<string>} - 输出文件路径
   */
  async addSubtitles(videoFile, subtitleFile, outputFile) {
    if (!this.checkFFmpeg()) {
      throw new Error('ffmpeg 未安装或不在 PATH 中');
    }

    if (!fs.existsSync(videoFile)) {
      throw new Error(`视频文件不存在: ${videoFile}`);
    }

    if (!fs.existsSync(subtitleFile)) {
      throw new Error(`字幕文件不存在: ${subtitleFile}`);
    }

    console.log('\n📝 开始添加字幕...');
    console.log(`   视频: ${path.basename(videoFile)}`);
    console.log(`   字幕: ${path.basename(subtitleFile)}`);

    // 转义字幕路径
    const subtitlePath = subtitleFile.replace(/\\/g, '/').replace(/:/g, '\\:');

    // 构建 ffmpeg 命令
    const cmd = `${this.ffmpegPath} -i "${videoFile}" -vf "subtitles='${subtitlePath}':force_style='FontSize=24,FontName=Microsoft YaHei,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,Outline=2'" -c:v libx264 -preset medium -crf 23 -c:a copy "${outputFile}" -y`;

    console.log(`\n   执行命令: ${cmd.substring(0, 120)}...`);

    try {
      execSync(cmd, { stdio: 'inherit' });
      console.log(`\n✓ 字幕添加完成: ${outputFile}`);
      return outputFile;
    } catch (error) {
      console.error('\n✗ 字幕添加失败:', error.message);
      throw error;
    }
  }
}

export default VideoMerger;
