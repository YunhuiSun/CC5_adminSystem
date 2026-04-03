/**
 * Claude Code 自动提交钩子
 * 在每次会话完成代码修改后自动调用
 */

const { execSync } = require('child_process');
const path = require('path');

/**
 * 执行自动 Git 提交
 * @param {string} commitMessage - 提交描述（建议使用用户的问题内容）
 * @returns {Promise<{success: boolean, committed: boolean, message: string}>}
 */
async function autoCommitAfterTask(commitMessage) {
  const projectRoot = path.resolve(__dirname, 'admin-system');
  const msg = commitMessage?.trim() || '代码更新';

  try {
    process.chdir(projectRoot);

    // 检查是否有修改
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    if (!status.trim()) {
      return {
        success: true,
        committed: false,
        message: '没有需要提交的修改'
      };
    }

    // 添加所有修改
    execSync('git add -A', { stdio: 'pipe' });

    // 提交
    execSync(`git commit -m "${msg}"`, { stdio: 'pipe' });

    // 输出成功信息
    const output = `
==========================================
本次任务所修改代码已提交至Git!!!
==========================================
提交信息: ${msg}
`;

    // 播放提示音（Windows）
    try {
      execSync('powershell -c "[console]::beep(800, 300); [console]::beep(1000, 300)"', { stdio: 'pipe' });
    } catch (e) {
      // 忽略提示音错误
    }

    return {
      success: true,
      committed: true,
      message: output
    };
  } catch (error) {
    return {
      success: false,
      committed: false,
      message: `提交失败: ${error.message}`
    };
  }
}

module.exports = { autoCommitAfterTask };

// 如果是直接运行
if (require.main === module) {
  const message = process.argv.slice(2).join(' ') || '代码更新';
  autoCommitAfterTask(message).then(result => {
    console.log(result.message);
    process.exit(result.success ? 0 : 1);
  });
}
