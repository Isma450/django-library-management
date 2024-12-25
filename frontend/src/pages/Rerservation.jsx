import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../services/api";
import { Alert } from "../components/ui/Alert";

export function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await api.get("/my-reservations/");
      setReservations(response.data.reservations);
    } catch (error) {
      showAlert("Erreur lors du chargement des réservations", "error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(
      () => setAlert({ show: false, message: "", type: "success" }),
      3000
    );
  };

  const handleCancelReservation = async (reservationId) => {
    try {
      setCancellingId(reservationId);
      await api.delete(`/reservations/${reservationId}/`);
      showAlert("La réservation a été annulée avec succès", "success");
      fetchReservations();
    } catch (error) {
      showAlert("Erreur lors de l'annulation de la réservation", "error");
      console.error(error);
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) return <div className="text-center p-8">Chargement...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Alert
        message={alert.message}
        type={alert.type}
        isVisible={alert.show}
        onClose={() => setAlert({ ...alert, show: false })}
      />

      <h1 className="text-2xl font-bold mb-6">Mes Réservations</h1>

      {reservations.length === 0 ? (
        <p className="text-gray-500 text-center">Aucune réservation en cours</p>
      ) : (
        <div className="space-y-4">
          {reservations.map((reservation) => (
            <motion.div
              key={reservation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-4"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{reservation.book.title}</h3>
                  <p className="text-sm text-gray-500">
                    Réservé le:{" "}
                    {new Date(reservation.reserved_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleCancelReservation(reservation.id)}
                  disabled={cancellingId === reservation.id}
                  className={`px-4 py-2 text-sm rounded-md transition-colors ${
                    cancellingId === reservation.id
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "text-red-600 hover:bg-red-50"
                  }`}
                >
                  {cancellingId === reservation.id
                    ? "Annulation..."
                    : "Annuler"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
