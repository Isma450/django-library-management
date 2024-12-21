// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { SignupForm } from "./pages/auth/Signup";
import { SigninForm } from "./pages/auth/Signin";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-primary-600">
        Bienvenue sur la Bibliothèque en Ligne
      </h1>
      <p className="mt-4 text-gray-600">
        Découvrez notre collection de livres exceptionnels
      </p>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div>
        <nav className="bg-white shadow-lg p-4">
          <div className="flex space-x-4">
            <Link
              to="/home"
              className="text-primary-600 hover:text-primary-800"
            >
              Accueil
            </Link>
            <Link
              to="/signup"
              className="text-primary-600 hover:text-primary-800"
            >
              Inscription
            </Link>
            <Link
              to="/signin"
              className="text-primary-600 hover:text-primary-800"
            >
              Connexion
            </Link>
          </div>
        </nav>

        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/signin" element={<SigninForm />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
