"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const PropertyLine = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  const user = useSelector((state) => state.user.user);
  const userId = user?.user_id;

  useEffect(() => {
    const fetchProperties = async () => {
      if (!userId) {
        setError("User ID is missing");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/api/next_aura/properties/get_all/${userId}`
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        setProperties(data.properties);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [userId]);

  const handleDelete = async (propertyId) => {
    setDeleteError(null); // Reset delete error
    try {
      const response = await fetch(
        `http://localhost:5000/api/next_aura/properties/delete/${propertyId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      alert(data.message); // Optional: show a success message

      // Update the state to remove the deleted property
      setProperties((prevProperties) =>
        prevProperties.filter((property) => property.Property_id !== propertyId)
      );
    } catch (err) {
      setDeleteError(err.message);
    }
  };

  if (loading) return <div className="text-center text-gray-600 text-lg">Loading...</div>;
  if (error) return <div className="text-center text-red-500 text-lg">Error: {error}</div>;

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <h1 className="text-center text-3xl font-bold text-gray-800 mb-8">Available Properties</h1>
      {deleteError && (
        <div className="text-center text-red-500 text-lg mb-4">Error: {deleteError}</div>
      )}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-6 md:px-12">
        {properties.map((property) => (
          <div
            key={property.Property_id}
            className="bg-white rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {property.Property_title}
            </h3>
            <p className="text-gray-600 mb-4">{property.Description}</p>
            <p>
              <span className="font-bold text-gray-700">Location:</span> {property.location}
            </p>
            <p>
              <span className="font-bold text-gray-700">Price:</span> ${property.price}
            </p>
            <p>
              <span className="font-bold text-gray-700">Size:</span> {property.size} sq. ft.
            </p>
            <p>
              <span className="font-bold text-gray-700">Type:</span> {property.type}
            </p>
            <p>
              <span className="font-bold text-gray-700">Posted on:</span>{" "}
              {new Date(property.posting_date).toLocaleDateString()}
            </p>
            <button
              onClick={() => handleDelete(property.Property_id)}
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
            >
              Delete Property
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyLine;
