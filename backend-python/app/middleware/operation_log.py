"""操作日志中间件"""
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp
import time
import jwt
from datetime import datetime, timedelta
from app.core.config import settings

# 请求防重缓存: {(username, module, method, path): timestamp}
_request_cache = {}
_CACHE_TTL = 2  # 2秒内相同请求不重复记录


class OperationLogMiddleware(BaseHTTPMiddleware):
    """操作日志中间件 - 记录所有API请求"""

    def __init__(self, app: ASGIApp):
        super().__init__(app)

    async def dispatch(self, request: Request, call_next):
        # 跳过不需要记录的请求
        if self._should_skip(request):
            return await call_next(request)

        start_time = time.time()

        # 获取请求信息
        method = request.method
        url = str(request.url)
        path = request.url.path

        # 获取当前用户（从token中解析）
        username = self._get_current_user(request)

        # 获取请求参数
        try:
            body = await request.body()
            params = body.decode('utf-8') if body else None
        except:
            params = None

        # 调用下一个中间件/路由
        response = await call_next(request)

        # 计算执行时间
        duration = int((time.time() - start_time) * 1000)

        # 获取客户端IP
        ip = self._get_client_ip(request)

        # 确定操作模块和类型
        module, operation_type = self._parse_operation(path, method)

        # 只记录增删改操作和重要的查询操作
        if module:
            try:
                # 检查是否是重复请求
                if not self._is_duplicate(username, module, method, path):
                    self._record_log(
                        username=username,
                        module=module,
                        operation_type=operation_type,
                        method=method,
                        url=url,
                        params=params,
                        ip=ip,
                        duration=duration,
                        status=1 if response.status_code < 400 else 0
                    )
            except Exception as e:
                print(f"记录操作日志失败: {e}")

        return response

    def _is_duplicate(self, username: str, module: str, method: str, path: str) -> bool:
        """检查是否是重复请求"""
        global _request_cache
        cache_key = (username, module, method, path)
        current_time = time.time()

        # 清理过期缓存
        expired_keys = [k for k, v in _request_cache.items() if current_time - v > _CACHE_TTL]
        for k in expired_keys:
            del _request_cache[k]

        # 检查是否重复
        if cache_key in _request_cache:
            last_time = _request_cache[cache_key]
            if current_time - last_time < _CACHE_TTL:
                return True

        # 更新缓存
        _request_cache[cache_key] = current_time
        return False

    def _should_skip(self, request: Request) -> bool:
        """跳过某些不需要记录的请求"""
        path = request.url.path
        skip_paths = [
            '/api/auth/login',  # 登录单独记录
            '/api/log/',        # 日志查询不记录
            '/docs',            # Swagger文档
            '/openapi.json',    # OpenAPI规范
            '/static/',         # 静态文件
        ]
        return any(path.startswith(skip) for skip in skip_paths)

    def _get_current_user(self, request: Request) -> str:
        """从请求中获取当前用户"""
        auth_header = request.headers.get('Authorization', '')
        if auth_header.startswith('Bearer '):
            token = auth_header.replace('Bearer ', '')
            try:
                # 解析 JWT token
                payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
                username = payload.get('sub')
                if username:
                    return username
            except jwt.ExpiredSignatureError:
                return 'expired_token'
            except jwt.InvalidTokenError:
                return 'invalid_token'
            except Exception as e:
                print(f"解析token失败: {e}")
                return 'unknown'
        return 'anonymous'

    def _get_client_ip(self, request: Request) -> str:
        """获取客户端IP"""
        if request.headers.get("X-Forwarded-For"):
            return request.headers.get("X-Forwarded-For").split(",")[0].strip()
        elif request.headers.get("X-Real-IP"):
            return request.headers.get("X-Real-IP")
        else:
            return request.client.host if request.client else "unknown"

    def _parse_operation(self, path: str, method: str) -> tuple:
        """解析操作模块和类型"""
        # 路径格式: /api/user, /api/role, /api/menu
        parts = path.split('/')
        if len(parts) < 3:
            return None, None

        module_map = {
            'user': '用户管理',
            'role': '角色管理',
            'menu': '菜单管理',
            'dict': '字典管理',
            'log': '日志管理',
        }

        module_key = parts[2] if len(parts) > 2 else ''
        module = module_map.get(module_key)

        if not module:
            return None, None

        # 根据HTTP方法确定操作类型
        type_map = {
            'GET': '查询',
            'POST': '新增',
            'PUT': '修改',
            'DELETE': '删除',
        }
        operation_type = type_map.get(method, '其他')

        return module, operation_type

    def _record_log(self, username: str, module: str, operation_type: str,
                    method: str, url: str, params: str, ip: str,
                    duration: int, status: int):
        """记录操作日志到数据库"""
        from app.db.models import SessionLocal, OperationLog

        db = SessionLocal()
        try:
            # 截断参数，避免过长
            if params and len(params) > 1000:
                params = params[:1000] + '...'

            log = OperationLog(
                username=username,
                module=module,
                type=operation_type,
                description=f"{operation_type}{module}",
                request_method=method,
                request_url=url,
                request_params=params,
                ip=ip,
                duration=duration,
                status=status
            )
            db.add(log)
            db.commit()
        except Exception as e:
            print(f"写入操作日志失败: {e}")
            db.rollback()
        finally:
            db.close()


def setup_operation_log_middleware(app):
    """配置操作日志中间件"""
    app.add_middleware(OperationLogMiddleware)
