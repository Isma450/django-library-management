// src/components/ui/BookCard.jsx
import { motion } from "framer-motion";
import { useState } from "react";
import PropTypes from "prop-types";

const formatTitleToImagePath = (title) => {
  const formattedTitle = title.replace(/[^a-zA-Z0-9]/g, "").replace(/\s+/g, "");
  return `/images/${formattedTitle}.jpg`;
};

export const BookCard = ({ book, index, hovered, setHovered }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

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
    </motion.div>
  );
};

BookCard.propTypes = {
  book: PropTypes.shape({
    title: PropTypes.string.isRequired,
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
};