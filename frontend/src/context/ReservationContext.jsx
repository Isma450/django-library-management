import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import PropTypes from "prop-types";
import { useAuth } from "./AuthContext";

const ReservationContext = createContext();

export const ReservationProvider = ({ children }) => {
  const [userReservations, setUserReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useAuth();

  const fetchUserReservations = async () => {
    if (!user) {
      setUserReservations([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/my-reservations/");
      setUserReservations(response.data.reservations);
    } catch (error) {
      console.error("Erreur de chargement des réservations:", error);
      setError("Impossible de charger vos réservations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserReservations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const canReserveMore = () => {
    return userReservations.length < 3;
  };

  const isBookReserved = (bookId) => {
    return userReservations.some(
      (reservation) => reservation.book.title_id === bookId
    );
  };

  const getRemainingReservations = () => {
    return 3 - userReservations.length;
  };

  const cancelReservation = async (reservationId) => {
    try {
      setLoading(true);
      await api.delete(`/reservations/${reservationId}/`);
      // Après suppression, on recharge
      await fetchUserReservations();
      return true;
    } catch (error) {
      console.error("Erreur d'annulation:", error);
      setError("Impossible d'annuler la réservation");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ReservationContext.Provider
      value={{
        userReservations,
        loading,
        error,
        canReserveMore,
        isBookReserved,
        getRemainingReservations,
        fetchUserReservations,
        cancelReservation,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
};

export const useReservations = () => {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error(
      "useReservations doit être utilisé dans un ReservationProvider"
    );
  }
  return context;
};

ReservationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ReservationProvider;
