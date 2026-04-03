const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  // 确保视频目录存在
  const videoDir = 'videos';
  if (!fs.existsSync(videoDir)) {
    fs.mkdirSync(videoDir, { recursive: true });
  }

  // 使用已安装的 chromium-1208
  const browser = await chromium.launch({
    headless: false,
    executablePath: 'C:\\Users\\sunyu\\AppData\\Local\\ms-playwright\\chromium-1208\\chrome-win64\\chrome.exe'
  });

  // 创建带有视频录制功能的上下文
  const context = await browser.newContext({
    recordVideo: {
      dir: videoDir,
      size: { width: 1920, height: 1080 }
    }
  });

  const page = await context.newPage();

  // 设置视口大小
  await page.setViewportSize({ width: 1920, height: 1080 });

  try {
    console.log('1. 打开登录页面...');
    await page.goto('http://localhost:5178/login');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    console.log('\n2. 填写登录表单...');
    // 使用 placeholder 定位输入框
    await page.fill('input[placeholder="用户名: admin"]', 'admin');
    await page.fill('input[placeholder="密码: 123456"]', '123456');
    await page.waitForTimeout(500);

    console.log('\n3. 点击登录按钮...');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
    await page.waitForTimeout(1500);
    console.log('   ✓ 登录成功，进入仪表盘');

    console.log('\n4. 导航到用户管理页面...');
    // 等待侧边栏加载并点击用户权限展开
    await page.waitForTimeout(1000);
    await page.click('text=用户权限');
    await page.waitForTimeout(800);
    await page.click('text=用户管理');
    await page.waitForTimeout(1500);
    console.log('   ✓ 进入用户管理页面');

    console.log('\n5. 点击新增用户按钮...');
    await page.click('text=新增用户');
    await page.waitForTimeout(800);
    console.log('   ✓ 打开新增用户弹窗');

    console.log('\n6. 填写新增用户表单...');
    // 使用 placeholder 定位输入框
    await page.fill('input[placeholder="请输入用户名"]', 'testuser');
    await page.fill('input[placeholder="请输入密码"]', '123456');
    await page.fill('input[placeholder="请输入昵称"]', '测试用户');
    await page.fill('input[placeholder="请输入邮箱"]', 'test@example.com');
    await page.fill('input[placeholder="请输入手机号"]', '13800138099');

    // 选择角色 - 点击表单中的角色下拉框
    const roleSelect = await page.locator('.ant-form-item:has-text("角色") .ant-select');
    await roleSelect.click();
    await page.waitForTimeout(300);
    // 选择普通用户
    await page.click('.ant-select-dropdown:visible .ant-select-item:has-text("普通用户")');
    await page.waitForTimeout(300);
    console.log('   ✓ 表单填写完成');

    console.log('\n7. 关闭弹窗...');
    // 点击取消按钮关闭弹窗
    await page.click('.ant-modal-footer button.ant-btn-default');
    // 等待弹窗完全关闭
    await page.waitForTimeout(1000);

    console.log('\n8. 导航到角色管理页面...');
    // 使用直接 URL 导航
    await page.goto('http://localhost:5178/role/list');
    await page.waitForTimeout(1500);
    console.log('   ✓ 进入角色管理页面');

    console.log('\n9. 导航到菜单管理页面...');
    await page.goto('http://localhost:5178/menu/list');
    await page.waitForTimeout(1500);
    console.log('   ✓ 进入菜单管理页面');

    console.log('\n10. 导航到登录日志页面...');
    await page.goto('http://localhost:5178/log/login');
    await page.waitForTimeout(1500);
    console.log('   ✓ 进入登录日志页面');

    console.log('\n11. 导航到操作日志页面...');
    await page.goto('http://localhost:5178/log/operation');
    await page.waitForTimeout(1500);
    console.log('   ✓ 进入操作日志页面');

    console.log('\n12. 返回仪表盘...');
    await page.goto('http://localhost:5178/dashboard');
    await page.waitForTimeout(1500);
    console.log('   ✓ 返回仪表盘');

    console.log('\n✅ 演示完成！视频正在保存...');

  } catch (error) {
    console.error('❌ 错误:', error.message);
  } finally {
    // 关闭上下文会自动保存视频
    await context.close();
    await browser.close();

    // 获取生成的视频文件路径
    const videoFiles = fs.readdirSync(videoDir).filter(f => f.endsWith('.webm'));
    if (videoFiles.length > 0) {
      // 重命名为更有意义的名称
      const latestVideo = videoFiles.sort((a, b) => {
        return fs.statSync(path.join(videoDir, b)).mtime - fs.statSync(path.join(videoDir, a)).mtime;
      })[0];

      const newName = `admin-system-demo-${new Date().toISOString().replace(/[:.]/g, '-')}.webm`;
      fs.renameSync(
        path.join(videoDir, latestVideo),
        path.join(videoDir, newName)
      );

      console.log(`\n📹 视频已保存: ${path.join(videoDir, newName)}`);
    }

    console.log(`\n所有视频文件保存在: ${path.resolve(videoDir)}/`);
  }
})();
