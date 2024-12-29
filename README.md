# ✨ **Projet Backend - API de Gestion de Bibliothèque** ✨

---

## 💡 **Technologies Backend Utilisées**

Le backend de ce projet utilise les technologies suivantes :

- ⭐ **Python** (3.9+)
- ⭐ **Django** (4.x)
- ⭐ **Django REST Framework** pour créer des APIs RESTful.
- 📊 **PostgreSQL** comme base de données relationnelle.
- 🔄 **Redis** pour la mise en cache et l'amélioration des performances.
- ⛓ **JWT** (JSON Web Token) pour l'authentification via `rest_framework_simplejwt`.
- 🔧 **Gunicorn** pour des serveurs applicatifs prêts pour la production (optionnel).

---

## 🌟 **Fonctionnalités**

### 📖 **Gestion des Livres**
- CRUD pour les livres, auteurs et éditeurs.
- Support des métadonnées détaillées des livres comme le titre, l'ISBN, l'année de publication, la description et les auteurs.

### 🔑 **Gestion des Utilisateurs**
- Enregistrement (`/signup/`) et connexion (`/login/`) avec authentification JWT.
- Accès administrateur pour gérer les utilisateurs et leurs permissions.

### 📂 **Réservations de Livres**
- Les utilisateurs peuvent réserver **jusqu'à 3 livres** simultanément.
- Gestion des réservations : création, annulation et retour de livres.

### 🔄 **Mise en Cache**
- Mise en cache des endpoints fréquemment consultés (ex : liste des livres) via **Redis**.

### ⚠ **Permissions**
- **Accès public** pour consulter les livres, auteurs et éditeurs.
- **Utilisateurs authentifiés** pour gérer leurs propres réservations.
- **Administrateurs** pour la création et la mise à jour des livres, auteurs et éditeurs.

---

## 🔍 **Endpoints de l'API**

### ✅ **Authentification**
| Endpoint                | Méthode | Description                      |
|-------------------------|---------|----------------------------------|
| `/signup/`              | POST    | Enregistrement des utilisateurs  |
| `/login/`               | POST    | Connexion des utilisateurs       |
| `/logout/`              | POST    | Déconnexion des utilisateurs     |
| `/api/user/register/`   | POST    | Création d'un utilisateur admin  |

### 📖 **Livres**
| Endpoint                     | Méthode | Description                      |
|------------------------------|---------|----------------------------------|
| `/books/`                    | GET     | Liste de tous les livres         |
| `/books/{id}/`               | GET     | Détails d'un livre spécifique    |
| `/books/{title_id}/reserver/`| POST    | Réserver un livre                |

### 📚 **Auteurs**
| Endpoint                       | Méthode | Description                      |
|--------------------------------|---------|----------------------------------|
| `/api/v1/authors/`             | GET     | Liste de tous les auteurs        |
| `/authors/{au_id}/livres/`     | GET     | Liste des livres d'un auteur     |

### 💼 **Éditeurs**
| Endpoint                       | Méthode | Description                      |
|--------------------------------|---------|----------------------------------|
| `/api/v1/publishers/`          | GET     | Liste de tous les éditeurs       |
| `/all-publishers/`             | GET     | Liste des éditeurs en cache      |

### 🏋️ **Réservations**
| Endpoint                       | Méthode | Description                      |
|--------------------------------|---------|----------------------------------|
| `/my-reservations/`            | GET     | Liste des réservations de l'utilisateur |
| `/api/v1/reservations/{id}/`   | DELETE  | Annuler une réservation          |
| `/api/v1/reservations/{id}/`   | PATCH   | Marquer un livre comme retourné  |

---

## 🛠 **Installation et Configuration**

### 🔄 Clonez le dépôt :
```bash
git clone https://github.com/votre-utilisateur/bibliotheque-api.git
cd bibliotheque-api
```
🛠️ Créez et activez un environnement virtuel :
```
python -m venv venv
source venv/bin/activate  # Sur Windows : venv\Scripts\activate
```
### ♻️ Installez les dépendances :
```
pip install -r requirements.txt
```
### 🔢 Configurez les variables d'environnement :
Créez un fichier .env à la racine et configurez-le comme suit :
```
DJANGO_SECRET_KEY=your_secret_key
REDIS_URL=redis://localhost:6379/1
```
### 💳 Configurez la base de données :
Mettez à jour DATABASES dans settings.py pour correspondre à votre configuration PostgreSQL.

### ➕ Appliquez les migrations :
```
python manage.py makemigrations
python manage.py migrate
```
### 🎒 Chargez des données d'exemple (optionnel) :
```
python manage.py loaddata library_fixture.json
```
### 🛡️ Lancez le serveur de développement :
```
python manage.py runserver
```
Accédez à l'API ici : http://127.0.0.1:8000/

### 📊 Exécuter les Tests
Pour vérifier que tout fonctionne correctement :
```
python manage.py test
```
### 🛡️ Déploiement
Pour déployer en production, utilisez Gunicorn et un serveur web comme Nginx :

### 🔄 Installez Gunicorn :
```
pip install gunicorn
```
### 🔧 Lancez Gunicorn :
```
gunicorn backend.wsgi:application --bind 0.0.0.0:8000
```
# ✨ Projet Frontend - Système de Gestion de Bibliothèque ✨
## 🖥️ Technologies Utilisées
 - ⚛️ React (18.x) : Pour gérer les composants et l'interface utilisateur.
 - 🚀 Vite : Pour un démarrage rapide et le bundling.
 - 🌀 TailwindCSS (3.x) : Pour le styling rapide.
 - 📦 Axios : Pour les appels API.
 - 🔄 React Router DOM : Pour le routage.
 - 🌟 Lucide Icons : Icônes modernes et élégantes.
 - 🛠️ DaisyUI : Composants pré-stylisés pour une UI efficace.

## ⚙️ Installation du Frontend

1. Clonez le projet :
```
git clone https://github.com/votre-utilisateur/library-management-frontend.git
cd library-management-frontend
```
2. Installez les dépendances :
```
npm install
```
3. Configurez .env :
   
Ajoutez un fichier .env :

```
VITE_API_BASE_URL=http://localhost:8000/api/v1
```
4. Démarrez le serveur de développement :
   
```
npm run dev
```
Accédez au projet ici : http://localhost:5173/

5. Construisez pour la production :
   
```
npm run build
```
## 📂 Structure des Dossiers:

```
📂 src
 ┣ 📂 components
 ┣ 📂 context
 ┣ 📂 layouts
 ┣ 📂 pages
 ┃ ┣ 📂 admin
 ┃ ┣ 📜 Home.jsx
 ┃ ┣ 📜 Reservation.jsx
 ┃ ┣ 📜 NotFound.jsx
 ┣ 📂 services
 ┣ 📂 assets
```
## ✨ Contributeurs
👤 Ismail Bouloukt

## 📃 Licence
Ce projet est sous licence MIT.

Bon codage ! 🚀✨






