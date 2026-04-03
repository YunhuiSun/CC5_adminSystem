from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from app.db.models import get_db, User, Role, LoginLog
from app.schemas.schemas import LoginRequest, LoginResponse, Result, UserResponse
from app.core.security import verify_password, create_access_token
import time

router = APIRouter(prefix="/auth", tags=["认证"])


def get_client_ip(request: Request):
    """获取客户端真实IP"""
    # 按优先级获取真实IP
    headers_to_check = [
        "X-Forwarded-For",
        "X-Real-IP",
        "X-Forwarded",
        "Forwarded-For",
        "Forwarded",
        "X-Requested-For",
        "X-Cluster-Client-IP",
        "X-ProxyUser-Ip",
    ]

    for header in headers_to_check:
        value = request.headers.get(header)
        if value:
            # X-Forwarded-For 可能包含多个IP，取第一个
            ip = value.split(",")[0].strip()
            if ip and ip != "127.0.0.1" and not ip.startswith("10.") and not ip.startswith("192.168."):
                return ip
            if ip:
                return ip

    # 从请求中获取
    if request.client and request.client.host:
        return request.client.host

    return "unknown"


def get_location_from_ip(ip: str) -> str:
    """根据IP获取地理位置（简化版）"""
    # 本地IP
    if ip in ["127.0.0.1", "localhost", "::1"]:
        return "本地"

    # 私有IP段
    if ip.startswith("192.168.") or ip.startswith("10.") or ip.startswith("172."):
        return "局域网"

    # 这里可以接入第三方IP地理位置服务
    # 如：ip-api.com, ip138.com, 百度地图API等
    # 简化处理，返回未知
    return "未知"


def get_user_agent(request: Request):
    """解析User-Agent获取浏览器和操作系统"""
    import re
    user_agent = request.headers.get("User-Agent", "")
    browser = "Unknown"
    browser_version = ""
    os = "Unknown"
    os_version = ""

    # 解析浏览器 - Edge 必须在 Chrome 之前检查，因为 Edge 也包含 Chrome
    if "Edg" in user_agent:
        browser = "Edge"
        match = re.search(r'Edg/([\d.]+)', user_agent)
        browser_version = match.group(1) if match else ""
    elif "Chrome" in user_agent:
        browser = "Chrome"
        match = re.search(r'Chrome/([\d.]+)', user_agent)
        browser_version = match.group(1) if match else ""
    elif "Firefox" in user_agent:
        browser = "Firefox"
        match = re.search(r'Firefox/([\d.]+)', user_agent)
        browser_version = match.group(1) if match else ""
    elif "Safari" in user_agent and "Chrome" not in user_agent:
        browser = "Safari"
        match = re.search(r'Version/([\d.]+)', user_agent)
        browser_version = match.group(1) if match else ""

    # 解析操作系统
    if "Windows NT 10.0" in user_agent:
        os = "Windows"
        os_version = "10/11"
    elif "Windows NT 6.3" in user_agent:
        os = "Windows"
        os_version = "8.1"
    elif "Windows NT 6.2" in user_agent:
        os = "Windows"
        os_version = "8"
    elif "Windows NT 6.1" in user_agent:
        os = "Windows"
        os_version = "7"
    elif "Windows" in user_agent:
        os = "Windows"
    elif "Mac OS X" in user_agent or "macOS" in user_agent:
        os = "macOS"
        match = re.search(r'Mac OS X ([\d_]+)', user_agent)
        if match:
            os_version = match.group(1).replace('_', '.')
    elif "Linux" in user_agent:
        os = "Linux"

    # 组合浏览器和版本（简化版本号，只显示主版本）
    if browser_version:
        # 提取主版本号（如 120.0.0.0 -> 120）
        major_version = browser_version.split('.')[0]
        browser_full = f"{browser} {major_version}"
    else:
        browser_full = browser

    # 简化操作系统版本显示
    if os == "Windows":
        # Windows NT 10.0 可能是 Windows 10 或 11，无法确定，只显示 Windows
        if os_version == "10/11":
            os_full = "Windows"
        elif os_version:
            os_full = f"Windows {os_version}"
        else:
            os_full = "Windows"
    elif os == "macOS" and os_version:
        # 简化 macOS 版本显示
        major = os_version.split('.')[0]
        os_full = f"macOS {major}"
    else:
        os_full = os

    return browser_full, os_full


def record_login_log(db: Session, username: str, ip: str, location: str, browser: str, os: str, status: int, message: str):
    """记录登录日志"""
    try:
        log = LoginLog(
            username=username,
            ip=ip,
            location=location,
            browser=browser,
            os=os,
            status=status,
            message=message
        )
        db.add(log)
        db.commit()
    except Exception as e:
        print(f"记录登录日志失败: {e}")
        db.rollback()


@router.post("/login", response_model=Result)
def login(request: Request, login_request: LoginRequest, db: Session = Depends(get_db)):
    """用户登录"""
    ip = get_client_ip(request)
    browser, os = get_user_agent(request)
    location = get_location_from_ip(ip)
    username = login_request.username

    print(f"DEBUG: 尝试登录用户: {username}, IP: {ip}, 浏览器: {browser}, 系统: {os}")

    user = db.query(User).filter(User.username == username).first()
    if not user:
        print("DEBUG: 用户不存在")
        record_login_log(db, username, ip, location, browser, os, 0, "用户不存在")
        raise HTTPException(status_code=400, detail="用户不存在")

    print(f"DEBUG: 找到用户: {user.username}")

    verify_result = verify_password(login_request.password, user.password)
    print(f"DEBUG: 密码验证结果: {verify_result}")

    if not verify_result:
        record_login_log(db, username, ip, location, browser, os, 0, "密码错误")
        raise HTTPException(status_code=400, detail="密码错误")

    if user.status == 0:
        record_login_log(db, username, ip, location, browser, os, 0, "账号已被禁用")
        raise HTTPException(status_code=400, detail="账号已被禁用")

    # 生成JWT令牌
    token = create_access_token({"sub": user.username})

    # 构建响应数据
    user_data = {
        "id": user.id,
        "username": user.username,
        "nickname": user.nickname,
        "email": user.email,
        "phone": user.phone,
        "avatar": user.avatar,
        "status": user.status,
        "roleId": user.role_id,
        "roleName": user.role.name if user.role else None,
        "createTime": user.create_time.strftime("%Y-%m-%d %H:%M:%S")
    }

    # 记录登录成功日志
    record_login_log(db, username, ip, location, browser, os, 1, "登录成功")

    return Result.success({
        "token": token,
        "user": user_data
    })


@router.get("/info", response_model=Result)
def get_user_info(current_user: str = Depends(lambda: "admin"), db: Session = Depends(get_db)):
    """获取当前用户信息"""
    # 这里需要从JWT中获取当前用户
    # 简化处理，实际应该从token中解析
    user = db.query(User).filter(User.username == "admin").first()
    if not user:
        raise HTTPException(status_code=404, detail="用户不存在")

    user_data = {
        "id": user.id,
        "username": user.username,
        "nickname": user.nickname,
        "email": user.email,
        "phone": user.phone,
        "avatar": user.avatar,
        "status": user.status,
        "roleId": user.role_id,
        "roleName": user.role.name if user.role else None,
        "createTime": user.create_time.strftime("%Y-%m-%d %H:%M:%S")
    }

    return Result.success(user_data)