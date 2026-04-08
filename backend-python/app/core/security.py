from fastapi import HTTPException, status
from jose import JWTError, jwt
from datetime import datetime, timedelta
from app.core.config import settings


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """验证密码"""
    import bcrypt
    # 处理不同版本的 bcrypt 哈希前缀 ($2a$, $2b$, $2y$)
    # bcrypt 库只接受 $2b$ 前缀，需要转换
    if hashed_password.startswith('$2a$'):
        hashed_password = '$2b$' + hashed_password[4:]
    elif hashed_password.startswith('$2y$'):
        hashed_password = '$2b$' + hashed_password[4:]
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))


def get_password_hash(password: str) -> str:
    """获取密码哈希"""
    import bcrypt
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')


def create_access_token(data: dict) -> str:
    """创建JWT令牌"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(seconds=settings.JWT_EXPIRATION)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode,
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM
    )
    return encoded_jwt


def verify_token(token: str) -> str:
    """验证JWT令牌，返回用户名"""
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM]
        )
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="无效的认证令牌"
            )
        return username
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="无效的认证令牌"
        )
