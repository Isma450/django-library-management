import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 5, 0] }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="text-8xl mb-8"
          >
            🏗️
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-white mb-4">
            Oups ! Page en construction
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Notre équipe de hamsters 🐹 code jour et nuit pour construire cette
            page...
            <br />
            Ils ont juste fait une pause café ! ☕️
          </p>

          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-primary-600 text-white rounded-full px-8 py-3 text-lg font-medium hover:bg-primary-700 transition-colors"
          >
            <span>Retour à l&apos;accueil</span>
            <span className="text-xl">🏠</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
