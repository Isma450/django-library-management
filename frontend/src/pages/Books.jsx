// src/pages/Books.jsx
import { useState, useEffect } from "react";
import { BookCard } from "../components/ui/BookCard";
import { Alert } from "../components/ui/Alert";
import { ReservationProvider } from "../context/ReservationContext";
import api from "../services/api";

export function Books() {
  const [books, setBooks] = useState([]);
  const [hovered, setHovered] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const handleAlert = ({ type, message }) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ ...alert, show: false }), 3000);
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get("/books/");
        setBooks(response.data.books);
      } catch (error) {
        console.error("Erreur lors du chargement des livres:", error);
        handleAlert({
          type: "error",
          message: "Erreur lors du chargement des livres",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <ReservationProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Notre Collection
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book, index) => (
              <BookCard
                key={book.title_id}
                book={book}
                index={index}
                hovered={hovered}
                setHovered={setHovered}
                onAlert={handleAlert}
              />
            ))}
          </div>
          <Alert
            isVisible={alert.show}
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert({ ...alert, show: false })}
          />
        </div>
      </div>
    </ReservationProvider>
  );
}
