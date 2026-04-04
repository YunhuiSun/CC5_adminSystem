const { chromium } = require('playwright');

(async () => {
  // 启动浏览器
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('1. 打开登录页面...');
    await page.goto('http://localhost:5178/login');
    await page.waitForLoadState('networkidle');

    // 截图：登录页面
    await page.screenshot({ path: 'screenshots/01-login-page.png', fullPage: true });
    console.log('   ✓ 已截图：登录页面');

    console.log('\n2. 填写登录表单...');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', '123456');

    // 截图：填写后的表单
    await page.screenshot({ path: 'screenshots/02-login-filled.png', fullPage: true });
    console.log('   ✓ 已截图：填写后的表单');

    console.log('\n3. 点击登录按钮...');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');

    // 截图：登录后的仪表盘
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshots/03-dashboard.png', fullPage: true });
    console.log('   ✓ 已截图：仪表盘页面');

    console.log('\n4. 导航到用户管理页面...');
    await page.click('text=用户管理');
    await page.waitForURL('**/user/list');
    await page.waitForTimeout(1000);

    // 截图：用户管理页面
    await page.screenshot({ path: 'screenshots/04-user-management.png', fullPage: true });
    console.log('   ✓ 已截图：用户管理页面');

    console.log('\n5. 点击新增用户按钮...');
    await page.click('text=新增用户');
    await page.waitForTimeout(500);

    // 截图：新增用户弹窗
    await page.screenshot({ path: 'screenshots/05-add-user-modal.png', fullPage: true });
    console.log('   ✓ 已截图：新增用户弹窗');

    console.log('\n6. 填写新增用户表单...');
    await page.fill('input[name="username"]', 'testuser');
    await page.fill('input[name="password"]', '123456');
    await page.fill('input[name="nickname"]', '测试用户');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="phone"]', '13800138099');

    // 选择角色
    await page.click('.ant-select-selector');
    await page.waitForTimeout(200);
    await page.click('text=普通用户');

    // 截图：填写后的表单
    await page.screenshot({ path: 'screenshots/06-add-user-filled.png', fullPage: true });
    console.log('   ✓ 已截图：填写后的表单');

    console.log('\n7. 获取页面信息...');
    const title = await page.title();
    const url = page.url();
    console.log(`   页面标题: ${title}`);
    console.log(`   当前URL: ${url}`);

    // 获取所有按钮
    const buttons = await page.$$eval('button', btns => btns.map(b => b.textContent?.trim()).filter(Boolean));
    console.log(`   页面上的按钮: ${buttons.join(', ')}`);

    console.log('\n✅ 演示完成！截图保存在 screenshots/ 目录');

  } catch (error) {
    console.error('❌ 错误:', error.message);
    await page.screenshot({ path: 'screenshots/error.png', fullPage: true });
  } finally {
    await browser.close();
  }
})();
