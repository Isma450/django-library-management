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

# ✨ Frontend Project - Library Management System ✨

## 🖥️ **Technologies Utilisées**
Le frontend de ce projet utilise les technologies suivantes :
- ⚛️ **React (18.x)** : Pour la gestion des composants et de l'interface utilisateur.
- 🚀 **Vite** : Pour le bundling et le démarrage rapide du projet.
- 🌀 **TailwindCSS (3.x)** : Pour le styling rapide et efficace.
- 📦 **Axios** : Pour gérer les appels API.
- 🔄 **React Router DOM** : Pour la gestion du routage.
- 🌟 **Lucide Icons** : Pour des icônes modernes et personnalisables.
- 🛠️ **DaisyUI** : Pour des composants UI pré-stylisés.

---

## 🌟 **Fonctionnalités Principales**
- 🔑 **Authentification** : 
  - Inscription et connexion des utilisateurs.
  - Protection des routes d'administration avec `ProtectedAdminRoute`.

- 📚 **Gestion des livres** :
  - Affichage, ajout, édition et suppression des livres.

- 📖 **Réservations** :
  - Affichage des réservations pour les utilisateurs connectés.

- 🛠 **Administration** :
  - Tableau de bord pour gérer les utilisateurs, livres, éditeurs et auteurs.

---

## ⚙️ **Installation et Configuration**

### 1. **Cloner le projet**
```bash
git clone https://github.com/your-username/library-management-frontend.git
cd library-management-frontend

2. Installer les dépendances
bash
Copier le code
npm install
3. Configurer l'environnement
Créez un fichier .env à la racine avec les configurations nécessaires. Exemple :
env
Copier le code
VITE_API_BASE_URL=http://localhost:8000/api/v1
4. Lancer le projet en mode développement
bash
Copier le code
npm run dev
Accédez au projet sur http://localhost:5173.

5. Construire le projet pour la production
bash
Copier le code
npm run build
Les fichiers optimisés seront disponibles dans le dossier dist/.

📂 Structure des Dossiers
Voici un aperçu de la structure principale du projet :

bash
Copier le code
📂 src
 ┣ 📂 components
 ┃ ┣ 📜 Navbar.jsx              # Barre de navigation
 ┃ ┣ 📜 ProtectedAdminRoute.jsx # Protection des routes admin
 ┣ 📂 context
 ┃ ┣ 📜 AuthContext.jsx         # Gestion de l'authentification
 ┃ ┣ 📜 ReservationContext.jsx  # Contexte des réservations
 ┣ 📂 layouts
 ┃ ┣ 📜 AuthLayout.jsx          # Layout pour les pages d'authentification
 ┃ ┣ 📜 aurora-background.jsx   # Effet visuel de fond
 ┣ 📂 pages
 ┃ ┣ 📂 admin
 ┃ ┃ ┣ 📜 AdminDashboard.jsx    # Tableau de bord d'administration
 ┃ ┃ ┣ 📜 Books.jsx             # Gestion des livres
 ┃ ┣ 📜 Home.jsx                # Page d'accueil
 ┃ ┣ 📜 Reservation.jsx         # Page des réservations
 ┃ ┣ 📜 NotFound.jsx            # Page 404
 ┣ 📂 services
 ┃ ┣ 📜 api.js                  # Configuration Axios
 ┣ 📂 assets
 ┃ ┣ 📂 ui                      # Images et styles
 ┃ ┣ 📂 icons                   # Icônes personnalisées
🔄 Routage
Routes publiques :
Chemin	Composant	Description
/	Home	Page d'accueil
/signup	SignupForm	Page d'inscription
/signin	SigninForm	Page de connexion
/books	Books	Liste des livres
/reservations	Reservations	Liste des réservations
Routes protégées (Admin uniquement) :
Chemin	Composant	Description
/admin	AdminDashboard	Tableau de bord d'administration
🌈 Personnalisation
Le projet utilise TailwindCSS et DaisyUI pour le stylisme. Vous pouvez facilement personnaliser les couleurs et les thèmes dans le fichier tailwind.config.js.

✅ Commandes Importantes
Commande	Description
npm run dev	Démarre le projet en mode développement.
npm run build	Crée une version optimisée pour la production.
npm run preview	Prévisualise la version de production.


## 🔥 **Contributors**
Feel free to contribute to this project! Fork, clone, and submit a PR.

---

## 📢 **License**
This project is licensed under the MIT License.

---

✨ **Happy Coding!** 🌐✨
