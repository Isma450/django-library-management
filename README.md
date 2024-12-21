# ✨ **Backend Project - Library Management API** ✨

---

## 💡 **Backend Technologies Used**

The backend of this project is built with the following technologies:

- ⭐ **Python** (3.9+)
- ⭐ **Django** (4.x)
- ⭐ **Django REST Framework** for creating RESTful APIs.
- 📊 **PostgreSQL** as the relational database.
- 🔄 **Redis** for caching data and improving performance.
- ⛓ **JWT** (JSON Web Token) for authentication using `rest_framework_simplejwt`.
- 🔧 **Gunicorn** for production-ready application servers (optional).

---

## 🌟 **Features**

### 📖 **Book Management**
- CRUD operations for books, authors, and publishers.
- Support for detailed book metadata such as title, ISBN, year, description, and authors.

### 🔑 **User Management**
- User registration (`/signup/`) and login (`/login/`) endpoints with JWT authentication.
- Admin-level access for managing users and permissions.

### 📂 **Book Reservations**
- Users can reserve **up to 3 books** at a time.
- Reservations include creation, cancellation, and marking as returned.

### 🔄 **Caching**
- Implemented using **Redis** to speed up frequently accessed endpoints (e.g., book lists).

### ⚠ **Permissions**
- **Public access** for viewing books, authors, and publishers.
- **Authenticated users** can manage their own reservations.
- **Admin-only access** for creating or updating books, authors, and publishers.

---

## 🔍 **API Endpoints**

### ✅ **Authentication**
| Endpoint       | Method | Description                  |
|----------------|--------|------------------------------|
| `/signup/`     | POST   | User registration            |
| `/login/`      | POST   | User login (returns token)   |
| `/logout/`     | POST   | User logout                  |
| `/api/user/register/` | POST | Admin user creation     |

### 📖 **Books**
| Endpoint         | Method | Description                     |
|------------------|--------|---------------------------------|
| `/books/`        | GET    | List all books                  |
| `/books/{id}/`   | GET    | Get details of a specific book  |
| `/books/{title_id}/reserver/` | POST | Reserve a specific book |

### 📚 **Authors**
| Endpoint                | Method | Description                          |
|-------------------------|--------|--------------------------------------|
| `/api/v1/authors/`      | GET    | List all authors                     |
| `/authors/{au_id}/livres/` | GET | List books by a specific author      |

### 💼 **Publishers**
| Endpoint                | Method | Description                         |
|-------------------------|--------|-------------------------------------|
| `/api/v1/publishers/`   | GET    | List all publishers                 |
| `/all-publishers/`      | GET    | Cached list of publishers           |

### 🏋️ **Reservations**
| Endpoint                | Method | Description                         |
|-------------------------|--------|-------------------------------------|
| `/my-reservations/`     | GET    | List user-specific reservations     |
| `/api/v1/reservations/{id}/` | DELETE | Cancel a reservation          |
| `/api/v1/reservations/{id}/` | PATCH  | Mark a book as returned         |

---

## 🛠 **Setup and Installation**

### 🔄 Clone the repository:
```bash
git clone https://github.com/your-username/bibliotheque-api.git
cd bibliotheque-api
```

### 🛠️ Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### ♻️ Install dependencies:
```bash
pip install -r requirements.txt
```

### 🔢 Set up the environment variables:
Create a `.env` file in the root directory and configure it:
```makefile
DJANGO_SECRET_KEY=your_secret_key
REDIS_URL=redis://localhost:6379/1
```

### 💳 Configure the database:
Update `DATABASES` in `settings.py` to match your PostgreSQL configuration.

### ➕ Apply database migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

### 🎒 Load sample data (optional):
```bash
python manage.py loaddata library_fixture.json
```

### 🛡️ Run the development server:
```bash
python manage.py runserver
```
Access the API at: [http://127.0.0.1:8000/](http://127.0.0.1:8000/)

---

## 📊 **Running the Tests**
To ensure everything works properly, run the Django tests:
```bash
python manage.py test
```

---

## 🛡️ **Deployment**
For production deployment, use **Gunicorn** and a web server like **Nginx**:

### 🔄 Install Gunicorn:
```bash
pip install gunicorn
```

### 🔧 Run Gunicorn:
```bash
gunicorn backend.wsgi:application --bind 0.0.0.0:8000
```

---

## 🔥 **Contributors**
Feel free to contribute to this project! Fork, clone, and submit a PR.

---

## 📢 **License**
This project is licensed under the MIT License.

---

✨ **Happy Coding!** 🌐✨
