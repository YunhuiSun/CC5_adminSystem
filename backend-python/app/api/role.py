from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.models import get_db, Role
from app.schemas.schemas import RoleCreate, RoleUpdate, Result
from typing import Optional

router = APIRouter(prefix="/role", tags=["角色管理"])


from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.models import get_db, Role
from app.schemas.schemas import RoleCreate, RoleUpdate, Result
from typing import Optional

router = APIRouter(prefix="/role", tags=["角色管理"])


@router.get("/list", response_model=Result)
def get_role_list(
    pageNum: int = 1,
    pageSize: int = 10,
    keyword: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """获取角色列表"""
    query = db.query(Role)

    if keyword:
        query = query.filter(
            (Role.name.contains(keyword)) | (Role.code.contains(keyword))
        )

    total = query.count()
    roles = query.offset((pageNum - 1) * pageSize).limit(pageSize).all()

    list_data = []
    for role in roles:
        list_data.append({
            "id": role.id,
            "name": role.name,
            "code": role.code,
            "description": role.description,
            "status": role.status,
            "createTime": role.create_time.strftime("%Y-%m-%d %H:%M:%S")
        })

    return Result.success({
        "list": list_data,
        "total": total,
        "pageNum": pageNum,
        "pageSize": pageSize
    })


@router.get("/all", response_model=Result)
def get_all_roles(db: Session = Depends(get_db)):
    """获取所有角色"""
    try:
        roles = db.query(Role).all()

        list_data = []
        for role in roles:
            list_data.append({
                "id": role.id,
                "name": role.name,
                "code": role.code,
                "description": role.description,
                "status": role.status,
                "createTime": role.create_time.strftime("%Y-%m-%d %H:%M:%S")
            })

        return Result.success({"list": list_data})
    except Exception as e:
        print(f"ERROR in get_all_roles: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.post("", response_model=Result)
def add_role(role: RoleCreate, db: Session = Depends(get_db)):
    """新增角色"""
    # 检查角色编码是否已存在
    existing = db.query(Role).filter(Role.code == role.code).first()
    if existing:
        raise HTTPException(status_code=400, detail="角色编码已存在")

    db_role = Role(
        name=role.name,
        code=role.code,
        description=role.description,
        status=role.status
    )
    db.add(db_role)
    db.commit()
    db.refresh(db_role)

    return Result.success()


@router.put("", response_model=Result)
def update_role(role: RoleUpdate, db: Session = Depends(get_db)):
    """修改角色"""
    db_role = db.query(Role).filter(Role.id == role.id).first()
    if not db_role:
        raise HTTPException(status_code=404, detail="角色不存在")

    db_role.name = role.name
    db_role.description = role.description
    db_role.status = role.status

    db.commit()
    db.refresh(db_role)

    return Result.success()


@router.delete("/{role_id}", response_model=Result)
def delete_role(role_id: int, db: Session = Depends(get_db)):
    """删除角色"""
    db_role = db.query(Role).filter(Role.id == role_id).first()
    if not db_role:
        raise HTTPException(status_code=404, detail="角色不存在")

    db.delete(db_role)
    db.commit()

    return Result.success()