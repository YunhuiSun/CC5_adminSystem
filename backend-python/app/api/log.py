from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.models import get_db, LoginLog, OperationLog
from app.schemas.schemas import Result
from typing import Optional

router = APIRouter(prefix="/log", tags=["日志管理"])


@router.get("/login", response_model=Result)
def get_login_log(
    pageNum: int = 1,
    pageSize: int = 10,
    username: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """获取登录日志"""
    query = db.query(LoginLog)

    if username:
        query = query.filter(LoginLog.username.contains(username))

    total = query.count()
    logs = query.order_by(LoginLog.login_time.desc()).offset((pageNum - 1) * pageSize).limit(pageSize).all()

    list_data = []
    for log in logs:
        list_data.append({
            "id": log.id,
            "username": log.username,
            "ip": log.ip,
            "location": log.location,
            "browser": log.browser,
            "os": log.os,
            "status": log.status,
            "message": log.message,
            "loginTime": log.login_time.strftime("%Y-%m-%d %H:%M:%S")
        })

    return Result.success({
        "list": list_data,
        "total": total,
        "pageNum": pageNum,
        "pageSize": pageSize
    })


@router.delete("/login/clear", response_model=Result)
def clear_login_log(db: Session = Depends(get_db)):
    """清空登录日志"""
    try:
        db.query(LoginLog).delete()
        db.commit()
        return Result.success()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"清空登录日志失败: {str(e)}")


@router.delete("/login/{log_id}", response_model=Result)
def delete_login_log(log_id: int, db: Session = Depends(get_db)):
    """删除单条登录日志"""
    log = db.query(LoginLog).filter(LoginLog.id == log_id).first()
    if not log:
        raise HTTPException(status_code=404, detail="日志不存在")
    try:
        db.delete(log)
        db.commit()
        return Result.success()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"删除日志失败: {str(e)}")


@router.get("/operation", response_model=Result)
def get_operation_log(
    pageNum: int = 1,
    pageSize: int = 10,
    module: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """获取操作日志"""
    query = db.query(OperationLog)

    if module:
        query = query.filter(
            (OperationLog.module.contains(module)) |
            (OperationLog.username.contains(module))
        )

    total = query.count()
    logs = query.order_by(OperationLog.create_time.desc()).offset((pageNum - 1) * pageSize).limit(pageSize).all()

    list_data = []
    for log in logs:
        list_data.append({
            "id": log.id,
            "username": log.username,
            "module": log.module,
            "type": log.type,
            "description": log.description,
            "requestMethod": log.request_method,
            "requestUrl": log.request_url,
            "ip": log.ip,
            "duration": log.duration,
            "status": log.status,
            "createTime": log.create_time.strftime("%Y-%m-%d %H:%M:%S")
        })

    return Result.success({
        "list": list_data,
        "total": total,
        "pageNum": pageNum,
        "pageSize": pageSize
    })


@router.delete("/operation/clear", response_model=Result)
def clear_operation_log(db: Session = Depends(get_db)):
    """清空操作日志"""
    try:
        db.query(OperationLog).delete()
        db.commit()
        return Result.success()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"清空操作日志失败: {str(e)}")


@router.delete("/operation/{log_id}", response_model=Result)
def delete_operation_log(log_id: int, db: Session = Depends(get_db)):
    """删除单条操作日志"""
    log = db.query(OperationLog).filter(OperationLog.id == log_id).first()
    if not log:
        raise HTTPException(status_code=404, detail="日志不存在")
    try:
        db.delete(log)
        db.commit()
        return Result.success()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"删除日志失败: {str(e)}")
