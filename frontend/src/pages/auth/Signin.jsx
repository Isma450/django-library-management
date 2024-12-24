import PropTypes from "prop-types";
import { Label } from "../../components/ui/Label";
import { Input } from "../../components/ui/input";
import { cn } from "../../lib/utils";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function SigninForm() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [id]: value,
    }));
    // Réinitialiser l'erreur quand l'utilisateur tape
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validation
    if (!credentials.email || !credentials.password) {
      setError("Veuillez remplir tous les champs");
      setLoading(false);
      return;
    }

    try {
      await login(credentials);
      navigate("/");
    } catch (error) {
      setError(
        error.response?.data?.detail ||
          error.message ||
          "Une erreur est survenue"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-7rem)] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full mx-auto rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
          Connexion à la Bibliothèque
        </h2>
        <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
          Accédez à votre espace personnel
        </p>
        <form className="my-8" onSubmit={handleSubmit}>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Adresse email</Label>
            <Input
              id="email"
              type="email"
              value={credentials.email}
              onChange={handleChange}
              placeholder="jean.dupont@email.com"
              required
              disabled={loading}
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-8">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </LabelInputContainer>

          {error && (
            <div className="mb-4 text-sm text-red-500 text-center">{error}</div>
          )}

          <button
            className={`bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 
            dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white 
            rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]
            ${loading ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"}`}
            type="submit"
            disabled={loading}
          >
            {loading ? "Connexion..." : "Se connecter"}
            <BottomGradient />
          </button>
        </form>
        <p className="text-center text-sm text-neutral-600">
          Pas encore de compte ?{" "}
          <Link to="/signup" className="text-primary-600 hover:underline">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}
const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

LabelInputContainer.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
