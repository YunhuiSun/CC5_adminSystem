from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.models import get_db, User, Role
from app.schemas.schemas import (
    UserCreate, UserUpdate, UserResponse, Result, PageResult, PageQuery
)
from app.core.security import get_password_hash
from typing import Optional

router = APIRouter(prefix="/user", tags=["用户管理"])


@router.get("/list", response_model=Result)
def get_user_list(
    pageNum: int = 1,
    pageSize: int = 10,
    keyword: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """获取用户列表"""
    query = db.query(User)

    if keyword:
        query = query.filter(
            (User.username.contains(keyword)) |
            (User.nickname.contains(keyword))
        )

    total = query.count()
    users = query.offset((pageNum - 1) * pageSize).limit(pageSize).all()

    list_data = []
    for user in users:
        list_data.append({
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
        })

    return Result.success({
        "list": list_data,
        "total": total,
        "pageNum": pageNum,
        "pageSize": pageSize
    })


@router.post("", response_model=Result)
def add_user(user: UserCreate, db: Session = Depends(get_db)):
    """新增用户"""
    # 检查用户名是否已存在
    existing = db.query(User).filter(User.username == user.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="用户名已存在")

    db_user = User(
        username=user.username,
        password=get_password_hash(user.password),
        nickname=user.nickname,
        email=user.email,
        phone=user.phone,
        avatar=user.avatar,
        status=user.status,
        role_id=user.role_id
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return Result.success()


@router.put("", response_model=Result)
def update_user(user: UserUpdate, db: Session = Depends(get_db)):
    """修改用户"""
    db_user = db.query(User).filter(User.id == user.id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="用户不存在")

    db_user.nickname = user.nickname
    db_user.email = user.email
    db_user.phone = user.phone
    db_user.avatar = user.avatar
    db_user.status = user.status
    db_user.role_id = user.role_id

    if user.password:
        db_user.password = get_password_hash(user.password)

    db.commit()
    db.refresh(db_user)

    return Result.success()


@router.delete("/{user_id}", response_model=Result)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    """删除用户"""
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="用户不存在")

    db.delete(db_user)
    db.commit()

    return Result.success()