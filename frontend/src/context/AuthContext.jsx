import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import PropTypes from "prop-types";

const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  loading: false,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAdmin = () => {
    return user?.email === import.meta.env.VITE_ADMIN_EMAIL;
  };

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    console.log("Token trouvé:", token ? "oui" : "non");

    if (token) {
      try {
        // Vérifier si le token est expiré
        const payload = parseJwt(token);
        const isExpired = Date.now() >= payload.exp * 1000;

        if (isExpired) {
          throw new Error("Token expiré");
        }

        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const userResponse = await api.get("/users/me/");

        setUser({
          id: userResponse.data.id,
          email: userResponse.data.email,
          firstName: userResponse.data.first_name,
          lastName: userResponse.data.last_name,
        });
      } catch (error) {
        console.error("Erreur lors de la vérification du token:", error);
        logout();
      }
    }
    setLoading(false);
  };

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      throw new Error("Token invalide ou expiré : " + e.message);
    }
  };

  const login = async (credentials) => {
    try {
      if (!credentials.email || !credentials.password) {
        throw new Error("Email et mot de passe requis");
      }

      console.log("Tentative de connexion avec:", credentials.email);

      const response = await api.post("/token/", credentials);
      console.log("Réponse du serveur:", response.data);

      const { access } = response.data;

      if (!access) {
        throw new Error("Token non reçu du serveur");
      }

      try {
        const payload = parseJwt(access);
        console.log("Payload décodé complet:", payload);

        localStorage.setItem("token", access);
        api.defaults.headers.common["Authorization"] = `Bearer ${access}`;

        const userResponse = await api.get("/users/me/");
        console.log("Infos utilisateur:", userResponse.data);

        setUser({
          id: payload.user_id,
          email: credentials.email,
        });

        console.log("Utilisateur connecté:", credentials.email);
        return true;
      } catch (parseError) {
        console.error("Erreur complète:", parseError);
        throw new Error(
          "Erreur lors de la récupération des informations utilisateur"
        );
      }
    } catch (error) {
      console.error("Détails complets de l'erreur:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  };

  const isAuthenticated = () => {
    return !!user;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        isAuthenticated,
        isAdmin: checkAdmin(),
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
