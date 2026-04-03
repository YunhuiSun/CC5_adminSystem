from fastapi import HTTPException, status
from jose import JWTError, jwt
from datetime import datetime, timedelta
from app.core.config import settings


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """验证密码"""
    import hashlib
    # 计算明文密码的哈希
    plain_hash = hashlib.sha256(plain_password.encode()).hexdigest()
    # 比较哈希值
    return plain_hash == hashed_password


def get_password_hash(password: str) -> str:
    """获取密码哈希 - 临时使用SHA256"""
    import hashlib
    return hashlib.sha256(password.encode()).hexdigest()


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