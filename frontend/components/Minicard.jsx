import React from "react";

const Minicard = ({ title, desc, address, price, location }) => {
  return (
    <div className="bg-[#F8F5F2] border-3 border-[#C5A880] rounded-lg shadow p-3 h-max flex-none xl:w-[400px] z-10 m-5 cursor-pointer lg:hover:scale-105 transition-all duration-300">
      <div className="relative">
        <img
          src="house1.webp"
          alt="House 1"
          className="rounded-lg mb-3 h-40 w-full object-cover"
        />
        <span className="absolute top-2 left-2 bg-gradient-to-r from-[#C5A880] to-[#D9B888] text-[#101010] text-xs px-2 py-1 rounded">
          Special Offer
        </span>
      </div>
      <h3 className="text-lg text-[#101010] font-bold">{price}</h3>
      <h2>{title}</h2>
      <p className="text-sm mt-1">{desc}</p>
      <p className="text-xs text-gray-400">
        {address}, {location}
      </p>
      <div className="flex items-center text-gray-600 text-sm mt-3 space-x-3">
        <span>4 bds</span>
        <span>3 Ba</span>
        <span>1209 sqft</span>
      </div>
    </div>
  );
};

export default Minicard;
