// src/components/ui/BookCard.jsx
import { motion } from "framer-motion";
import { useState } from "react";
import PropTypes from "prop-types";
import { useAuth } from "../../context/AuthContext";
import { useReservations } from "../../context/ReservationContext";
import api from "../../services/api";

// src/components/ui/BookCard.jsx
const formatTitleToImagePath = (title) => {
  if (!title) return "/images/default-book.jpg";

  const formattedTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .replace(/\s+/g, "");

  return `/images/${formattedTitle}.jpg`;
};

export const BookCard = ({ book, index, hovered, setHovered, onAlert }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [reservationLoading, setReservationLoading] = useState(false);
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const { user } = useAuth();
  const bookId = book?.title_id || book?.id;

  const { canReserveMore, userReservations, fetchUserReservations } =
    useReservations();

  const isAlreadyReserved = userReservations?.some(
    (reservation) => reservation.book.title_id === bookId
  );

  const handleReservation = async () => {
    if (!canReserveMore()) {
      onAlert({
        type: "error",
        message: "Vous ne pouvez pas réserver plus de 3 livres à la fois.",
      });
      return;
    }

    setReservationLoading(true);

    try {
      await api.post(`/books/${bookId}/reserver/`);

      setReservationSuccess(true);
      await fetchUserReservations();
      onAlert({
        type: "success",
        message: "Livre réservé avec succès !",
      });
      setTimeout(() => setReservationSuccess(false), 2000);
    } catch (error) {
      if (error.response?.data) {
        const backendData = error.response.data;

        if (backendData.detail) {
          if (backendData.detail.includes("3 active reservations")) {
            onAlert({
              type: "error",
              message:
                "Vous ne pouvez pas réserver plus de 3 livres à la fois.",
            });
          } else if (backendData.detail.includes("already reserved")) {
            onAlert({
              type: "error",
              message: "Ce livre est déjà réservé par vous.",
            });
          } else {
            onAlert({
              type: "error",
              message: backendData.detail,
            });
          }
        } else if (backendData.non_field_errors?.length) {
          const message = backendData.non_field_errors[0];
          if (message.includes("3 active reservations")) {
            onAlert({
              type: "error",
              message:
                "Vous ne pouvez pas réserver plus de 3 livres à la fois.",
            });
          } else if (message.includes("already reserved")) {
            onAlert({
              type: "error",
              message: "Ce livre est déjà réservé par vous.",
            });
          } else {
            onAlert({
              type: "error",
              message,
            });
          }
        } else if (Array.isArray(backendData) && backendData.length > 0) {
          const firstMessage = backendData[0];
          if (firstMessage.includes("already reserved")) {
            onAlert({
              type: "error",
              message: "Ce livre est déjà réservé par vous.",
            });
          } else if (firstMessage.includes("3 active reservations")) {
            onAlert({
              type: "error",
              message:
                "Vous ne pouvez pas réserver plus de 3 livres à la fois.",
            });
          } else {
            onAlert({
              type: "error",
              message: firstMessage,
            });
          }
        } else {
          onAlert({
            type: "error",
            message: "Erreur lors de la réservation (réponse inconnue)",
          });
        }
      } else {
        onAlert({
          type: "error",
          message: "Erreur réseau ou serveur injoignable.",
        });
      }

      console.error("Erreur de réservation:", error);
    } finally {
      setReservationLoading(false);
    }
  };

  // Génère le chemin de l'image basé sur le titre
  const imagePath = formatTitleToImagePath(book.title);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      className={`relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden h-[500px] ${
        hovered !== null && hovered !== index && "blur-sm scale-[0.98]"
      }`}
    >
      {imageLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600" />
        </div>
      )}

      <img
        src={imageError ? "/images/default-book.jpg" : imagePath}
        alt={book.title}
        className={`w-full h-full object-contain transition-opacity duration-300 ${
          imageLoading ? "opacity-0" : "opacity-100"
        }`}
        onError={() => {
          console.log(`Erreur de chargement pour: ${imagePath}`);
          setImageError(true);
          setImageLoading(false);
        }}
        onLoad={() => setImageLoading(false)}
      />

      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 flex flex-col justify-end transition-opacity duration-300 ${
          hovered === index ? "opacity-100" : "opacity-0"
        }`}
      >
        <h3 className="text-xl font-bold text-white mb-2">{book.title}</h3>
        <p className="text-sm text-gray-300 mb-2">
          {book.authors[0]?.author || "Auteur inconnu"}
        </p>
        <p className="text-sm text-gray-400 line-clamp-2">{book.description}</p>
      </div>
      {user && (
        <motion.button
          onClick={handleReservation}
          disabled={
            reservationLoading || reservationSuccess || isAlreadyReserved
          }
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`absolute bottom-4 right-4 px-4 py-2 rounded-full transition-colors ${
            isAlreadyReserved
              ? "bg-gray-500 text-white cursor-not-allowed"
              : reservationSuccess
              ? "bg-green-500 text-white"
              : reservationLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary-600 text-white hover:bg-primary-700"
          }`}
        >
          {isAlreadyReserved ? (
            "Déjà réservé"
          ) : reservationSuccess ? (
            "Réservé ✓"
          ) : reservationLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                {/* ... SVG existant ... */}
              </svg>
              Réservation...
            </span>
          ) : (
            "Réserver"
          )}
        </motion.button>
      )}
    </motion.div>
  );
};

BookCard.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string.isRequired,
    title_id: PropTypes.number,
    description: PropTypes.string,
    authors: PropTypes.arrayOf(
      PropTypes.shape({
        author: PropTypes.string,
      })
    ),
  }).isRequired,
  index: PropTypes.number.isRequired,
  hovered: PropTypes.number,
  setHovered: PropTypes.func.isRequired,
  onAlert: PropTypes.func.isRequired,
};
