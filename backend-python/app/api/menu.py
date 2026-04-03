from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.models import get_db, Menu
from app.schemas.schemas import MenuCreate, MenuUpdate, Result
from typing import Optional

router = APIRouter(prefix="/menu", tags=["菜单管理"])


@router.get("/list", response_model=Result)
def get_menu_list(
    keyword: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """获取菜单列表"""
    query = db.query(Menu)

    if keyword:
        query = query.filter(Menu.name.contains(keyword))

    menus = query.all()

    list_data = []
    for menu in menus:
        list_data.append({
            "id": menu.id,
            "parentId": menu.parent_id,
            "name": menu.name,
            "path": menu.path,
            "component": menu.component,
            "icon": menu.icon,
            "sort": menu.sort,
            "type": menu.type,
            "permission": menu.permission,
            "status": menu.status,
            "createTime": menu.create_time.strftime("%Y-%m-%d %H:%M:%S")
        })

    return Result.success({"list": list_data})


@router.post("", response_model=Result)
def add_menu(menu: MenuCreate, db: Session = Depends(get_db)):
    """新增菜单"""
    db_menu = Menu(
        parent_id=menu.parent_id,
        name=menu.name,
        path=menu.path,
        component=menu.component,
        icon=menu.icon,
        sort=menu.sort,
        type=menu.type,
        permission=menu.permission,
        status=menu.status
    )
    db.add(db_menu)
    db.commit()
    db.refresh(db_menu)

    return Result.success()


@router.put("", response_model=Result)
def update_menu(menu: MenuUpdate, db: Session = Depends(get_db)):
    """修改菜单"""
    db_menu = db.query(Menu).filter(Menu.id == menu.id).first()
    if not db_menu:
        raise HTTPException(status_code=404, detail="菜单不存在")

    db_menu.parent_id = menu.parent_id
    db_menu.name = menu.name
    db_menu.path = menu.path
    db_menu.component = menu.component
    db_menu.icon = menu.icon
    db_menu.sort = menu.sort
    db_menu.type = menu.type
    db_menu.permission = menu.permission
    db_menu.status = menu.status

    db.commit()
    db.refresh(db_menu)

    return Result.success()


@router.delete("/{menu_id}", response_model=Result)
def delete_menu(menu_id: int, db: Session = Depends(get_db)):
    """删除菜单"""
    db_menu = db.query(Menu).filter(Menu.id == menu_id).first()
    if not db_menu:
        raise HTTPException(status_code=404, detail="菜单不存在")

    db.delete(db_menu)
    db.commit()

    return Result.success()