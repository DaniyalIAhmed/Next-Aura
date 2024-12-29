'use client';
import React from "react";

const PropertyCard = ({ price, oldPrice, type, address, bedrooms, bathrooms, size, image, offer }) => {
    const handleClick = (e) => {
        
    }
    const rand = () => Math.floor(Math.random() * 3) + 2;
    return (
        <div onClick={handleClick} className="bg-[#F8F5F2] border-3 border-[#C5A880] rounded-lg shadow p-3 flex-none w-80 cursor-pointer">
            <div className="relative">
                <img
                    src={`/house${rand()}.jpg`}
                    alt={type}
                    className="rounded-lg mb-3 h-40 w-full object-cover"
                />
                {offer && (
                    <span className="absolute top-2 left-2 bg-gradient-to-r from-[#C5A880] to-[#D9B888] text-[#101010] text-xs px-2 py-1 rounded">
                        Special Offer
                    </span>
                )}
            </div>
            <h3 className="text-lg text-[#101010] font-bold">{price}</h3>
            <p className="text-gray-500 line-through">{oldPrice}</p>
            <p className="text-sm mt-1">{type}</p>
            <p className="text-xs text-gray-400">{address}</p>
            <div className="flex items-center text-gray-600 text-sm mt-3 space-x-3">
                <span>{bedrooms} bds</span>
                <span>{bathrooms} Ba</span>
                <span>{size}</span>
            </div>
        </div>
    );
};

export default PropertyCard;
