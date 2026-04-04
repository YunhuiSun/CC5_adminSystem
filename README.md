# 后台管理系统 - 完整解决方案

## 项目概述

本项目是一个完整的企业级后台管理系统，包含：
- **前端**：React + TypeScript + Vite + Ant Design
- **Java后端**：Spring Boot + Spring Security + MyBatis Plus + MySQL
- **Python后端**：FastAPI + SQLAlchemy + MySQL
- **数据库**：MySQL 8.0

两个后端版本（Java和Python）提供完全相同的API接口，可以无缝切换。

---

## 项目结构

```
admin-system/
├── frontend/                 # React前端项目
│   ├── src/
│   ├── package.json
│   └── ...
├── backend-java/            # Java SpringBoot后端
│   ├── src/main/java/com/admin/
│   ├── pom.xml
│   └── ...
├── backend-python/          # Python FastAPI后端
│   ├── app/
│   ├── main.py
│   └── requirements.txt
├── database/               # 数据库脚本
│   ├── schema.sql          # 表结构
│   └── data.sql            # 测试数据
├── docs/                   # 文档
│   ├── API.md              # API接口文档
│   └── DEPLOY.md           # 部署文档
├── CLAUDE.md               # 项目指南
└── README.md               # 本文件
```

---

## 快速开始

### 1. 初始化数据库

```bash
# 登录MySQL
mysql -u root -p

# 执行数据库脚本（密码：123456）
mysql -u root -p123456 < database/schema.sql
mysql -u root -p123456 < database/data.sql
```

### 2. 启动前端

```bash
cd frontend
npm install
npm run dev
```
前端将运行在：http://localhost:5173

### 3. 启动 Java 后端

```bash
cd backend-java
./mvnw spring-boot:run
# 或者使用Maven
mvn spring-boot:run
```
Java后端将运行在：http://localhost:8080/api

### 4. 启动 Python 后端

```bash
cd backend-python
pip install -r requirements.txt
python main.py
```
Python后端将运行在：http://localhost:8000/api

---

## 默认账号

| 用户名 | 密码 | 角色 |
|--------|------|------|
| admin | 123456 | 超级管理员 |
| user | 123456 | 普通用户 |
| tester | 123456 | 测试人员 |

---

## 技术栈

### 前端
- React 18
- TypeScript 5
- Vite 5
- Ant Design 5
- React Router 6
- Zustand（状态管理）
- Axios（HTTP请求）
- ECharts（图表）

### Java后端
- Spring Boot 3.2.x
- Spring Security + JWT
- MyBatis Plus 3.5.x
- MySQL 8.0
- Maven
- JDK 17+

### Python后端
- FastAPI 0.104+
- SQLAlchemy 2.0
- Pydantic 2.5+
- PyJWT
- Uvicorn
- Python 3.10+

---

## API 接口规范

### 统一响应格式

```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

### 接口列表

| 模块 | 方法 | 路径 | 描述 |
|------|------|------|------|
| 认证 | POST | /api/auth/login | 登录 |
| 认证 | GET | /api/auth/info | 获取用户信息 |
| 用户 | GET | /api/user/list | 用户列表 |
| 用户 | POST | /api/user | 新增用户 |
| 用户 | PUT | /api/user | 修改用户 |
| 用户 | DELETE | /api/user/{id} | 删除用户 |
| 角色 | GET | /api/role/list | 角色列表 |
| 角色 | GET | /api/role/all | 所有角色 |
| 角色 | POST | /api/role | 新增角色 |
| 角色 | PUT | /api/role | 修改角色 |
| 角色 | DELETE | /api/role/{id} | 删除角色 |
| 菜单 | GET | /api/menu/list | 菜单列表 |
| 菜单 | POST | /api/menu | 新增菜单 |
| 菜单 | PUT | /api/menu | 修改菜单 |
| 菜单 | DELETE | /api/menu/{id} | 删除菜单 |
| 日志 | GET | /api/log/login | 登录日志 |
| 日志 | GET | /api/log/operation | 操作日志 |

---

## 如何切换 Java 和 Python 后端？

修改前端 `frontend/src/utils/request.ts` 中的 `baseURL`：

```typescript
// 使用Java后端
baseURL: 'http://localhost:8080/api'

// 使用Python后端
baseURL: 'http://localhost:8000/api'
```

---

## 数据库配置

### Java后端
配置文件：`backend-java/src/main/resources/application.yml`

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/admin_system?useUnicode=true&characterEncoding=utf-8&useSSL=false&serverTimezone=Asia/Shanghai
    username: root
    password: 123456
```

### Python后端
配置文件：`backend-python/app/core/config.py`

```python
DB_HOST: str = "localhost"
DB_PORT: int = 3306
DB_USER: str = "root"
DB_PASSWORD: str = "123456"
DB_NAME: str = "admin_system"
```

---

## 功能模块

1. **数据看板** - 统计卡片、ECharts图表（折线图、饼图、柱状图）
2. **用户管理** - 用户增删改查、分页、搜索
3. **角色管理** - 角色管理、权限分配
4. **菜单管理** - 菜单配置、权限控制
5. **日志管理** - 登录日志、操作日志

---

## 部署指南

### 前端部署

```bash
cd frontend
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

## 开发团队

如有问题，请提交 Issue 或联系开发团队。

---

*最后更新：2024年*

---

## 自动提交功能

本项目已配置自动 Git 提交功能，会话结束时自动提交代码修改。
