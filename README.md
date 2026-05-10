# Rowaida Art Platform

Production-ready full-stack web app using Nuxt 3/4 style full-stack architecture, Tailwind CSS, and MySQL.

## Features

- Public pages: Home, Cinema, Art Room/Events
- Cinema catalog with showtimes and 10-seat visual status
- Contact-first reservation flow (Phone + WhatsApp, no online checkout)
- Admin dashboard:
  - Movies CRUD
  - Showtimes CRUD
  - Events CRUD
  - Contact settings
- Server API routes with MySQL queries and input validation
- Dark premium UI theme with responsive layout

## Project Structure

- `pages/` public and admin pages
- `components/` reusable UI components
- `layouts/` default and admin layouts
- `composables/` shared logic
- `server/api/` server routes (public + admin)
- `server/utils/` DB and domain helpers
- `assets/` Tailwind and styles
- `database/` schema and seed SQL scripts

## Local Setup

1. Copy environment file:

```bash
cp .env.example .env
```

2. Install dependencies:

```bash
npm install
```

3. Create database and import schema:

```sql
CREATE DATABASE ruwaida_art CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

```bash
mysql -u root -p ruwaida_art < database/schema.sql
mysql -u root -p ruwaida_art < database/seed.sql
```

4. Start development:

```bash
npm run dev
```

## Production Build Commands

```bash
npm install
npm run build
npm run start
```

## VPS Deployment (Node.js + PM2 + Nginx)

### 1) Prepare server

```bash
sudo apt update
sudo apt install -y nginx mysql-server
sudo npm install -g pm2
```

### 2) Upload project and configure env

```bash
cd /var/www/ruwaida-art
cp .env.example .env
nano .env
```

Important production variables:

```env
ADMIN_PASSWORD=your_strong_password
UPLOAD_DIR=/var/www/ruwaida-art/storage/uploads
```

Create persistent upload directory:

```bash
mkdir -p /var/www/ruwaida-art/storage/uploads/movies
mkdir -p /var/www/ruwaida-art/storage/uploads/events
```

### 3) Install and build

```bash
npm install
npm run build
```

### 4) Run with PM2

```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

### 5) Nginx reverse proxy

Use `deploy/nginx.ruwaida-art.conf` as `/etc/nginx/sites-available/ruwaida-art`:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    client_max_body_size 20M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
    }
}
```

Enable config:

```bash
sudo ln -s /etc/nginx/sites-available/ruwaida-art /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## API Overview

- Public:
  - `GET /api/public/home`
  - `GET /api/public/movies`
  - `GET /api/public/events`
  - `GET /api/public/settings`
- Admin:
  - `/api/admin/movies`
  - `/api/admin/showtimes`
  - `/api/admin/events`
  - `/api/admin/settings`

## Notes

- No hardcoded backend URLs are required (Nuxt server routes).
- App is ready for Node process mode on VPS.
- Uploaded media is stored in `UPLOAD_DIR`, so it remains available after rebuilds and PM2 restarts.
- Admin access is protected by `ADMIN_PASSWORD` via `/admin/login`.
