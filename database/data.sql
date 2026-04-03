-- ============================================
-- 后台管理系统测试数据
-- ============================================

USE admin_system;

-- ============================================
-- 1. 插入角色数据
-- ============================================
INSERT INTO sys_role (id, name, code, description, status, create_time) VALUES
(1, '超级管理员', 'admin', '拥有系统所有权限', 1, '2024-01-01 00:00:00'),
(2, '普通用户', 'user', '普通用户权限', 1, '2024-01-01 00:00:00'),
(3, '测试人员', 'tester', '测试人员权限', 1, '2024-01-01 00:00:00');

-- ============================================
-- 2. 插入用户数据
-- 密码: 123456 (BCrypt加密后的值)
-- ============================================
INSERT INTO sys_user (id, username, password, nickname, email, phone, avatar, status, role_id, create_time) VALUES
(1, 'admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EO', '超级管理员', 'admin@example.com', '13800138000', NULL, 1, 1, '2024-01-01 00:00:00'),
(2, 'user', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EO', '普通用户', 'user@example.com', '13800138001', NULL, 1, 2, '2024-01-02 00:00:00'),
(3, 'tester', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EO', '测试人员', 'tester@example.com', '13800138002', NULL, 1, 3, '2024-01-03 00:00:00'),
(4, 'zhangsan', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EO', '张三', 'zhangsan@example.com', '13800138003', NULL, 1, 2, '2024-01-04 00:00:00'),
(5, 'lisi', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EO', '李四', 'lisi@example.com', '13800138004', NULL, 1, 2, '2024-01-05 00:00:00'),
(6, 'wangwu', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EO', '王五', 'wangwu@example.com', '13800138005', NULL, 0, 2, '2024-01-06 00:00:00'),
(7, 'zhaoliu', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EO', '赵六', 'zhaoliu@example.com', '13800138006', NULL, 1, 2, '2024-01-07 00:00:00'),
(8, 'sunqi', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EO', '孙七', 'sunqi@example.com', '13800138007', NULL, 1, 2, '2024-01-08 00:00:00'),
(9, 'zhouba', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EO', '周八', 'zhouba@example.com', '13800138008', NULL, 1, 3, '2024-01-09 00:00:00'),
(10, 'wujiu', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EO', '吴九', 'wujiu@example.com', '13800138009', NULL, 1, 2, '2024-01-10 00:00:00');

-- ============================================
-- 3. 插入菜单数据
-- ============================================
INSERT INTO sys_menu (id, parent_id, name, path, component, icon, sort, type, permission, status, create_time) VALUES
-- 一级菜单
(1, 0, '数据看板', '/dashboard', 'Dashboard', 'DashboardOutlined', 1, 1, 'dashboard:view', 1, '2024-01-01 00:00:00'),
(2, 0, '用户权限', '/user', NULL, 'UserOutlined', 2, 0, NULL, 1, '2024-01-01 00:00:00'),
(3, 0, '系统管理', '/system', NULL, 'SettingOutlined', 3, 0, NULL, 1, '2024-01-01 00:00:00'),
(4, 0, '日志管理', '/log', NULL, 'FileTextOutlined', 4, 0, NULL, 1, '2024-01-01 00:00:00'),

-- 用户权限子菜单
(21, 2, '用户管理', '/user/list', 'User', 'TeamOutlined', 1, 1, 'user:list', 1, '2024-01-01 00:00:00'),
(22, 2, '角色管理', '/user/role', 'Role', 'SafetyOutlined', 2, 1, 'role:list', 1, '2024-01-01 00:00:00'),

-- 用户管理按钮权限
(211, 21, '用户新增', NULL, NULL, NULL, 1, 2, 'user:add', 1, '2024-01-01 00:00:00'),
(212, 21, '用户修改', NULL, NULL, NULL, 2, 2, 'user:edit', 1, '2024-01-01 00:00:00'),
(213, 21, '用户删除', NULL, NULL, NULL, 3, 2, 'user:delete', 1, '2024-01-01 00:00:00'),

-- 角色管理按钮权限
(221, 22, '角色新增', NULL, NULL, NULL, 1, 2, 'role:add', 1, '2024-01-01 00:00:00'),
(222, 22, '角色修改', NULL, NULL, NULL, 2, 2, 'role:edit', 1, '2024-01-01 00:00:00'),
(223, 22, '角色删除', NULL, NULL, NULL, 3, 2, 'role:delete', 1, '2024-01-01 00:00:00'),
(224, 22, '分配权限', NULL, NULL, NULL, 4, 2, 'role:permission', 1, '2024-01-01 00:00:00'),

-- 系统管理子菜单
(31, 3, '菜单管理', '/system/menu', 'Menu', 'MenuOutlined', 1, 1, 'menu:list', 1, '2024-01-01 00:00:00'),
(32, 3, '字典管理', '/system/dict', 'Dict', 'BookOutlined', 2, 1, 'dict:list', 1, '2024-01-01 00:00:00'),

-- 菜单管理按钮权限
(311, 31, '菜单新增', NULL, NULL, NULL, 1, 2, 'menu:add', 1, '2024-01-01 00:00:00'),
(312, 31, '菜单修改', NULL, NULL, NULL, 2, 2, 'menu:edit', 1, '2024-01-01 00:00:00'),
(313, 31, '菜单删除', NULL, NULL, NULL, 3, 2, 'menu:delete', 1, '2024-01-01 00:00:00'),

-- 日志管理子菜单
(41, 4, '操作日志', '/log/operation', 'OperationLog', 'EditOutlined', 1, 1, 'log:operation', 1, '2024-01-01 00:00:00'),
(42, 4, '登录日志', '/log/login', 'LoginLog', 'LoginOutlined', 2, 1, 'log:login', 1, '2024-01-01 00:00:00');

-- ============================================
-- 4. 插入角色菜单关联数据
-- ============================================
-- 超级管理员拥有所有权限
INSERT INTO sys_role_menu (role_id, menu_id) VALUES
(1, 1), (1, 2), (1, 21), (1, 211), (1, 212), (1, 213),
(1, 22), (1, 221), (1, 222), (1, 223), (1, 224),
(1, 3), (1, 31), (1, 311), (1, 312), (1, 313),
(1, 32), (1, 4), (1, 41), (1, 42);

-- 普通用户只有查看权限
INSERT INTO sys_role_menu (role_id, menu_id) VALUES
(2, 1), (2, 2), (2, 21), (2, 22), (2, 3), (2, 31), (2, 4), (2, 41), (2, 42);

-- 测试人员权限
INSERT INTO sys_role_menu (role_id, menu_id) VALUES
(3, 1), (3, 2), (3, 21), (3, 211), (3, 212), (3, 22), (3, 4), (3, 41), (3, 42);

-- ============================================
-- 5. 插入登录日志数据
-- ============================================
INSERT INTO sys_login_log (id, username, ip, location, browser, os, status, message, login_time) VALUES
(1, 'admin', '192.168.1.100', '北京市', 'Chrome 120.0', 'Windows 11', 1, '登录成功', '2024-01-15 08:30:00'),
(2, 'admin', '192.168.1.100', '北京市', 'Chrome 120.0', 'Windows 11', 1, '登录成功', '2024-01-15 09:15:00'),
(3, 'user', '192.168.1.101', '上海市', 'Firefox 121.0', 'Windows 10', 1, '登录成功', '2024-01-15 10:00:00'),
(4, 'tester', '192.168.1.102', '广州市', 'Edge 120.0', 'Windows 11', 1, '登录成功', '2024-01-15 10:30:00'),
(5, 'admin', '192.168.1.103', '深圳市', 'Chrome 120.0', 'macOS', 0, '密码错误', '2024-01-15 11:00:00'),
(6, 'zhangsan', '192.168.1.104', '杭州市', 'Chrome 119.0', 'Windows 10', 1, '登录成功', '2024-01-15 11:30:00'),
(7, 'lisi', '192.168.1.105', '南京市', 'Firefox 120.0', 'Ubuntu', 1, '登录成功', '2024-01-15 13:00:00'),
(8, 'admin', '192.168.1.100', '北京市', 'Chrome 120.0', 'Windows 11', 1, '登录成功', '2024-01-15 14:00:00'),
(9, 'wangwu', '192.168.1.106', '成都市', 'Safari 17.0', 'macOS', 1, '登录成功', '2024-01-15 15:30:00'),
(10, 'user', '192.168.1.101', '上海市', 'Chrome 120.0', 'Windows 10', 1, '登录成功', '2024-01-15 16:00:00');

-- ============================================
-- 6. 插入操作日志数据
-- ============================================
INSERT INTO sys_operation_log (id, username, module, type, description, request_method, request_url, ip, duration, status, create_time) VALUES
(1, 'admin', '用户管理', '新增', '新增用户: zhangsan', 'POST', '/api/user', '192.168.1.100', 120, 1, '2024-01-15 09:00:00'),
(2, 'admin', '用户管理', '修改', '修改用户: user', 'PUT', '/api/user', '192.168.1.100', 80, 1, '2024-01-15 09:30:00'),
(3, 'admin', '角色管理', '新增', '新增角色: 测试人员', 'POST', '/api/role', '192.168.1.100', 150, 1, '2024-01-15 10:00:00'),
(4, 'user', '用户管理', '查询', '查询用户列表', 'GET', '/api/user/list', '192.168.1.101', 50, 1, '2024-01-15 10:30:00'),
(5, 'tester', '菜单管理', '修改', '修改菜单: 用户管理', 'PUT', '/api/menu', '192.168.1.102', 200, 1, '2024-01-15 11:00:00'),
(6, 'admin', '用户管理', '删除', '删除用户: lisi', 'DELETE', '/api/user/5', '192.168.1.100', 100, 0, '2024-01-15 11:30:00'),
(7, 'zhangsan', '角色管理', '查询', '查询角色列表', 'GET', '/api/role/list', '192.168.1.104', 60, 1, '2024-01-15 13:00:00'),
(8, 'admin', '系统管理', '查询', '查询操作日志', 'GET', '/api/log/operation', '192.168.1.100', 180, 1, '2024-01-15 14:00:00'),
(9, 'user', '用户管理', '修改', '修改个人信息', 'PUT', '/api/user', '192.168.1.101', 90, 1, '2024-01-15 15:00:00'),
(10, 'admin', '角色管理', '分配权限', '为角色分配权限: 测试人员', 'PUT', '/api/role/3/permissions', '192.168.1.100', 250, 1, '2024-01-15 16:00:00');

-- ============================================
-- 7. 插入数据字典
-- ============================================
INSERT INTO sys_dict (id, dict_type, dict_code, dict_name, dict_value, sort, status, remark, create_time) VALUES
(1, 'user_status', 'enabled', '启用', '1', 1, 1, '用户状态-启用', '2024-01-01 00:00:00'),
(2, 'user_status', 'disabled', '禁用', '0', 2, 1, '用户状态-禁用', '2024-01-01 00:00:00'),
(3, 'menu_type', 'directory', '目录', '0', 1, 1, '菜单类型-目录', '2024-01-01 00:00:00'),
(4, 'menu_type', 'menu', '菜单', '1', 2, 1, '菜单类型-菜单', '2024-01-01 00:00:00'),
(5, 'menu_type', 'button', '按钮', '2', 3, 1, '菜单类型-按钮', '2024-01-01 00:00:00'),
(6, 'operation_type', 'add', '新增', 'add', 1, 1, '操作类型-新增', '2024-01-01 00:00:00'),
(7, 'operation_type', 'edit', '修改', 'edit', 2, 1, '操作类型-修改', '2024-01-01 00:00:00'),
(8, 'operation_type', 'delete', '删除', 'delete', 3, 1, '操作类型-删除', '2024-01-01 00:00:00'),
(9, 'operation_type', 'query', '查询', 'query', 4, 1, '操作类型-查询', '2024-01-01 00:00:00');
