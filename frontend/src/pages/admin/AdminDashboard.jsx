// src/pages/admin/AdminDashboard.jsx

import { useState, useEffect } from "react";
import api from "../../services/api"; // <-- Votre instance Axios
import {
  Users,
  BookOpen,
  Calendar,
  PlusCircle,
  Edit,
  Trash2,
} from "lucide-react";

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("books");
  const [stats, setStats] = useState({
    users: 0,
    books: 0,
    authors: 0,
    reservations: 0,
  });

  // États pour chaque type de données
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [users, setUsers] = useState([]);
  const [reservations, setReservations] = useState([]);

  // Récupération des statistiques et des données lors du montage et au changement d'onglet
  useEffect(() => {
    fetchStats();
    fetchData(activeTab);
  }, [activeTab]);

  // Récupère le total de chaque ressource (statistiques)
  const fetchStats = async () => {
    try {
      const [usersRes, booksRes, authorsRes, reservationsRes] =
        await Promise.all([
          api.get("/users/"),
          api.get("/titles/"),
          api.get("/authors/"),
          api.get("/reservations/"),
        ]);

      setStats({
        users: usersRes.data.length,
        books: booksRes.data.length,
        authors: authorsRes.data.length,
        reservations: reservationsRes.data.length,
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques :", error);
    }
  };

  // Récupère la liste correspondant à l'onglet actif
  const fetchData = async (tab) => {
    try {
      let response;
      switch (tab) {
        case "books":
          response = await api.get("/titles/");
          setBooks(response.data);
          break;
        case "authors":
          response = await api.get("/authors/");
          setAuthors(response.data);
          break;
        case "publishers":
          response = await api.get("/publishers/");
          setPublishers(response.data);
          break;
        case "users":
          response = await api.get("/users/");
          setUsers(response.data);
          break;
        case "reservations":
          response = await api.get("/reservations/");
          setReservations(response.data);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Erreur lors de la récupération des ${tab} :`, error);
    }
  };

  // Suppression d'un élément (DELETE)
  const handleDelete = async (id, type) => {
    try {
      await api.delete(`/api/${type}/${id}/`);
      fetchData(activeTab);
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header avec stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Utilisateurs</p>
              <h3 className="text-2xl font-bold">{stats.users}</h3>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Livres</p>
              <h3 className="text-2xl font-bold">{stats.books}</h3>
            </div>
            <BookOpen className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Auteurs</p>
              <h3 className="text-2xl font-bold">{stats.authors}</h3>
            </div>
            <Users className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Réservations</p>
              <h3 className="text-2xl font-bold">{stats.reservations}</h3>
            </div>
            <Calendar className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Navigation des sections */}
      <div className="flex space-x-4 p-4 bg-white shadow mb-4">
        {["books", "authors", "publishers", "users", "reservations"].map(
          (tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-md ${
                activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-100"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          )
        )}
      </div>

      {/* Contenu principal : table CRUD */}
      <div className="p-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center">
              <PlusCircle className="h-5 w-5 mr-2" />
              Add New
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Livres */}
                {activeTab === "books" &&
                  books.map((book) => (
                    <tr key={book.title_id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {book.title_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {book.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button className="text-blue-500 hover:text-blue-700">
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDelete(book.id, "titles")}
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                {/* Auteurs */}
                {activeTab === "authors" &&
                  authors.map((author) => (
                    <tr key={author.au_id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {author.au_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {author.author}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button className="text-blue-500 hover:text-blue-700">
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDelete(author.id, "authors")}
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                {/* Éditeurs */}
                {activeTab === "publishers" &&
                  publishers.map((publisher) => (
                    <tr key={publisher.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {publisher.pubid}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {publisher.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button className="text-blue-500 hover:text-blue-700">
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            className="text-red-500 hover:text-red-700"
                            onClick={() =>
                              handleDelete(publisher.id, "publishers")
                            }
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                {/* Utilisateurs */}
                {activeTab === "users" &&
                  users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{user.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.first_name} {user.last_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button className="text-blue-500 hover:text-blue-700">
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDelete(user.id, "users")}
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                {/* Réservations */}
                {activeTab === "reservations" &&
                  reservations.map((reservation) => (
                    <tr key={reservation.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {reservation.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {reservation.reserved_at}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button className="text-blue-500 hover:text-blue-700">
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            className="text-red-500 hover:text-red-700"
                            onClick={() =>
                              handleDelete(reservation.id, "reservations")
                            }
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
