import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 字幕生成器 - 生成 SRT 和 ASS 格式字幕
 */
class SubtitleGenerator {
  constructor(options = {}) {
    this.outputDir = options.outputDir || path.join(__dirname, '../output/subtitles');
    this.fontSize = options.fontSize || 24;
    this.fontName = options.fontName || 'Microsoft YaHei';
    this.primaryColor = options.primaryColor || '&H00FFFFFF'; // 白色
    this.outlineColor = options.outlineColor || '&H00000000'; // 黑色边框
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
   * 将毫秒转换为 SRT 时间格式 (HH:MM:SS,mmm)
   * @param {number} ms - 毫秒
   * @returns {string} - SRT 时间格式
   */
  msToSrtTime(ms) {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = ms % 1000;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')},${String(milliseconds).padStart(3, '0')}`;
  }

  /**
   * 将毫秒转换为 ASS 时间格式 (H:MM:SS.cc)
   * @param {number} ms - 毫秒
   * @returns {string} - ASS 时间格式
   */
  msToAssTime(ms) {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`;
  }

  /**
   * 生成 SRT 字幕
   * @param {Array} scenes - 场景数组，包含 narration 和 timing
   * @param {string} outputFile - 输出文件路径
   * @returns {string} - 输出文件路径
   */
  generateSrt(scenes, outputFile) {
    let srtContent = '';
    let index = 1;

    for (const scene of scenes) {
      const startTime = scene.startTime || 0;
      const duration = scene.duration || 5000;
      const endTime = startTime + duration;

      // 将长文本分成多行（每行最多 20 个字）
      const lines = this.wrapText(scene.narration, 20);

      srtContent += `${index}\n`;
      srtContent += `${this.msToSrtTime(startTime)} --> ${this.msToSrtTime(endTime)}\n`;
      srtContent += `${lines.join('\n')}\n\n`;

      index++;
    }

    fs.writeFileSync(outputFile, srtContent, 'utf-8');
    console.log(`✓ SRT 字幕生成成功: ${path.basename(outputFile)}`);
    return outputFile;
  }

  /**
   * 生成 ASS 字幕（支持更多样式）
   * @param {Array} scenes - 场景数组
   * @param {string} outputFile - 输出文件路径
   * @returns {string} - 输出文件路径
   */
  generateAss(scenes, outputFile) {
    const width = 1920;
    const height = 1080;

    let assContent = `[Script Info]
Title: Demo Subtitles
ScriptType: v4.00+
PlayResX: ${width}
PlayResY: ${height}
Timer: 100.0000

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,${this.fontName},${this.fontSize},${this.primaryColor},${this.primaryColor},${this.outlineColor},${this.outlineColor},0,0,0,0,100,100,0,0,1,2,0,2,10,10,30,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;

    for (const scene of scenes) {
      const startTime = this.msToAssTime(scene.startTime || 0);
      const duration = scene.duration || 5000;
      const endTime = this.msToAssTime((scene.startTime || 0) + duration);

      // 转义 ASS 特殊字符
      const text = scene.narration.replace(/\\/g, '\\\\').replace(/{/g, '\\{').replace(/}/g, '\\}');

      assContent += `Dialogue: 0,${startTime},${endTime},Default,,0,0,0,,${text}\n`;
    }

    fs.writeFileSync(outputFile, assContent, 'utf-8');
    console.log(`✓ ASS 字幕生成成功: ${path.basename(outputFile)}`);
    return outputFile;
  }

  /**
   * 根据时间轴生成字幕
   * @param {Array} scenes - 场景数组
   * @param {string} baseName - 基础文件名
   * @returns {Object} - 生成的字幕文件路径
   */
  generateSubtitles(scenes, baseName) {
    this.init();

    const srtFile = path.join(this.outputDir, `${baseName}.srt`);
    const assFile = path.join(this.outputDir, `${baseName}.ass`);

    this.generateSrt(scenes, srtFile);
    this.generateAss(scenes, assFile);

    return {
      srt: srtFile,
      ass: assFile
    };
  }

  /**
   * 自动换行
   * @param {string} text - 文本
   * @param {number} maxChars - 每行最大字符数
   * @returns {Array} - 分行后的数组
   */
  wrapText(text, maxChars = 20) {
    const lines = [];
    let currentLine = '';

    for (const char of text) {
      if (currentLine.length >= maxChars) {
        lines.push(currentLine);
        currentLine = char;
      } else {
        currentLine += char;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines.length > 0 ? lines : [text];
  }

  /**
   * 清理临时字幕文件
   */
  cleanup() {
    if (fs.existsSync(this.outputDir)) {
      const files = fs.readdirSync(this.outputDir);
      for (const file of files) {
        if (file.endsWith('.srt') || file.endsWith('.ass')) {
          fs.unlinkSync(path.join(this.outputDir, file));
        }
      }
      console.log('✓ 临时字幕文件已清理');
    }
  }
}

export default SubtitleGenerator;
