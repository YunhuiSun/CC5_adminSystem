# CLAUDE.md - 后台管理系统项目指南

## 项目概述

本项目是一个完整的企业级后台管理系统，包含：
- **前端**：React + TypeScript + Vite + Ant Design
- **Java后端**：Spring Boot + MyBatis Plus + MySQL
- **Python后端**：FastAPI + SQLAlchemy + MySQL
- **数据库**：MySQL 8.0

两个后端版本（Java和Python）提供完全相同的API接口，可以无缝切换。

---

## 项目结构

```
admin-system/
├── admin-system/          # React前端项目
├── backend-java/          # Java SpringBoot后端
├── backend-python/        # Python FastAPI后端
├── database/              # 数据库脚本
└── docs/                  # 文档
```

---

## 快速开始

### 1. 启动前端

```bash
cd admin-system
npm install
npm run dev
```

### 2. 启动 Java 后端

```bash
cd backend-java
./mvnw spring-boot:run
```

### 3. 启动 Python 后端

```bash
cd backend-python
pip install -r requirements.txt
python main.py
```

### 4. 初始化数据库

```bash
mysql -u root -p < database/init.sql
```

---

## 技术栈

### 前端
- React 19
- TypeScript 5
- Vite 8
- Ant Design 6
- React Router 7
- Zustand（状态管理）
- Axios（HTTP请求）
- ECharts（图表）

### Java后端
- Spring Boot 3.x
- Spring Security（JWT认证）
- MyBatis Plus（ORM）
- MySQL 8.0
- Maven

### Python后端
- FastAPI 0.115.0
- SQLAlchemy 2.0.36
- Pydantic 2.9.0
- PyJWT
- Uvicorn 0.32.0

**注意**：Python 3.13+ 需要以下依赖版本：
- fastapi >= 0.115.0
- pydantic >= 2.9.0
- sqlalchemy >= 2.0.36
- cryptography >= 43.0.0

---

## API 接口规范

### 认证相关

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/auth/login | 用户登录 |
| GET | /api/auth/info | 获取当前用户信息 |

### 用户管理

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/user/list | 获取用户列表 |
| POST | /api/user | 新增用户 |
| PUT | /api/user | 修改用户 |
| DELETE | /api/user/{id} | 删除用户 |

### 角色管理

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/role/list | 获取角色列表 |
| GET | /api/role/all | 获取所有角色 |
| POST | /api/role | 新增角色 |
| PUT | /api/role | 修改角色 |
| DELETE | /api/role/{id} | 删除角色 |

### 菜单管理

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/menu/list | 获取菜单列表 |
| POST | /api/menu | 新增菜单 |
| PUT | /api/menu | 修改菜单 |
| DELETE | /api/menu/{id} | 删除菜单 |

### 日志管理

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/log/login | 获取登录日志 |
| GET | /api/log/operation | 获取操作日志 |

---

## 数据库设计

### 用户表 (sys_user)

| 字段 | 类型 | 描述 |
|------|------|------|
| id | BIGINT | 主键 |
| username | VARCHAR(50) | 用户名 |
| password | VARCHAR(100) | 密码（加密） |
| nickname | VARCHAR(50) | 昵称 |
| email | VARCHAR(100) | 邮箱 |
| phone | VARCHAR(20) | 手机号 |
| avatar | VARCHAR(200) | 头像URL |
| status | TINYINT | 状态(0禁用,1启用) |
| role_id | BIGINT | 角色ID |
| create_time | DATETIME | 创建时间 |
| update_time | DATETIME | 更新时间 |

### 角色表 (sys_role)

| 字段 | 类型 | 描述 |
|------|------|------|
| id | BIGINT | 主键 |
| name | VARCHAR(50) | 角色名称 |
| code | VARCHAR(50) | 角色编码 |
| description | VARCHAR(200) | 描述 |
| status | TINYINT | 状态 |
| create_time | DATETIME | 创建时间 |

### 菜单表 (sys_menu)

| 字段 | 类型 | 描述 |
|------|------|------|
| id | BIGINT | 主键 |
| parent_id | BIGINT | 父菜单ID |
| name | VARCHAR(50) | 菜单名称 |
| path | VARCHAR(100) | 路由路径 |
| component | VARCHAR(100) | 组件路径 |
| icon | VARCHAR(50) | 图标 |
| sort | INT | 排序 |
| type | TINYINT | 类型(0目录,1菜单,2按钮) |
| permission | VARCHAR(100) | 权限标识 |
| status | TINYINT | 状态 |
| create_time | DATETIME | 创建时间 |

### 登录日志表 (sys_login_log)

| 字段 | 类型 | 描述 |
|------|------|------|
| id | BIGINT | 主键 |
| username | VARCHAR(50) | 用户名 |
| ip | VARCHAR(50) | IP地址 |
| location | VARCHAR(100) | 登录地点 |
| browser | VARCHAR(50) | 浏览器 |
| os | VARCHAR(50) | 操作系统 |
| status | TINYINT | 状态 |
| message | VARCHAR(200) | 消息 |
| login_time | DATETIME | 登录时间 |

### 操作日志表 (sys_operation_log)

| 字段 | 类型 | 描述 |
|------|------|------|
| id | BIGINT | 主键 |
| username | VARCHAR(50) | 用户名 |
| module | VARCHAR(50) | 操作模块 |
| type | VARCHAR(50) | 操作类型 |
| description | VARCHAR(200) | 描述 |
| request_method | VARCHAR(10) | 请求方法 |
| request_url | VARCHAR(200) | 请求URL |
| ip | VARCHAR(50) | IP地址 |
| duration | INT | 耗时(ms) |
| status | TINYINT | 状态 |
| create_time | DATETIME | 创建时间 |

---

## 默认账号

| 用户名 | 密码 | 角色 |
|--------|------|------|
| admin | 123456 | 超级管理员 |
| user | 123456 | 普通用户 |

---

## 开发规范

### 代码规范

1. **前端**
   - 使用 TypeScript 严格模式
   - 组件使用函数式组件 + Hooks
   - 使用 CSS Modules 管理样式
   - API 请求统一封装

2. **Java后端**
   - 遵循 RESTful API 设计规范
   - 使用统一的响应格式
   - 参数校验使用 @Valid
   - 异常统一处理

3. **Python后端**
   - 使用 Pydantic 进行数据验证
   - 异步函数使用 async/await
   - 依赖注入管理
   - 类型注解完整

### Git 提交规范

```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
test: 测试相关
chore: 构建/工具相关
```

---

## 常见问题

### Q: 如何切换 Java 和 Python 后端？

修改前端 `src/utils/request.ts` 中的 `baseURL`：

```typescript
// Java后端
baseURL: 'http://localhost:8080/api'

// Python后端
baseURL: 'http://localhost:8000/api'
```

### Q: 数据库连接配置在哪里？

**Java**: `backend-java/src/main/resources/application.yml`

**Python**: `backend-python/core/config.py`

### Q: 如何添加新的菜单？

1. 在数据库 `sys_menu` 表中插入数据
2. 在前端 `src/store/menu.ts` 中添加对应菜单配置
3. 创建对应的页面组件

---

## 部署指南

### 前端部署

```bash
cd admin-system
npm run build
# 将 dist 目录部署到 Nginx 或 CDN
```

### Java后端部署

```bash
cd backend-java
./mvnw clean package
java -jar target/admin-system-1.0.0.jar
```

### Python后端部署

```bash
cd backend-python
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

---

## 联系方式

如有问题，请提交 Issue 或联系开发团队。

---

*最后更新：2025年4月*

---

## 自动 Git 提交

项目配置了自动提交脚本，在每次会话完成代码修改后会自动执行。

### 使用方式

Claude Code 会在完成任务后自动调用以下命令提交代码：

```bash
# 使用当前会话的问题作为提交信息
node scripts/claude-auto-commit.js "本次会话的问题内容"
```

### 提交脚本说明

| 脚本文件 | 用途 |
|---------|------|
| `scripts/claude-auto-commit.js` | Claude Code 自动调用（推荐） |
| `scripts/auto-commit.js` | 手动执行 Node.js 版本 |
| `scripts/auto-commit.bat` | Windows 批处理版本 |
| `scripts/auto-commit.ps1` | PowerShell 版本 |
| `scripts/auto-commit.sh` | Bash 版本（Linux/Mac） |

### 手动提交示例

```bash
# 使用默认提交信息
node scripts/auto-commit.js

# 使用自定义提交信息
node scripts/auto-commit.js "修复用户登录bug"

# Windows 批处理
scripts/auto-commit.bat "添加新功能"

# PowerShell
.\scripts\auto-commit.ps1 "更新文档"
```

提交成功后会播放提示音并在控制台输出：
```
==========================================
本次任务所修改代码已提交至Git!!!
==========================================
```
