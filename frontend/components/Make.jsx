"use client";
import React, { useState } from "react";
import { useSelector } from "react-redux"; // For fetching Redux state

const Make = ({ view, Property_id, seller_id }) => {
  const [formData, setFormData] = useState({
    appointment_date: "",
    time_slot: "",
    Offer_price: "",
    Date: "",
  });
  const buyer_id = useSelector((state) => state.user.user.user_id);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    // Validation for offer (only if it's an offer)
    if (view === "offer") {
      const offerPrice = parseFloat(formData.Offer_price);
      if (isNaN(offerPrice) || offerPrice <= 0) {
        alert("Offer price must be a valid positive number.");
        return;
      }
      // Validate Date for offers
      if (!formData.Date || isNaN(Date.parse(formData.Date))) {
        alert("Please provide a valid offer date.");
        return;
      }
    }

    // Determine URL and Payload based on view type (appointment or offer)
    const url =
      view === "appointment"
        ? "http://localhost:5000/api/next_aura/appointments/add"
        : "http://localhost:5000/api/next_aura/offers/add";

    // Construct payload for appointment (no offer_price)
    const payload =
      view === "appointment"
        ? {
            buyer_id,
            seller_id,
            appointment_date: formData.appointment_date,
            status: "Pending", // default status
            Property_id,
            time_slot: formData.time_slot, // add time_slot for appointments
          }
        : {
            Property_id,
            Buyer_id: buyer_id,
            Seller_id: seller_id,
            Offer_price: parseFloat(formData.Offer_price),
            Status: "Pending",
            Date: formData.Date,
          };

    console.log("Payload:", payload); // Debugging the payload

    try {
      // Send the POST request
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Parse the response as JSON
      const responseData = await response.json();

      if (response.ok) {
        alert("Request submitted successfully!");
        // Reset form data
        setFormData({
          appointment_date: "",
          time_slot: "",
          Offer_price: "",
          Date: "",
        });
      } else {
        console.error("Error response:", responseData);
        alert("Error submitting the form. " + (responseData.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to submit the request.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">
        {view === "appointment" ? "Make an Appointment" : "Create an Offer"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {view === "appointment" ? (
          <>
            <div>
              <label className="block text-gray-700 mb-1">Appointment Date</label>
              <input
                type="date"
                name="appointment_date"
                value={formData.appointment_date}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Time Slot</label>
              <input
                type="text"
                name="time_slot"
                value={formData.time_slot}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                placeholder="e.g. 16:00"
                required
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-gray-700 mb-1">Offer Price</label>
              <input
                type="number"
                name="Offer_price"
                value={formData.Offer_price}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
                min="0"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Offer Date</label>
              <input
                type="date"
                name="Date"
                value={formData.Date}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
          </>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {view === "appointment" ? "Book Appointment" : "Submit Offer"}
        </button>
      </form>
    </div>
  );
};

export default Make;
