import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { AuroraBackground } from "../layouts/aurora-background";

const Home = () => {
  return (
    <div className="min-h-screen w-full">
      <AuroraBackground className="absolute inset-0">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="relative flex flex-col gap-6 items-center justify-center px-4 text-center"
        >
          <h1 className="text-4xl md:text-7xl font-bold dark:text-white">
            Bibliothèque en Ligne
          </h1>
          <p className="text-xl md:text-2xl font-light dark:text-neutral-200">
            Découvrez notre collection de livres exceptionnels
          </p>
          <Link
            to="/books"
            className="bg-primary-600 text-white rounded-full px-8 py-3 text-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Explorer
          </Link>
        </motion.div>
      </AuroraBackground>
    </div>
  );
};

export default Home;
