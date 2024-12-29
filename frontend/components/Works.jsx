"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaCheck, FaTrash } from "react-icons/fa"; // Import the icons

const Works = ({ view }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const user = useSelector((state) => state.user.user);
  const userId = user.user_id;

  useEffect(() => {
    fetchData();
  }, [view, userId]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const endpoint =
        view === "offers"
          ? "http://localhost:5000/api/next_aura/offers/get"
          : "http://localhost:5000/api/next_aura/appointments/get";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Failed to fetch ${view}`);
      }

      if (view === "offers") {
        // Sort offers by the custom status order
        const sortedOffers = data.offers || [];
        sortedOffers.sort((a, b) => {
          const statusOrder = {
            pending: 1,
            completed: 2,
            rejected: 3,
            available: 4,
          };

          return (
            statusOrder[a.Status.toLowerCase()] -
            statusOrder[b.Status.toLowerCase()]
          );
        });
        setData(sortedOffers);
      } else if (view === "appointments") {
        setData(data.appointments || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOfferStatusChange = async (offerId, status) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/next_aura/offers/update",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            offer_id: offerId,
            status: status,
            seller_id: userId,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        fetchData();
        alert(result.message);
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleOfferDelete = async (offerId, status, s_uid, b_uid) => {
    try {
      let response;
      console.log("Offer Details: ", offerId, " Status: ", status, " Seller: ", s_uid, " Buyer: ", b_uid);
      // If status is "rejected" and the seller (s_uid) is the user, delete the offer
      if ((status.toLowerCase() === "rejected"||status.toLowerCase() === "available" ||status.toLowerCase() === "accepted")  && s_uid === userId) {
        response = await fetch(
          "http://localhost:5000/api/next_aura/offers/delete",
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              offer_id: offerId,
            }),
          }
        );
      }
      // If status is "pending" and the seller (s_uid) is the user, update the status to "rejected"
      else if (status.toLowerCase() === "pending" && s_uid === userId) {
        response = await fetch(
          "http://localhost:5000/api/next_aura/offers/update",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              offer_id: offerId,
              status: "Rejected",
            }),
          }
        );
      }
      // If the buyer (b_uid) is the user, delete the offer
      else if (b_uid === userId) {
        response = await fetch(
          "http://localhost:5000/api/next_aura/offers/delete",
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              offer_id: offerId,
              buyer_id: userId,
            }),
          }
        );
      }

      if (response) {
        const result = await response.json();

        if (response.ok) {
          fetchData(); // Reload data after the action
          alert(result.message);
        } else {
          throw new Error(result.message);
        }
      } else {
        alert("No valid action performed. Please check the status and user.");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="p-6 h-[calc(90vh-60px)]">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        {view === "offers" ? "Offers" : "Appointments"}
      </h2>
      {loading && <p className="text-gray-600">Loading {view}...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && data.length === 0 && (
        <p className="text-gray-600">No {view} found.</p>
      )}
      {!loading && !error && data.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                {view === "offers" ? (
                  <>
                    <th className="px-4 py-2 border border-gray-200 text-left">
                      Property Title
                    </th>
                    <th className="px-4 py-2 border border-gray-200 text-left">
                      Buyer Name
                    </th>
                    <th className="px-4 py-2 border border-gray-200 text-left">
                      Seller Name
                    </th>
                    <th className="px-4 py-2 border border-gray-200 text-left">
                      Offer Price
                    </th>
                    <th className="px-4 py-2 border border-gray-200 text-left">
                      Status
                    </th>
                    <th className="px-4 py-2 border border-gray-200 text-left">
                      Date
                    </th>
                    <th className="px-4 py-2 border border-gray-200 text-left">
                      Actions
                    </th>
                  </>
                ) : (
                  <>
                    <th className="px-4 py-2 border border-gray-200 text-left">
                      Property Title
                    </th>
                    <th className="px-4 py-2 border border-gray-200 text-left">
                      Date
                    </th>
                    <th className="px-4 py-2 border border-gray-200 text-left">
                      Status
                    </th>
                    <th className="px-4 py-2 border border-gray-200 text-left">
                      Buyer
                    </th>
                    <th className="px-4 py-2 border border-gray-200 text-left">
                      Seller
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr
                  key={view === "offers" ? item.Offer_id : item.Appointment_id}
                  className="hover:bg-gray-50"
                >
                  {view === "offers" ? (
                    <>
                      <td className="px-4 py-2 border border-gray-200">
                        {item.Property_title}
                      </td>
                      <td className="px-4 py-2 border border-gray-200">
                        {item.buyer_name || "N/A"}
                      </td>
                      <td className="px-4 py-2 border border-gray-200">
                        {item.seller_name || "N/A"}
                      </td>
                      <td className="px-4 py-2 border border-gray-200">
                        ${item.Offer_price}
                      </td>
                      <td className="px-4 py-2 border border-gray-200">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            item.Status.toLowerCase() === "available"
                              ? "bg-cyan-100 text-cyan-700 capitalize"
                              : item.Status.toLowerCase() === "pending"
                              ? "bg-yellow-100 text-yellow-700 capitalize"
                              : item.Status.toLowerCase() === "completed" ||
                                item.Status.toLowerCase() === "accepted"
                              ? "bg-green-100 text-green-700 capitalize"
                              : "bg-red-100 text-red-700 capitalize"
                          }`}
                        >
                          {item.Status}
                        </span>
                      </td>
                      <td className="px-4 py-2 border border-gray-200">
                        {new Date(item.Date).toLocaleDateString()}
                      </td>
                      {(item.seller_user_id === userId ||
                        item.buyer_user_id === userId) && (
                        <td className="px-4 py-2 border border-gray-200">
                          <div className="flex justify-center items-center gap-5">
                            {item.seller_user_id === userId &&
                              item.buyer_user_id && item.Status.toLowerCase() != "rejected" && item.Status.toLowerCase() != "accepted" && item.Status.toLowerCase() != "completed" && (
                                <FaCheck
                                  onClick={() =>
                                    handleOfferStatusChange(
                                      item.Offer_id,
                                      "Accepted"
                                    )
                                  }
                                  className="text-[#0F1A29] text-[20px] hover:text-green-500 transition-all duration-300 cursor-pointer hover:scale-110"
                                  title="Accept"
                                />
                              )}
                            <FaTrash
                              onClick={() =>
                                handleOfferDelete(
                                  item.Offer_id,
                                  item.Status,
                                  item.seller_user_id,
                                  item.buyer_user_id
                                )
                              }
                              className="text-[#0F1A29] hover:text-red-500 transition-all duration-300 cursor-pointer hover:scale-110"
                              title="Delete Offer"
                            />
                          </div>
                        </td>
                      )}
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-2 border border-gray-200">
                        {item.Property_title}
                      </td>
                      <td className="px-4 py-2 border border-gray-200">
                        {new Date(item.appointment_date).toLocaleString()}
                      </td>
                      <td className="px-4 py-2 border border-gray-200">
                        {item.status}
                      </td>
                      <td className="px-4 py-2 border border-gray-200">
                        {item.buyer_name} ({item.buyer_email})
                      </td>
                      <td className="px-4 py-2 border border-gray-200">
                        {item.seller_name} ({item.seller_email})
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Works;
