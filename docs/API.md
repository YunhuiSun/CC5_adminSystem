# API接口文档

## 基础信息

- **Java后端地址**: http://localhost:8080/api
- **Python后端地址**: http://localhost:8000/api
- **统一响应格式**:

```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

## 认证模块

### 1. 用户登录

- **URL**: POST /auth/login
- **描述**: 用户登录，返回JWT令牌
- **请求参数**:

```json
{
  "username": "admin",
  "password": "123456"
}
```

- **响应数据**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "username": "admin",
      "nickname": "超级管理员",
      "email": "admin@example.com",
      "phone": "13800138000",
      "avatar": null,
      "status": 1,
      "roleId": 1,
      "roleName": "超级管理员",
      "createTime": "2024-01-01 00:00:00"
    }
  }
}
```

### 2. 获取当前用户信息

- **URL**: GET /auth/info
- **描述**: 获取当前登录用户信息
- **请求头**: Authorization: Bearer {token}
- **响应数据**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "username": "admin",
    "nickname": "超级管理员",
    "email": "admin@example.com",
    "phone": "13800138000",
    "avatar": null,
    "status": 1,
    "roleId": 1,
    "roleName": "超级管理员",
    "createTime": "2024-01-01 00:00:00"
  }
}
```

## 用户管理模块

### 1. 获取用户列表

- **URL**: GET /user/list
- **描述**: 分页获取用户列表
- **请求参数**:
  - pageNum: 页码，默认1
  - pageSize: 每页条数，默认10
  - keyword: 搜索关键词（用户名或昵称）
- **响应数据**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "username": "admin",
        "nickname": "超级管理员",
        "email": "admin@example.com",
        "phone": "13800138000",
        "status": 1,
        "roleId": 1,
        "roleName": "超级管理员",
        "createTime": "2024-01-01 00:00:00"
      }
    ],
    "total": 10,
    "pageNum": 1,
    "pageSize": 10
  }
}
```

### 2. 新增用户

- **URL**: POST /user
- **描述**: 新增用户
- **请求参数**:

```json
{
  "username": "newuser",
  "password": "123456",
  "nickname": "新用户",
  "email": "newuser@example.com",
  "phone": "13800138000",
  "status": 1,
  "roleId": 2
}
```

### 3. 修改用户

- **URL**: PUT /user
- **描述**: 修改用户信息
- **请求参数**:

```json
{
  "id": 1,
  "nickname": "修改后的昵称",
  "email": "updated@example.com",
  "phone": "13800138000",
  "status": 1,
  "roleId": 2
}
```

### 4. 删除用户

- **URL**: DELETE /user/{id}
- **描述**: 删除用户
- **路径参数**: id - 用户ID

## 角色管理模块

### 1. 获取角色列表

- **URL**: GET /role/list
- **描述**: 分页获取角色列表
- **请求参数**:
  - pageNum: 页码
  - pageSize: 每页条数
  - keyword: 搜索关键词

### 2. 获取所有角色

- **URL**: GET /role/all
- **描述**: 获取所有角色（不分页）

### 3. 新增角色

- **URL**: POST /role
- **请求参数**:

```json
{
  "name": "新角色",
  "code": "new_role",
  "description": "角色描述",
  "status": 1
}
```

### 4. 修改角色

- **URL**: PUT /role
- **请求参数**:

```json
{
  "id": 1,
  "name": "修改后的角色名",
  "description": "修改后的描述",
  "status": 1
}
```

### 5. 删除角色

- **URL**: DELETE /role/{id}

## 菜单管理模块

### 1. 获取菜单列表

- **URL**: GET /menu/list
- **描述**: 获取所有菜单

### 2. 新增菜单

- **URL**: POST /menu
- **请求参数**:

```json
{
  "parentId": 0,
  "name": "新菜单",
  "path": "/new",
  "component": "NewComponent",
  "icon": "FileOutlined",
  "sort": 1,
  "type": 1,
  "permission": "new:view",
  "status": 1
}
```

### 3. 修改菜单

- **URL**: PUT /menu

### 4. 删除菜单

- **URL**: DELETE /menu/{id}

## 日志管理模块

### 1. 获取登录日志

- **URL**: GET /log/login
- **描述**: 分页获取登录日志
- **请求参数**:
  - pageNum: 页码
  - pageSize: 每页条数
  - username: 用户名筛选

### 2. 获取操作日志

- **URL**: GET /log/operation
- **描述**: 分页获取操作日志
- **请求参数**:
  - pageNum: 页码
  - pageSize: 每页条数
  - module: 模块筛选

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未认证或Token过期 |
| 403 | 无权限访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |
