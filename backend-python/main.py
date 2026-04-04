from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import auth, user, role, menu, log
from app.middleware.operation_log import setup_operation_log_middleware

# 创建FastAPI应用 hello
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="后台管理系统API - Python FastAPI后端",
    docs_url="/docs",
    redoc_url="/redoc",
)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册操作日志中间件
setup_operation_log_middleware(app)

# 注册路由
app.include_router(auth.router, prefix="/api")
app.include_router(user.router, prefix="/api")
app.include_router(role.router, prefix="/api")
app.include_router(menu.router, prefix="/api")
app.include_router(log.router, prefix="/api")


@app.get("/")
def root():
    return {
        "message": "Admin System API",
        "version": settings.APP_VERSION,
        "docs": "/docs"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )