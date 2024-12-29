import { useState, useEffect } from "react";
import api from "../../services/api";
import {
  Users,
  BookOpen,
  Calendar,
  PlusCircle,
  Edit,
  Trash2,
  Save,
  XCircle,
} from "lucide-react";

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("books");
  const [stats, setStats] = useState({
    users: 0,
    books: 0,
    authors: 0,
    reservations: 0,
  });

  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [users, setUsers] = useState([]);
  const [reservations, setReservations] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    fetchStats();
    fetchData(activeTab);
  }, [activeTab]);

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

  // Charger la liste correspondante à l’onglet actif
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

  const handleDelete = async (id, type) => {
    try {
      await api.delete(`/${type}/${id}/`);
      fetchData(activeTab);
      setAlertMessage("Élément supprimé avec succès !");
      setTimeout(() => setAlertMessage(""), 3000);
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  const handleAddNew = () => {
    setIsEditMode(false);
    setEditItem(null);
    setModalOpen(true);
  };

  const handleEdit = (item) => {
    setIsEditMode(true);
    setEditItem(item);
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await updateItem();
        setAlertMessage("Élément mis à jour avec succès !");
      } else {
        await createItem();
        setAlertMessage("Élément créé avec succès !");
      }
      setModalOpen(false);
      fetchData(activeTab);
      setTimeout(() => setAlertMessage(""), 3000);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde :", error);
    }
  };

  const createItem = async () => {
    switch (activeTab) {
      case "books":
        await api.post("/titles/", {
          title: editItem?.title,
          isbn: editItem?.isbn,
          year_published: editItem?.year_published,
        });
        break;
      case "authors":
        await api.post("/authors/", {
          author: editItem?.author,
          year_born: editItem?.year_born,
        });
        break;
      case "publishers":
        await api.post("/publishers/", {
          name: editItem?.name,
          address: editItem?.address,
        });
        break;
      case "users":
        await api.post("/users/", {
          first_name: editItem?.first_name,
          last_name: editItem?.last_name,
          email: editItem?.email,
          password: editItem?.password || "MotDePasse123",
        });
        break;
      case "reservations":
        await api.post("/reservations/", {
          user: editItem?.user,
          book: editItem?.book,
        });
        break;
      default:
        break;
    }
  };

  const updateItem = async () => {
    let itemId = editItem?.id;
    if (activeTab === "books") itemId = editItem?.title_id;
    if (activeTab === "authors") itemId = editItem?.au_id;
    if (activeTab === "publishers") itemId = editItem?.pubid;

    switch (activeTab) {
      case "books":
        await api.patch(`/titles/${itemId}/`, {
          title: editItem?.title,
          isbn: editItem?.isbn,
          year_published: editItem?.year_published,
        });
        break;
      case "authors":
        await api.patch(`/authors/${itemId}/`, {
          author: editItem?.author,
          year_born: editItem?.year_born,
        });
        break;
      case "publishers":
        await api.patch(`/publishers/${itemId}/`, {
          name: editItem?.name,
          address: editItem?.address,
        });
        break;
      case "users":
        await api.patch(`/users/${itemId}/`, {
          first_name: editItem?.first_name,
          last_name: editItem?.last_name,
          email: editItem?.email,
        });
        break;
      case "reservations":
        await api.patch(`/reservations/${itemId}/`, {
          user: editItem?.user,
          book: editItem?.book,
          returned_at: editItem?.returned_at || null,
        });
        break;
      default:
        break;
    }
  };

  const handleChange = (e) => {
    setEditItem({
      ...editItem,
      [e.target.name]: e.target.value,
    });
  };

  const renderFormFields = () => {
    if (!editItem) {
      return (
        <div className="text-sm text-gray-500">
          Aucun formulaire disponible pour le moment.
        </div>
      );
    }
    switch (activeTab) {
      case "books":
        return (
          <>
            <label className="block mb-2">
              Titre :
              <input
                name="title"
                value={editItem.title || ""}
                onChange={handleChange}
                className="border p-1 w-full"
              />
            </label>
            <label className="block mb-2">
              ISBN :
              <input
                name="isbn"
                value={editItem.isbn || ""}
                onChange={handleChange}
                className="border p-1 w-full"
              />
            </label>
            <label className="block mb-2">
              Année de publication :
              <input
                name="year_published"
                type="number"
                value={editItem.year_published || ""}
                onChange={handleChange}
                className="border p-1 w-full"
              />
            </label>
          </>
        );
      case "authors":
        return (
          <>
            <label className="block mb-2">
              Nom de l&apos;auteur :
              <input
                name="author"
                value={editItem.author || ""}
                onChange={handleChange}
                className="border p-1 w-full"
              />
            </label>
            <label className="block mb-2">
              Année de naissance :
              <input
                name="year_born"
                type="number"
                value={editItem.year_born || ""}
                onChange={handleChange}
                className="border p-1 w-full"
              />
            </label>
          </>
        );
      case "publishers":
        return (
          <>
            <label className="block mb-2">
              Nom :
              <input
                name="name"
                value={editItem.name || ""}
                onChange={handleChange}
                className="border p-1 w-full"
              />
            </label>
            <label className="block mb-2">
              Adresse :
              <input
                name="address"
                value={editItem.address || ""}
                onChange={handleChange}
                className="border p-1 w-full"
              />
            </label>
          </>
        );
      case "users":
        return (
          <>
            <label className="block mb-2">
              Prénom :
              <input
                name="first_name"
                value={editItem.first_name || ""}
                onChange={handleChange}
                className="border p-1 w-full"
              />
            </label>
            <label className="block mb-2">
              Nom :
              <input
                name="last_name"
                value={editItem.last_name || ""}
                onChange={handleChange}
                className="border p-1 w-full"
              />
            </label>
            <label className="block mb-2">
              Email :
              <input
                name="email"
                type="email"
                value={editItem.email || ""}
                onChange={handleChange}
                className="border p-1 w-full"
              />
            </label>
            {/* Si on est en mode création (pas d'édition), on propose de définir un password */}
            {!isEditMode && (
              <label className="block mb-2">
                Mot de passe :
                <input
                  name="password"
                  type="password"
                  value={editItem.password || ""}
                  onChange={handleChange}
                  className="border p-1 w-full"
                />
              </label>
            )}
          </>
        );
      case "reservations":
        return (
          <>
            <label className="block mb-2">
              ID Utilisateur :
              <input
                name="user"
                value={editItem.user || ""}
                onChange={handleChange}
                className="border p-1 w-full"
              />
            </label>
            <label className="block mb-2">
              ID Livre :
              <input
                name="book"
                value={editItem.book || ""}
                onChange={handleChange}
                className="border p-1 w-full"
              />
            </label>
            <label className="block mb-2">
              Date de retour :
              <input
                type="datetime-local"
                name="returned_at"
                value={editItem.returned_at || ""}
                onChange={handleChange}
                className="border p-1 w-full"
              />
            </label>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {alertMessage && (
        <div className="p-4 bg-green-100 text-green-700 text-center">
          {alertMessage}
        </div>
      )}

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

      {/* Navigation des onglets */}
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

      {/* Table principale */}
      <div className="p-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center"
              onClick={handleAddNew}
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Ajouter
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
                          <button
                            className="text-blue-500 hover:text-blue-700"
                            onClick={() => handleEdit(book)}
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            className="text-red-500 hover:text-red-700"
                            onClick={() =>
                              handleDelete(book.title_id, "titles")
                            }
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
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
                          <button
                            className="text-blue-500 hover:text-blue-700"
                            onClick={() => handleEdit(author)}
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            className="text-red-500 hover:text-red-700"
                            onClick={() =>
                              handleDelete(author.au_id, "authors")
                            }
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                {activeTab === "publishers" &&
                  publishers.map((publisher) => (
                    <tr key={publisher.pubid}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {publisher.pubid}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {publisher.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            className="text-blue-500 hover:text-blue-700"
                            onClick={() => handleEdit(publisher)}
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            className="text-red-500 hover:text-red-700"
                            onClick={() =>
                              handleDelete(publisher.pubid, "publishers")
                            }
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                {activeTab === "users" &&
                  users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{user.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.first_name} {user.last_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            className="text-blue-500 hover:text-blue-700"
                            onClick={() => handleEdit(user)}
                          >
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
                {activeTab === "reservations" &&
                  reservations.map((reservation) => (
                    <tr key={reservation.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {reservation.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        Réservé le : {reservation.reserved_at}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            className="text-blue-500 hover:text-blue-700"
                            onClick={() => handleEdit(reservation)}
                          >
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

      {/* Modal pour Add/Edit */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                {isEditMode ? "Modifier" : "Ajouter"}{" "}
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h3>
              <button onClick={() => setModalOpen(false)}>
                <XCircle className="h-6 w-6 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            <form onSubmit={handleSave}>
              {renderFormFields()}
              <div className="flex justify-end mt-4 space-x-2">
                <button
                  type="button"
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
                  onClick={() => setModalOpen(false)}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded-md flex items-center"
                >
                  <Save className="h-5 w-5 mr-2" />
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
