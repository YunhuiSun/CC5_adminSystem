# 部署文档

## 环境要求

### 基础环境
- **操作系统**: Linux / Windows / macOS
- **数据库**: MySQL 8.0+
- **JDK**: 17+ (Java后端)
- **Python**: 3.10+ (Python后端)
- **Node.js**: 18+ (前端)

### 端口占用
- 前端: 5173 (开发) / 80 (生产)
- Java后端: 8080
- Python后端: 8000
- MySQL: 3306

---

## 数据库部署

### 1. 安装MySQL

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install mysql-server-8.0

# CentOS/RHEL
sudo yum install mysql-server

# macOS
brew install mysql
```

### 2. 创建数据库

```bash
# 登录MySQL
mysql -u root -p

# 创建数据库
CREATE DATABASE admin_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 创建用户（可选）
CREATE USER 'admin_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON admin_system.* TO 'admin_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. 导入数据

```bash
# 导入表结构
mysql -u root -p admin_system < database/schema.sql

# 导入测试数据
mysql -u root -p admin_system < database/data.sql
```

---

## 前端部署

### 开发环境

```bash
cd frontend
npm install
npm run dev
```

访问: http://localhost:5173

### 生产环境

```bash
cd frontend
npm install
npm run build
```

构建完成后，`dist` 目录包含所有静态文件，可部署到Nginx或CDN。

### Nginx配置示例

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /path/to/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8080/api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## Java后端部署

### 开发环境

```bash
cd backend-java
./mvnw spring-boot:run
```

### 生产环境

#### 1. 打包

```bash
cd backend-java
./mvnw clean package -DskipTests
```

#### 2. 运行

```bash
# 直接运行
java -jar target/admin-system-1.0.0.jar

# 后台运行
nohup java -jar target/admin-system-1.0.0.jar > app.log 2>&1 &

# 指定配置文件
java -jar target/admin-system-1.0.0.jar --spring.profiles.active=prod
```

#### 3. 使用Systemd管理（Linux）

创建服务文件 `/etc/systemd/system/admin-java.service`:

```ini
[Unit]
Description=Admin System Java Backend
After=network.target

[Service]
Type=simple
User=admin
WorkingDirectory=/path/to/backend-java
ExecStart=/usr/bin/java -jar target/admin-system-1.0.0.jar
Restart=always

[Install]
WantedBy=multi-user.target
```

启动服务:

```bash
sudo systemctl daemon-reload
sudo systemctl enable admin-java
sudo systemctl start admin-java
sudo systemctl status admin-java
```

---

## Python后端部署

### 开发环境

```bash
cd backend-python
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/macOS
source venv/bin/activate

pip install -r requirements.txt
python main.py
```

### 生产环境

#### 1. 使用Gunicorn + Uvicorn

```bash
pip install gunicorn

# 启动
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000
```

#### 2. 使用Systemd管理（Linux）

创建服务文件 `/etc/systemd/system/admin-python.service`:

```ini
[Unit]
Description=Admin System Python Backend
After=network.target

[Service]
Type=simple
User=admin
WorkingDirectory=/path/to/backend-python
Environment="PATH=/path/to/backend-python/venv/bin"
ExecStart=/path/to/backend-python/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

启动服务:

```bash
sudo systemctl daemon-reload
sudo systemctl enable admin-python
sudo systemctl start admin-python
sudo systemctl status admin-python
```

#### 3. 使用Docker部署

创建 `Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

构建并运行:

```bash
docker build -t admin-python .
docker run -d -p 8000:8000 --name admin-python admin-python
```

---

## Docker Compose 部署（推荐）

创建 `docker-compose.yml`:

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: admin-mysql
    environment:
      MYSQL_ROOT_PASSWORD: 123456
      MYSQL_DATABASE: admin_system
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./database/schema.sql:/docker-entrypoint-initdb.d/1-schema.sql
      - ./database/data.sql:/docker-entrypoint-initdb.d/2-data.sql

  java-backend:
    build: ./backend-java
    container_name: admin-java
    ports:
      - "8080:8080"
    depends_on:
      - mysql
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/admin_system?useSSL=false

  python-backend:
    build: ./backend-python
    container_name: admin-python
    ports:
      - "8000:8000"
    depends_on:
      - mysql
    environment:
      DB_HOST: mysql

  frontend:
    build: ./frontend
    container_name: admin-frontend
    ports:
      - "80:80"
    depends_on:
      - java-backend

volumes:
  mysql_data:
```

启动:

```bash
docker-compose up -d
```

---

## 常见问题

### 1. 数据库连接失败

检查MySQL服务是否启动，以及连接配置是否正确。

### 2. 端口被占用

```bash
# 查看端口占用
netstat -tlnp | grep 8080

# 杀死进程
kill -9 <PID>
```

### 3. 跨域问题

确保后端CORS配置正确，允许前端域名访问。

### 4. 内存不足

Java后端可以调整JVM参数:

```bash
java -Xms512m -Xmx1024m -jar admin-system-1.0.0.jar
```

---

## 监控与日志

### 查看日志

```bash
# Java后端
tail -f /path/to/backend-java/logs/application.log

# Python后端
tail -f /path/to/backend-python/app.log

# Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 健康检查

```bash
# Java后端
curl http://localhost:8080/api/actuator/health

# Python后端
curl http://localhost:8000/health
```
