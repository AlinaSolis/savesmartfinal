# 💰 SaveSmart — Finanzas Inteligentes con IA

**SaveSmart** es una aplicación web de finanzas personales que usa inteligencia artificial para analizar tus hábitos de ahorro, registrar transacciones, enviarte notificaciones y desbloquear insignias a medida que alcanzas tus metas financieras.

---
## Nota importante para que tengan en cuenta:
## npm i en front
## comando para todos los back php artisan serve --port=800(Solo cambia este numeto va dependiendo del puerto)
## Le las indicaciones antes de comentar 

## ✨ Funcionalidades principales

| Módulo | Descripción |
|---|---|
| 🔐 **Autenticación** | Registro e inicio de sesión con validación en tiempo real |
| 💳 **Transacciones** | Registra ingresos y gastos con categorías personalizadas |
| 🎯 **Metas de ahorro** | Crea metas (viaje, auto, casa…) y sigue tu progreso |
| 🤖 **Análisis IA** | Puntuación de salud financiera generada automáticamente |
| 🔔 **Notificaciones** | Alertas y logros en tiempo real |
| 🏆 **Insignias** | Sistema de logros que se desbloquean al cumplir misiones |
| 📊 **Dashboard** | Resumen visual de balance, ingresos, gastos y movimientos |

---

## 🏗️ Arquitectura

La aplicación usa una arquitectura de **microservicios**. Cada servicio corre de forma independiente:

| Servicio | Carpeta | Puerto | Base de datos |
|---|---|---|---|
| Frontend (React + Vite) | `frontend/` | `5173` | — |
| Auth | `Back-New/savesmart-backend/` | `8000` | `users` |
| Transacciones + Metas | `Backtrans/ms-transacciones/` | `8002` | `transacciones_db` |
| Análisis IA | `analysis-service/` | `8003` | `analysis_db` |
| Notificaciones | `notification-service/` | `8004` | `notification_db` |
| Insignias | `badges/backend-insignias/` | `8009` | `badges_db` |

---

## 📋 Requisitos previos

Antes de instalar asegúrate de tener:

- [XAMPP](https://www.apachefriends.org/) (MySQL corriendo en puerto `3306`)
- [PHP 8.2+](https://www.php.net/)
- [Composer](https://getcomposer.org/)
- [Node.js 18+](https://nodejs.org/) y npm
- Git

---

## 🚀 Instalación paso a paso

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd analisis_notificaciones_savesmart
```

### 2. Crear las bases de datos en MySQL

Abre phpMyAdmin o tu cliente MySQL y crea las siguientes bases de datos:

```sql
CREATE DATABASE users;
CREATE DATABASE transacciones_db;
CREATE DATABASE analysis_db;
CREATE DATABASE notification_db;
CREATE DATABASE badges_db;
```

### 3. Configurar cada microservicio

Entra a cada carpeta, copia el `.env.example` y ejecuta las migraciones:

### .env de analysis-service 
### comando php artisan serve --port=8003
APP_NAME=AnalysisService #
APP_ENV=local
## lo unico que va ha cambiar de cada back es la APP_KEY y APP_URL
APP_KEY=base64:y7+RpgIODy0zrW8eejfWeDWWIXYgeoU7RzbUxP1ORZE=
APP_DEBUG=true
APP_URL=http://127.0.0.1:8003 #

APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US

APP_MAINTENANCE_DRIVER=file
# APP_MAINTENANCE_STORE=database

# PHP_CLI_SERVER_WORKERS=4

BCRYPT_ROUNDS=12

LOG_CHANNEL=stack
LOG_STACK=single
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=analysis_db
DB_USERNAME=root
DB_PASSWORD=

SESSION_DRIVER=file #
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null

BROADCAST_CONNECTION=log
FILESYSTEM_DISK=local
QUEUE_CONNECTION=database

CACHE_STORE=database
# CACHE_PREFIX=

MEMCACHED_HOST=127.0.0.1

REDIS_CLIENT=phpredis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=log
MAIL_SCHEME=null
MAIL_HOST=127.0.0.1
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

VITE_APP_NAME="${APP_NAME}"

GEMINI_API_KEY=AIzaSyDr8GO2SbAwqyG1o4zr4lhojRJUkWfPkDg

este es mi .env Front

#### 🔐 Auth (puerto 8000)
```bash
cd Back-New/savesmart-backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate
```

#### 💳 Transacciones + Metas (puerto 8002)
```bash
cd Backtrans/ms-transacciones
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate
```

#### 🤖 Análisis IA (puerto 8003)
```bash
cd analysis-service
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate
```

#### 🔔 Notificaciones (puerto 8004)
```bash
cd notification-service
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate
```

#### 🏆 Insignias (puerto 8009)
```bash
cd badges/backend-insignias
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate
php artisan db:seed
```

### 4. Configurar el Frontend

```bash
cd frontend
npm install
```

Crea el archivo `.env` en la carpeta `frontend/`:

```env
VITE_AUTH_API=http://127.0.0.1:8000/api
VITE_TRANSACTIONS_API=http://127.0.0.1:8002/api
VITE_ANALYSIS_API=http://127.0.0.1:8003/api
VITE_NOTIFICATION_API=http://127.0.0.1:8004/api
VITE_BADGES_API=http://127.0.0.1:8009/api
```

---

## ▶️ Ejecutar la aplicación

Necesitas **6 terminales abiertas** al mismo tiempo (una por servicio):

**Terminal 1 — Auth**
```bash
cd Back-New/savesmart-backend
php artisan serve --port=8000
```

**Terminal 2 — Transacciones**
```bash
cd Backtrans/ms-transacciones
php artisan serve --port=8002
```

**Terminal 3 — Análisis IA**
```bash
cd analysis-service
php artisan serve --port=8003
```

**Terminal 4 — Notificaciones**
```bash
cd notification-service
php artisan serve --port=8004
```

**Terminal 5 — Insignias**
```bash
cd badges/backend-insignias
php artisan serve --port=8009
```

**Terminal 6 — Frontend**
```bash
cd frontend
npm run dev
```

Luego abre tu navegador en: **http://localhost:5173**

---

## 📁 Estructura del proyecto

```
analisis_notificaciones_savesmart/
├── frontend/                    # React + Vite + TypeScript
│   ├── src/
│   │   ├── pages/               # Dashboard, Login, Register, Análisis…
│   │   ├── components/          # Sidebar, TransactionModal…
│   │   └── services/            # Llamadas a la API
├── Back-New/savesmart-backend/  # Microservicio Auth (Laravel)
├── Backtrans/ms-transacciones/  # Microservicio Transacciones + Metas (Laravel)
├── analysis-service/            # Microservicio Análisis IA (Laravel)
├── notification-service/        # Microservicio Notificaciones (Laravel)
└── badges/backend-insignias/    # Microservicio Insignias (Laravel)
```

---

## 🔑 Cómo usar la aplicación

1. **Regístrate** en `/register` con tu nombre, correo y contraseña
2. **Inicia sesión** en `/login`
3. Desde el **Dashboard** puedes:
   - Ver tu balance, ingresos y gastos del mes
   - Registrar transacciones con el botón **"Registrar gasto/ingreso"**
   - Crear y seguir tus **metas de ahorro** con el botón **"Ver metas"**
4. En **Transacciones** gestiona tus movimientos y categorías personalizadas
5. En **Análisis IA** ve tu puntuación de salud financiera y consejos
6. En **Notificaciones** revisa tus alertas y logros
7. En **Insignias** ve las medallas que has desbloqueado

---

## 🛠️ Tecnologías utilizadas

**Frontend**
- React 18 + TypeScript
- Vite
- Tailwind CSS + Ant Design
- Axios

**Backend**
- Laravel 11 (PHP 8.2)
- MySQL
- Arquitectura de microservicios REST

---

## 👤 Autora

Desarrollado por **Alina  y Manuel **

---

> 💡 *Si tienes algún problema con la instalación, asegúrate de que XAMPP esté corriendo (Apache + MySQL) antes de levantar los microservicios.*
