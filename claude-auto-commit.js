/**
 * Claude Code 自动提交钩子
 * 在每次会话完成代码修改后自动调用
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

/**
 * 查找最近的 Git 根目录
 * @param {string} startDir - 起始目录
 * @returns {string|null} - Git 根目录或 null
 */
function findGitRoot(startDir) {
  let currentDir = startDir;
  while (currentDir !== path.dirname(currentDir)) {
    if (fs.existsSync(path.join(currentDir, '.git'))) {
      return currentDir;
    }
    currentDir = path.dirname(currentDir);
  }
  return null;
}

/**
 * 执行自动 Git 提交
 * @param {string} commitMessage - 提交描述（建议使用用户的问题内容）
 * @returns {Promise<{success: boolean, committed: boolean, message: string}>}
 */
async function autoCommitAfterTask(commitMessage) {
  // 优先使用传入的消息，其次尝试从环境变量读取
  const msg = commitMessage?.trim() || process.env.CLAUDE_TASK?.trim() || '代码更新';

  // 查找 Git 根目录
  const scriptDir = __dirname;
  const gitRoot = findGitRoot(scriptDir);

  if (!gitRoot) {
    const errorMsg = '错误：未找到 Git 仓库根目录';
    console.log(errorMsg);
    return {
      success: false,
      committed: false,
      message: errorMsg
    };
  }

  try {
    process.chdir(gitRoot);

    // 检查是否有修改
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    if (!status.trim()) {
      const noChangeMsg = '【自动提交】没有需要提交的修改';
      console.log(noChangeMsg);

      // 播放提示音和人声（Windows）
      try {
        execSync('powershell -c "$voice = New-Object -ComObject SAPI.SPVoice; $voice.Speak(\'没有需要提交的修改\') | Out-Null"', { stdio: 'pipe' });
      } catch (e) {
        // 忽略提示音错误
      }

      return {
        success: true,
        committed: false,
        message: noChangeMsg
      };
    }

    // 获取修改的文件列表
    const changedFiles = status.trim().split('\n').map(line => line.substring(3)).join(', ');

    // 添加所有修改
    execSync('git add -A', { stdio: 'pipe' });

    // 提交
    execSync(`git commit -m "${msg}" --no-verify`, { stdio: 'pipe' });

    // 构建成功信息
    const output = `
╔════════════════════════════════════════════════════════╗
║                                                        ║
║     sunyh-本次任务所修改代码已提交至Git!!!             ║
║                                                        ║
╠════════════════════════════════════════════════════════╣
║  提交信息: ${msg.padEnd(39)} ║
║  修改文件: ${changedFiles.substring(0, 37).padEnd(39)} ║
╚════════════════════════════════════════════════════════╝
`;

    console.log(output);

    // 播放提示音人声（Windows）
    try {
      execSync('powershell -c "$voice = New-Object -ComObject SAPI.SPVoice; $voice.Speak(\'提交Git成功\') | Out-Null"', { stdio: 'pipe' });
    } catch (e) {
      // 忽略提示音错误
    }

    return {
      success: true,
      committed: true,
      message: output
    };
  } catch (error) {
    const errorMsg = `【自动提交】提交失败: ${error.message}`;
    console.log(errorMsg);

    // 播放失败提示音人声（Windows）
    try {
      execSync('powershell -c "$voice = New-Object -ComObject SAPI.SPVoice; $voice.Speak(\'提交Git失败\') | Out-Null"', { stdio: 'pipe' });
    } catch (e) {
      // 忽略提示音错误
    }

    return {
      success: false,
      committed: false,
      message: errorMsg
    };
  }
}

module.exports = { autoCommitAfterTask };

// 如果是直接运行
if (require.main === module) {
  const message = process.argv.slice(2).join(' ') || '';
  autoCommitAfterTask(message).then(result => {
    process.exit(result.success ? 0 : 1);
  });
}
