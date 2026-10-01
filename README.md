# 🚀 ApiForge

**ApiForge** is a modern, web-based API development and testing platform inspired by tools like Postman.

It allows developers to create, send, test, save, organize, and monitor HTTP API requests directly from the browser.

---

## ✨ Features

* 🔐 User authentication
* 👥 Workspace management
* 📁 API collections
* 🔗 HTTP request builder
* GET, POST, PUT, PATCH, DELETE support
* 📝 Query parameters
* 📋 Request headers
* 📦 JSON request body
* 🔑 API key and Bearer authentication
* 📊 Response status and response time
* 🧾 JSON response viewer
* 🕘 Request history
* 🌍 Environment variables
* 📚 API documentation
* 🌙 Dark mode
* 📈 API usage analytics
* 🔒 Secure API request handling

---

## 🏗️ Architecture

```text
                    ┌──────────────────────┐
                    │      ApiForge        │
                    │    Web Application   │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    React + Vite      │
                    │      Frontend        │
                    └──────────┬───────────┘
                               │
                         REST / JSON
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Django REST API    │
                    │       Backend        │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │     PostgreSQL       │
                    │       Database       │
                    └──────────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend

* React
* Vite
* JavaScript
* HTML5
* CSS3

### Backend

* Python
* Django
* Django REST Framework
* JWT Authentication

### Database

* PostgreSQL

### API & Development Tools

* REST API
* OpenAPI
* Postman
* Git
* GitHub

---

## 📂 Project Structure

```text
ApiForge/
│
├── backend/
│   ├── config/
│   ├── accounts/
│   ├── workspaces/
│   ├── api_collections/
│   ├── api_requests/
│   ├── environments/
│   ├── history/
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## 🔑 API Request Workflow

```text
Create Request
      ↓
Select HTTP Method
      ↓
Enter API URL
      ↓
Add Headers / Parameters
      ↓
Add Authentication
      ↓
Add Request Body
      ↓
Send Request
      ↓
Receive Response
      ↓
View Status / Headers / JSON
      ↓
Save Request
      ↓
Request History
```

---

## 📁 Collections

Developers can organize API requests into collections.

Example:

```text
📁 Employee API
│
├── GET    /employees
├── GET    /employees/{id}
├── POST   /employees
├── PUT    /employees/{id}
└── DELETE /employees/{id}

📁 Authentication API
│
├── POST /login
├── POST /register
└── POST /refresh
```

---

## 🌍 Environment Variables

ApiForge supports environment-based variables.

Example:

```text
BASE_URL = https://api.example.com
API_KEY  = your_api_key
VERSION  = v1
```

Request:

```text
{{BASE_URL}}/api/{{VERSION}}/users
```

This makes it easier to switch between:

```text
Development
      ↓
Testing
      ↓
Production
```

---

## 🔐 Authentication

ApiForge supports common API authentication methods:

```text
Bearer Token
API Key
Basic Authentication
Custom Headers
```

Example:

```http
Authorization: Bearer YOUR_TOKEN
```

---

## 📊 Response Viewer

After sending a request, ApiForge displays:

```text
Status: 200 OK
Response Time: 124 ms
Content-Type: application/json
```

Example response:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Rahul"
    }
  ]
}
```

---

## 🕘 Request History

Every executed request can be recorded in the user's history.

```text
GET     /api/users       200 OK
POST    /api/users       201 Created
PUT     /api/users/10    200 OK
DELETE  /api/users/10    204 No Content
```

Users can reopen previous requests and execute them again.

---

## 🚀 Backend Setup

```bash
cd backend

python3 -m venv .venv
source .venv/bin/activate

pip install -r requirements.txt
cp -n .env.example .env
```

Set `SECRET_KEY` in `backend/.env` to a random value. For example:

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

The backend uses SQLite by default, so it can run locally without PostgreSQL. To use PostgreSQL, create the database and set `DATABASE_NAME`, `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_HOST`, and `DATABASE_PORT` in `backend/.env`. The shorter `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, and `DB_PORT` names are also accepted.

Then run:

```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

`migrate` creates the built-in Django tables and the ApiForge workspace, collection, request, environment, and history tables from the checked-in migrations.

The API is rooted at `http://127.0.0.1:8000/api/`. Obtain a JWT pair at `/api/auth/token/` and refresh an access token at `/api/auth/token/refresh/`.

Backend:

```text
http://127.0.0.1:8000
```

---

## 💻 Frontend Setup

Open another terminal:

```bash
cd frontend

npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## 🔧 Environment Configuration

Copy `backend/.env.example` to `backend/.env` for local settings. `.env` files are ignored by Git. `DEBUG` should be disabled and a strong `SECRET_KEY` and production `ALLOWED_HOSTS` supplied before deployment.

---

## 🧪 Development

Clone the repository:

```bash
git clone https://github.com/AgileSecDev/apiforge.git
cd apiforge
```

Backend:

```bash
cd backend
source .venv/bin/activate
python manage.py runserver
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

---

## 🛡️ Security

ApiForge is designed with security in mind.

Planned security features include:

* JWT authentication
* Password hashing
* API key protection
* Request validation
* Rate limiting
* CORS configuration
* Environment-based secrets
* Secure API proxying
* SSRF protection
* Permission-based access control

---

## 🗺️ Roadmap

### Phase 1 — Foundation

* [x] Project setup
* [x] React frontend setup
* [x] Django backend setup
* [x] PostgreSQL configuration

### Phase 2 — Authentication

* [ ] Registration
* [ ] Login
* [ ] JWT authentication
* [ ] User profile
* [ ] Logout

### Phase 3 — API Client

* [ ] HTTP methods
* [ ] URL input
* [ ] Headers
* [ ] Parameters
* [ ] Request body
* [ ] Authentication
* [ ] Response viewer

### Phase 4 — Organization

* [ ] Workspaces
* [ ] Collections
* [ ] Folders
* [ ] Saved requests
* [ ] Environment variables

### Phase 5 — Advanced Features

* [ ] Request history
* [ ] API documentation
* [ ] API analytics
* [ ] Rate limiting
* [ ] Import/export
* [ ] Team collaboration

### Phase 6 — Deployment

* [ ] Production configuration
* [ ] PostgreSQL production database
* [ ] Nginx
* [ ] HTTPS
* [ ] Backend deployment
* [ ] Frontend deployment

---

## 📌 Project Status

**Status:** 🚧 In Development

ApiForge is currently under active development.

---

## 🎯 Project Goal

The goal of ApiForge is to provide developers with a clean, modern, browser-based environment for working with REST APIs without requiring a separate desktop API client.

---

## 👨‍💻 Author

**Rahul**

GitHub: [AgileSecDev](https://github.com/AgileSecDev)

---

## 📄 License

This project is currently intended for learning and development purposes.

A license can be added when the project is prepared for public distribution.
