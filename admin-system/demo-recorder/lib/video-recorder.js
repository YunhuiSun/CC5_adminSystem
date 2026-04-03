import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 视频录制器 - 使用 Playwright 录制屏幕操作
 */
class VideoRecorder {
  constructor(options = {}) {
    this.headless = options.headless !== false;
    this.executablePath = options.executablePath;
    this.videoDir = options.videoDir || path.join(__dirname, '../output/videos');
    this.viewport = options.viewport || { width: 1920, height: 1080 };
    this.browser = null;
    this.context = null;
    this.page = null;
  }

  /**
   * 初始化浏览器
   */
  async init() {
    if (!fs.existsSync(this.videoDir)) {
      fs.mkdirSync(this.videoDir, { recursive: true });
    }

    const launchOptions = {
      headless: this.headless
    };

    if (this.executablePath) {
      launchOptions.executablePath = this.executablePath;
    }

    this.browser = await chromium.launch(launchOptions);
    console.log('✓ 浏览器已启动');
  }

  /**
   * 开始录制视频
   * @param {string} videoName - 视频文件名
   */
  async startRecording(videoName) {
    const videoPath = path.join(this.videoDir, videoName);

    this.context = await this.browser.newContext({
      recordVideo: {
        dir: this.videoDir,
        size: this.viewport
      }
    });

    this.page = await this.context.newPage();
    await this.page.setViewportSize(this.viewport);

    console.log(`✓ 开始录制视频: ${videoName}`);
    return videoPath;
  }

  /**
   * 执行场景操作
   * @param {Object} scene - 场景配置
   */
  async executeScene(scene) {
    console.log(`\n▶ 执行场景: ${scene.title}`);
    console.log(`  ${scene.description}`);

    if (!scene.actions || scene.actions.length === 0) {
      console.log('  (无操作，仅等待)');
      await this.page.waitForTimeout(scene.duration || 2000);
      return;
    }

    for (const action of scene.actions) {
      try {
        await this.executeAction(action);
      } catch (error) {
        console.error(`  ✗ 操作失败: ${action.type} - ${error.message}`);
        // 继续执行后续操作
      }
    }
  }

  /**
   * 执行单个操作
   * @param {Object} action - 操作配置
   */
  async executeAction(action) {
    switch (action.type) {
      case 'goto':
        await this.page.goto(action.url);
        console.log(`  → 导航到: ${action.url}`);
        break;

      case 'click':
        await this.page.click(action.selector);
        console.log(`  → 点击: ${action.selector}`);
        break;

      case 'fill':
        await this.page.fill(action.selector, action.value);
        console.log(`  → 填写: ${action.selector} = ${action.value}`);
        break;

      case 'wait':
        await this.page.waitForTimeout(action.ms);
        console.log(`  → 等待: ${action.ms}ms`);
        break;

      case 'waitForURL':
        await this.page.waitForURL(action.pattern);
        console.log(`  → 等待URL: ${action.pattern}`);
        break;

      case 'waitForSelector':
        await this.page.waitForSelector(action.selector, { state: action.state || 'visible' });
        console.log(`  → 等待元素: ${action.selector}`);
        break;

      case 'screenshot':
        await this.page.screenshot({ path: action.path, fullPage: action.fullPage });
        console.log(`  → 截图: ${action.path}`);
        break;

      default:
        console.log(`  ? 未知操作类型: ${action.type}`);
    }
  }

  /**
   * 停止录制并获取视频路径
   * @returns {Promise<string>} - 视频文件路径
   */
  async stopRecording() {
    if (this.context) {
      await this.context.close();

      // 获取视频路径
      const videoPath = await this.page.video().path();
      console.log(`✓ 视频已保存: ${path.basename(videoPath)}`);

      this.context = null;
      this.page = null;

      return videoPath;
    }
    return null;
  }

  /**
   * 关闭浏览器
   */
  async close() {
    if (this.browser) {
      await this.browser.close();
      console.log('✓ 浏览器已关闭');
      this.browser = null;
    }
  }
}

export default VideoRecorder;
