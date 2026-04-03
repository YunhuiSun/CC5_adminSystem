const { execSync } = require('child_process');
const path = require('path');

/**
 * 自动 Git 提交脚本
 * 用法: node auto-commit.js "提交描述"
 */

function autoCommit(commitMessage) {
  const msg = commitMessage || '自动提交';
  const projectRoot = path.dirname(__filename);

  try {
    process.chdir(projectRoot);

    // 检查是否有修改
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    if (!status.trim()) {
      console.log('没有需要提交的修改');
      return { success: true, committed: false };
    }

    // 添加所有修改
    execSync('git add -A', { stdio: 'inherit' });

    // 提交
    execSync(`git commit -m "${msg}"`, { stdio: 'inherit' });

    // 输出成功信息
    console.log('');
    console.log('==========================================');
    console.log('本次任务所修改代码已提交至Git!!!');
    console.log('==========================================');
    console.log('');

    // 播放提示音（Windows）
    try {
      execSync('powershell -c "[console]::beep(800, 300); [console]::beep(1000, 300)"');
    } catch (e) {
      // 忽略提示音错误
    }

    return { success: true, committed: true };
  } catch (error) {
    console.error('提交失败:', error.message);
    return { success: false, committed: false, error: error.message };
  }
}

// 如果是直接运行此脚本
if (require.main === module) {
  const message = process.argv.slice(2).join(' ') || '自动提交';
  autoCommit(message);
}

module.exports = { autoCommit };
