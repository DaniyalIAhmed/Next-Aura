'use client';
import React, { useState, useEffect } from "react";
import PropertyCard from "../../components/Propertycard";
import { useSelector, useDispatch } from "react-redux";
import { setProperty } from "../store/propertyslice";
import { useRouter } from "next/navigation";

const PropertyList = () => {
    const router= useRouter();
    const [properties, setProperties] = useState([]);
    const [searchItem, setSearchItem] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const location = useSelector((state) => state.location);
    const dispatch = useDispatch(); // Initialize Redux dispatch

    useEffect(() => {
        if (location) {
            fetchProperties(location);
        }
    }, [location]);

    const fetchProperties = async (location) => {
        setLoading(true);
        try {
            const response = await fetch(
                `http://localhost:5000/api/next_aura/properties/search?location=${encodeURIComponent(location)}`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch properties");
            }
            const data = await response.json();
            setProperties(data.properties || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        if (searchItem.trim()) {
            fetchProperties(searchItem);
        } else {
            alert("Please enter a location to search.");
        }
    };

    const handlePropertyClick = (property) => {
        // Dispatch the selected property to the Redux store
        dispatch(setProperty(property));
        //console.log(property);
        router.push("/property/info");    
    };

    const getRandomImage = (type) => {
        console.log(type);
        const imagePool = {
            villa: ["villa_1.jpg", "villa_2.jpg", "villa_3.jpg", "villa_4.jpg", "villa_5.jpg"],
            house: ["houses_1.jpg", "houses_2.jpg", "houses_3.jpg", "houses_4.jpg", "houses_5.jpg"],
            apartment: ["appartment_1.jpg", "appartment_2.jpg", "appartment_3.jpg", "appartment_4.jpg", "appartment_5.jpg"]
        };
        const selectedImages = imagePool[type.toLowerCase()] || [];
        console.log(selectedImages);
        return selectedImages.length > 0
            ? selectedImages[Math.floor(Math.random() * selectedImages.length)]
            : "placeholder-image-url";
    };

    return (
        <div className="p-5 bg-gray-100 min-h-screen">
            {/* Search Bar */}
            <div className="flex justify-center mb-6">
                <input
                    type="text"
                    value={searchItem}
                    onChange={(e) => setSearchItem(e.target.value)}
                    placeholder="Search location..."
                    className="border p-2 rounded-lg w-1/2"
                />
                <button
                    onClick={handleSearch}
                    className="ml-2 bg-blue-500 text-white p-2 rounded-lg"
                >
                    Search
                </button>
            </div>

            {/* Properties List */}
            {loading ? (
                <div className="text-center">Loading...</div>
            ) : error ? (
                <div className="text-red-500 text-center">Error: {error}</div>
            ) : properties.length > 0 ? (
                <div className="flex flex-wrap gap-6 justify-center">
                    {properties.map((property) => (
                        <div
                            key={property.Property_id}
                            onClick={() => handlePropertyClick(property)} // Add onClick to each property
                            className="cursor-pointer"
                        >
                            <PropertyCard
                                price={property.price}
                                type={property.type}
                                address={property.location}
                                bedrooms={property.bedrooms || "3 bedrooms"}
                                bathrooms={property.bathrooms || "3 bathrooms"}
                                size={property.size}
                                offer={property.offer || false}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center">No properties found</div>
            )}
        </div>
    );
};

export default PropertyList;
