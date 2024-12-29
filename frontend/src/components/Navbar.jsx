import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Menu, MenuItem, NavLink } from "./ui/navbar-menu";
import { UserAvatar } from "./ui/UserAvatar";

function Navbar() {
  const [active, setActive] = useState(null);
  const { user } = useAuth();

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
            {user && (
              <MenuItem setActive={setActive} active={active} item="Mon Espace">
                <div className="flex flex-col space-y-4 text-sm">
                  <NavLink to="/emprunts">Mes emprunts</NavLink>
                  <NavLink to="/reservations">Mes réservations</NavLink>
                </div>
              </MenuItem>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <UserAvatar user={user} />
            ) : (
              <>
                <NavLink to="/signin">Connexion</NavLink>
                <NavLink
                  to="/signup"
                  className="bg-primary-600 text-white px-4 py-2 rounded-full hover:bg-primary-700 transition-colors"
                >
                  Inscription
                </NavLink>
              </>
            )}
          </div>
        </div>
      </Menu>
    </div>
  );
}

export default Navbar;
