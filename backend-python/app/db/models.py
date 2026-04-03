from sqlalchemy import create_engine, Column, BigInteger, String, Integer, DateTime, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from app.core.config import settings
from datetime import datetime

# 创建引擎
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=3600,
    echo=False
)

# 会话工厂
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 基类
Base = declarative_base()


# 依赖注入获取数据库会话
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class User(Base):
    __tablename__ = "sys_user"

    id = Column(BigInteger, primary_key=True, autoincrement=True, comment="主键ID")
    username = Column(String(50), unique=True, nullable=False, comment="用户名")
    password = Column(String(100), nullable=False, comment="密码")
    nickname = Column(String(50), comment="昵称")
    email = Column(String(100), comment="邮箱")
    phone = Column(String(20), comment="手机号")
    avatar = Column(String(200), comment="头像")
    status = Column(Integer, default=1, comment="状态")
    role_id = Column(BigInteger, ForeignKey("sys_role.id"), comment="角色ID")
    create_time = Column(DateTime, default=datetime.now, comment="创建时间")
    update_time = Column(DateTime, default=datetime.now, onupdate=datetime.now, comment="更新时间")

    role = relationship("Role", back_populates="users")


class Role(Base):
    __tablename__ = "sys_role"

    id = Column(BigInteger, primary_key=True, autoincrement=True, comment="主键ID")
    name = Column(String(50), nullable=False, comment="角色名称")
    code = Column(String(50), unique=True, nullable=False, comment="角色编码")
    description = Column(String(200), comment="描述")
    status = Column(Integer, default=1, comment="状态")
    create_time = Column(DateTime, default=datetime.now, comment="创建时间")
    update_time = Column(DateTime, default=datetime.now, onupdate=datetime.now, comment="更新时间")

    users = relationship("User", back_populates="role")


class Menu(Base):
    __tablename__ = "sys_menu"

    id = Column(BigInteger, primary_key=True, autoincrement=True, comment="主键ID")
    parent_id = Column(BigInteger, default=0, comment="父菜单ID")
    name = Column(String(50), nullable=False, comment="菜单名称")
    path = Column(String(100), comment="路由路径")
    component = Column(String(100), comment="组件路径")
    icon = Column(String(50), comment="图标")
    sort = Column(Integer, default=0, comment="排序")
    type = Column(Integer, default=1, comment="类型")
    permission = Column(String(100), comment="权限标识")
    status = Column(Integer, default=1, comment="状态")
    create_time = Column(DateTime, default=datetime.now, comment="创建时间")
    update_time = Column(DateTime, default=datetime.now, onupdate=datetime.now, comment="更新时间")


class LoginLog(Base):
    __tablename__ = "sys_login_log"

    id = Column(BigInteger, primary_key=True, autoincrement=True, comment="主键ID")
    username = Column(String(50), comment="用户名")
    ip = Column(String(50), comment="IP地址")
    location = Column(String(100), comment="登录地点")
    browser = Column(String(50), comment="浏览器")
    os = Column(String(50), comment="操作系统")
    status = Column(Integer, default=1, comment="状态")
    message = Column(String(200), comment="消息")
    login_time = Column(DateTime, default=datetime.now, comment="登录时间")


class OperationLog(Base):
    __tablename__ = "sys_operation_log"

    id = Column(BigInteger, primary_key=True, autoincrement=True, comment="主键ID")
    username = Column(String(50), comment="用户名")
    module = Column(String(50), comment="操作模块")
    type = Column(String(50), comment="操作类型")
    description = Column(String(200), comment="描述")
    request_method = Column(String(10), comment="请求方法")
    request_url = Column(String(200), comment="请求URL")
    request_params = Column(Text, comment="请求参数")
    response_data = Column(Text, comment="响应数据")
    ip = Column(String(50), comment="IP地址")
    duration = Column(Integer, default=0, comment="耗时")
    status = Column(Integer, default=1, comment="状态")
    error_msg = Column(Text, comment="错误信息")
    create_time = Column(DateTime, default=datetime.now, comment="创建时间")