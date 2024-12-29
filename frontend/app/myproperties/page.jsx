"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const PropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.user.user);
  const userId = user.user_id;

  useEffect(() => {
    fetchProperties();
  }, [userId]);

  const fetchProperties = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5000/api/next_aura/properties/get_all/${userId}`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch properties");
      }

      setProperties(data.properties || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle the property deletion
  const deleteProperty = async (propertyId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5000/api/next_aura/properties/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId, // Pass user_id from Redux
          property_id: propertyId, // Pass property_id
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete property");
      }

      // On success, refetch properties
      fetchProperties();
      alert(data.message); // Notify the user of success
    } catch (err) {
      setError(err.message); // Handle any errors
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 h-[calc(90vh-60px)]">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Properties</h2>
      {loading && <p className="text-gray-600">Loading properties...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && properties.length === 0 && (
        <p className="text-gray-600">No properties found.</p>
      )}
      {!loading && !error && properties.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border border-gray-200 text-left">Property ID</th>
                <th className="px-4 py-2 border border-gray-200 text-left">Title</th>
                <th className="px-4 py-2 border border-gray-200 text-left">Description</th>
                <th className="px-4 py-2 border border-gray-200 text-left">Location</th>
                <th className="px-4 py-2 border border-gray-200 text-left">Price</th>
                <th className="px-4 py-2 border border-gray-200 text-left">Size (sq ft)</th>
                <th className="px-4 py-2 border border-gray-200 text-left">Type</th>
                <th className="px-4 py-2 border border-gray-200 text-left">Posting Date</th>
                <th className="px-4 py-2 border border-gray-200 text-left">Status</th>
                <th className="px-4 py-2 border border-gray-200 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <tr key={property.Property_id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border border-gray-200">{property.Property_id}</td>
                  <td className="px-4 py-2 border border-gray-200">{property.Property_title}</td>
                  <td className="px-4 py-2 border border-gray-200">{property.Description}</td>
                  <td className="px-4 py-2 border border-gray-200">{property.location}</td>
                  <td className="px-4 py-2 border border-gray-200">${property.price}</td>
                  <td className="px-4 py-2 border border-gray-200">{property.size}</td>
                  <td className="px-4 py-2 border border-gray-200">{property.type}</td>
                  <td className="px-4 py-2 border border-gray-200">
                    {new Date(property.posting_date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border border-gray-200">
                    <span
                      className={`px-2 py-1 rounded text-xs ${property.Status === "Active"
                          ? "bg-green-100 text-green-700 capitalize"
                          : property.Status === "Inactive"
                          ? "bg-red-100 text-red-700 capitalize"
                          : "bg-yellow-100 text-yellow-700 capitalize"}`}
                    >
                      {property.Status}
                    </span>
                  </td>
                  <td className="px-4 py-2 border border-gray-200">
                    <button
                      className="bg-blue-500 text-white px-4 py-1 rounded"
                      onClick={() => alert("Edit property functionality here")}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-1 rounded ml-2"
                      onClick={() => deleteProperty(property.Property_id)} // Trigger delete
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PropertiesPage;