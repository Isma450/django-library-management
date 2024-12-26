import PropTypes from "prop-types";
import { useState } from "react";
import { Label } from "../../components/ui/Label";
import { Input } from "../../components/ui/input";
import { cn } from "../../lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { Alert } from "../../components/ui/Alert";
import api from "../../services/api";

export function SignupForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password2: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = "Le prénom est requis";
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = "Le nom est requis";
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else {
      if (formData.password.length < 8) {
        newErrors.password =
          "Le mot de passe doit contenir au moins 8 caractères";
      }
      if (!/\d/.test(formData.password)) {
        newErrors.password =
          "Le mot de passe doit contenir au moins un chiffre";
      }
      if (!/[A-Z]/.test(formData.password)) {
        newErrors.password =
          "Le mot de passe doit contenir au moins une majuscule";
      }
      if (!/[a-z]/.test(formData.password)) {
        newErrors.password =
          "Le mot de passe doit contenir au moins une minuscule";
      }
      if (!/[!@#$%^&*()_+-=[\]{}|;:,.<>?/]/.test(formData.password)) {
        newErrors.password =
          "Le mot de passe doit contenir au moins un caractère spécial";
      }
    }

    if (!formData.password2) {
      newErrors.password2 = "La confirmation du mot de passe est requise";
    } else if (formData.password !== formData.password2) {
      newErrors.password2 = "Les mots de passe ne correspondent pas";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await api.post("/user/register/", formData);

      setAlert({
        show: true,
        message: "Compte créé avec succès ! Redirection...",
        type: "success",
      });

      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Une erreur est survenue";
      setAlert({
        show: true,
        message: errorMessage,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-7rem)] flex items-center justify-center px-4 py-12">
      <Alert
        isVisible={alert.show}
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert((prev) => ({ ...prev, show: false }))}
      />

      <div className="max-w-md w-full mx-auto rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
          Bienvenue à la Bibliothèque en Ligne
        </h2>
        <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
          Créez votre compte pour accéder à notre collection de livres
        </p>
        <form className="my-8" onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
            <LabelInputContainer>
              <Label htmlFor="first_name">Prénom</Label>
              <Input
                id="first_name"
                placeholder="Jean"
                type="text"
                value={formData.first_name}
                onChange={handleChange}
                className={errors.first_name ? "border-red-500" : ""}
              />
              {errors.first_name && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.first_name}
                </span>
              )}
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="last_name">Nom</Label>
              <Input
                id="last_name"
                placeholder="Dupont"
                type="text"
                value={formData.last_name}
                onChange={handleChange}
                className={errors.last_name ? "border-red-500" : ""}
              />
              {errors.last_name && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.last_name}
                </span>
              )}
            </LabelInputContainer>
          </div>

          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Adresse email</Label>
            <Input
              id="email"
              placeholder="jean.dupont@email.com"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <span className="text-red-500 text-xs mt-1">{errors.email}</span>
            )}
          </LabelInputContainer>

          <LabelInputContainer className="mb-4">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && (
              <span className="text-red-500 text-xs mt-1">
                {errors.password}
              </span>
            )}
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="password2">Confirmer le mot de passe</Label>
            <Input
              id="password2"
              placeholder="••••••••"
              type="password"
              value={formData.password2}
              onChange={handleChange}
              className={errors.password2 ? "border-red-500" : ""}
            />
            {errors.password2 && (
              <span className="text-red-500 text-xs mt-1">
                {errors.password2}
              </span>
            )}
          </LabelInputContainer>

          <button
            className={cn(
              "bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]",
              isLoading && "opacity-50 cursor-not-allowed"
            )}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin" />
              </div>
            ) : (
              "Créer mon compte"
            )}
            <BottomGradient />
          </button>
        </form>

        <p className="text-center text-sm text-neutral-600">
          Déjà inscrit ?{" "}
          <Link to="/signin" className="text-primary-600 hover:underline">
            Se connecter
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
