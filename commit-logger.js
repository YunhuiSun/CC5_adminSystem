/**
 * 文件修改记录器
 * 记录每次文件修改，会话结束时生成提交描述
 */

const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, '.claude-commit-log.json');

/**
 * 记录文件修改
 * @param {string} filePath - 修改的文件路径
 * @param {string} operation - 操作类型 (Write/Edit)
 */
function recordChange(filePath, operation) {
  let logs = [];

  // 读取现有日志
  if (fs.existsSync(LOG_FILE)) {
    try {
      logs = JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'));
    } catch (e) {
      logs = [];
    }
  }

  // 添加新记录
  logs.push({
    file: filePath,
    operation: operation,
    time: new Date().toISOString()
  });

  // 保存日志
  fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
}

/**
 * 生成提交描述
 * @returns {string} - 提交描述
 */
function generateCommitMessage() {
  if (!fs.existsSync(LOG_FILE)) {
    return '代码更新';
  }

  let logs = [];
  try {
    logs = JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'));
  } catch (e) {
    return '代码更新';
  }

  if (logs.length === 0) {
    return '代码更新';
  }

  // 按文件去重
  const files = [...new Set(logs.map(log => log.file))];

  // 分析文件类型
  const fileTypes = {
    api: files.filter(f => f.includes('/api/') || f.includes('\\api\\')),
    component: files.filter(f => f.includes('/pages/') || f.includes('\\pages\\') || f.includes('/components/') || f.includes('\\components\\')),
    style: files.filter(f => f.endsWith('.css') || f.endsWith('.scss') || f.endsWith('.less')),
    config: files.filter(f => f.includes('config') || f.endsWith('.json') || f.endsWith('.yml') || f.endsWith('.yaml')),
    hook: files.filter(f => f.includes('hook') || f.includes('middleware')),
    util: files.filter(f => f.includes('/utils/') || f.includes('\\utils\\') || f.includes('/lib/') || f.includes('\\lib\\'))
  };

  // 生成描述
  const descriptions = [];

  if (fileTypes.api.length > 0) {
    descriptions.push(`更新API接口 (${fileTypes.api.length}个文件)`);
  }
  if (fileTypes.component.length > 0) {
    descriptions.push(`更新页面组件 (${fileTypes.component.length}个文件)`);
  }
  if (fileTypes.style.length > 0) {
    descriptions.push(`更新样式 (${fileTypes.style.length}个文件)`);
  }
  if (fileTypes.config.length > 0) {
    descriptions.push(`更新配置 (${fileTypes.config.length}个文件)`);
  }
  if (fileTypes.hook.length > 0) {
    descriptions.push(`更新钩子/中间件 (${fileTypes.hook.length}个文件)`);
  }
  if (fileTypes.util.length > 0) {
    descriptions.push(`更新工具函数 (${fileTypes.util.length}个文件)`);
  }

  // 其他文件
  const otherFiles = files.filter(f =>
    !fileTypes.api.includes(f) &&
    !fileTypes.component.includes(f) &&
    !fileTypes.style.includes(f) &&
    !fileTypes.config.includes(f) &&
    !fileTypes.hook.includes(f) &&
    !fileTypes.util.includes(f)
  );

  if (otherFiles.length > 0) {
    descriptions.push(`其他修改 (${otherFiles.length}个文件)`);
  }

  // 生成最终描述
  if (descriptions.length === 0) {
    return '代码更新';
  } else if (descriptions.length === 1) {
    return descriptions[0];
  } else {
    return descriptions.join('；');
  }
}

/**
 * 清除日志
 */
function clearLog() {
  if (fs.existsSync(LOG_FILE)) {
    fs.unlinkSync(LOG_FILE);
  }
}

/**
 * 获取提交描述并清除日志
 * @returns {string} - 提交描述
 */
function getCommitMessageAndClear() {
  const message = generateCommitMessage();
  clearLog();
  return message;
}

// 命令行调用
if (require.main === module) {
  const command = process.argv[2];

  if (command === 'record' && process.argv[3]) {
    // 从 stdin 读取 JSON 数据
    let input = '';
    process.stdin.on('data', chunk => {
      input += chunk;
    });
    process.stdin.on('end', () => {
      try {
        const data = JSON.parse(input);
        const filePath = data.tool_input?.file_path || data.tool_response?.filePath || process.argv[3];
        const operation = data.tool_name || process.argv[4] || 'Edit';
        recordChange(filePath, operation);
        console.log(`Recorded: ${operation} ${filePath}`);
      } catch (e) {
        recordChange(process.argv[3], process.argv[4] || 'Edit');
      }
    });
  } else if (command === 'generate') {
    console.log(getCommitMessageAndClear());
  } else if (command === 'clear') {
    clearLog();
    console.log('Log cleared');
  } else {
    console.log('Usage: node commit-logger.js [record|generate|clear]');
  }
}

module.exports = { recordChange, generateCommitMessage, getCommitMessageAndClear, clearLog };
