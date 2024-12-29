"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Modal from "react-modal";

Modal.setAppElement("#root"); // Adjust this selector to your root element

const AppointmentModal = ({ isOpen, onClose }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const userId = useSelector((state) => state.user.user_id);

  useEffect(() => {
    if (isOpen && userId) {
      fetchAppointments();
    }
  }, [isOpen, userId]);

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "http://localhost:5000/api/next_aura/appointments/get",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: userId }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch appointments");
      }

      setAppointments(data.appointments || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Appointments Modal"
      style={{
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          maxWidth: "600px",
        },
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.75)",
        },
      }}
    >
      <h2>Appointments</h2>
      <button onClick={onClose} style={{ float: "right" }}>
        Close
      </button>
      {loading && <p>Loading appointments...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && appointments.length === 0 && <p>No appointments found.</p>}
      {!loading && !error && appointments.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Property Title</th>
              <th>Date</th>
              <th>Status</th>
              <th>Buyer</th>
              <th>Seller</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.Appointment_id}>
                <td>{appointment.Property_title}</td>
                <td>{new Date(appointment.appointment_date).toLocaleString()}</td>
                <td>{appointment.status}</td>
                <td>
                  {appointment.buyer_name} ({appointment.buyer_email})
                </td>
                <td>
                  {appointment.seller_name} ({appointment.seller_email})
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Modal>
  );
};

export default AppointmentModal;
