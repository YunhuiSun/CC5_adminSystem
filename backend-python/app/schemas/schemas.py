from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime


# ==================== 通用响应模型 ====================

class Result(BaseModel):
    code: int = 200
    message: str = "success"
    data: Optional[dict] = None

    @classmethod
    def success(cls, data=None):
        return cls(code=200, message="success", data=data)

    @classmethod
    def error(cls, message: str, code: int = 500):
        return cls(code=code, message=message, data=None)


class PageResult(BaseModel):
    list: List[dict]
    total: int
    pageNum: int
    pageSize: int


# ==================== 认证相关模型 ====================

class LoginRequest(BaseModel):
    username: str = Field(..., min_length=1, description="用户名")
    password: str = Field(..., min_length=1, description="密码")


class LoginResponse(BaseModel):
    token: str
    user: dict


# ==================== 用户相关模型 ====================

class UserBase(BaseModel):
    username: str = Field(..., min_length=1, max_length=50)
    nickname: str = Field(..., min_length=1, max_length=50)
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    avatar: Optional[str] = None
    status: int = Field(default=1, ge=0, le=1)
    role_id: int


class UserCreate(UserBase):
    password: str = Field(..., min_length=6)


class UserUpdate(UserBase):
    id: int
    password: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    username: str
    nickname: str
    email: Optional[str]
    phone: Optional[str]
    avatar: Optional[str]
    status: int
    role_id: int
    role_name: Optional[str]
    create_time: datetime

    class Config:
        from_attributes = True


# ==================== 角色相关模型 ====================

class RoleBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    code: str = Field(..., min_length=1, max_length=50)
    description: Optional[str] = None
    status: int = Field(default=1, ge=0, le=1)


class RoleCreate(RoleBase):
    pass


class RoleUpdate(RoleBase):
    id: int


class RoleResponse(BaseModel):
    id: int
    name: str
    code: str
    description: Optional[str]
    status: int
    create_time: datetime

    class Config:
        from_attributes = True


# ==================== 菜单相关模型 ====================

class MenuBase(BaseModel):
    parent_id: int = Field(default=0)
    name: str = Field(..., min_length=1, max_length=50)
    path: Optional[str] = None
    component: Optional[str] = None
    icon: Optional[str] = None
    sort: int = Field(default=0)
    type: int = Field(default=1, ge=0, le=2)
    permission: Optional[str] = None
    status: int = Field(default=1, ge=0, le=1)


class MenuCreate(MenuBase):
    pass


class MenuUpdate(MenuBase):
    id: int


class MenuResponse(BaseModel):
    id: int
    parent_id: int
    name: str
    path: Optional[str]
    component: Optional[str]
    icon: Optional[str]
    sort: int
    type: int
    permission: Optional[str]
    status: int
    create_time: datetime

    class Config:
        from_attributes = True


# ==================== 日志相关模型 ====================

class LoginLogResponse(BaseModel):
    id: int
    username: Optional[str]
    ip: Optional[str]
    location: Optional[str]
    browser: Optional[str]
    os: Optional[str]
    status: int
    message: Optional[str]
    login_time: datetime

    class Config:
        from_attributes = True


class OperationLogResponse(BaseModel):
    id: int
    username: Optional[str]
    module: Optional[str]
    type: Optional[str]
    description: Optional[str]
    request_method: Optional[str]
    request_url: Optional[str]
    ip: Optional[str]
    duration: int
    status: int
    create_time: datetime

    class Config:
        from_attributes = True


# ==================== 分页查询模型 ====================

class PageQuery(BaseModel):
    pageNum: int = Field(default=1, ge=1)
    pageSize: int = Field(default=10, ge=1, le=100)
    keyword: Optional[str] = None