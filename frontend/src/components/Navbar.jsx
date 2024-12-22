// src/components/Navbar.jsx
import { useState } from "react";
import { Menu, MenuItem, NavLink } from "./ui/navbar-menu";

function Navbar() {
  const [active, setActive] = useState(null);

  return (
    <div className="fixed top-10 inset-x-0 max-w-2xl mx-auto z-50">
      <Menu setActive={setActive}>
        <div className="flex items-center justify-between w-full">
          <div className="flex space-x-4">
            <NavLink to="/home">Accueil</NavLink>
            <MenuItem setActive={setActive} active={active} item="Catalogue">
              <div className="flex flex-col space-y-4 text-sm">
                <NavLink to="/books">Tous les livres</NavLink>
                <NavLink to="/categories">Catégories</NavLink>
                <NavLink to="/nouveautes">Nouveautés</NavLink>
                <NavLink to="/suggestions">Suggestions</NavLink>
              </div>
            </MenuItem>
            <MenuItem setActive={setActive} active={active} item="Mon Espace">
              <div className="flex flex-col space-y-4 text-sm">
                <NavLink to="/emprunts">Mes emprunts</NavLink>
                <NavLink to="/reservations">Mes réservations</NavLink>
                <NavLink to="/profil">Mon profil</NavLink>
              </div>
            </MenuItem>
            <MenuItem setActive={setActive} active={active} item="Aide">
              <div className="flex flex-col space-y-4 text-sm">
                <NavLink to="/faq">FAQ</NavLink>
                <NavLink to="/contact">Contact</NavLink>
                <NavLink to="/reglement">Règlement</NavLink>
              </div>
            </MenuItem>
          </div>

          {/* Authentification */}
          <div className="flex items-center space-x-4">
            <NavLink
              to="/signin"
              className="text-primary-600 hover:text-primary-700"
            >
              Connexion
            </NavLink>
            <NavLink
              to="/signup"
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
            >
              Inscription
            </NavLink>
          </div>
        </div>
      </Menu>
    </div>
  );
}

export default Navbar;
