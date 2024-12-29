import React, { useState } from 'react';
import { FaAngleDown } from 'react-icons/fa';

const Dropdown = ({ htype, setHtype }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border-2 h-[40px] border-[#C5A880] rounded-md flex items-center px-3 justify-between cursor-pointer bg-white select-none"
      >
        {htype}
        <FaAngleDown
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </div>
      <div
        className={`absolute w-full bg-white shadow-md left-0 rounded-md z-10 transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-[500px] py-2' : 'max-h-0'
        }`}
      >
        <p className="py-2 px-2 hover:bg-gray-100 cursor-pointer" onClick={()=>{setHtype('Apartment');setIsOpen(!isOpen)}}>Apartment</p>
        <p className="py-2 px-2 hover:bg-gray-100 cursor-pointer" onClick={()=>{setHtype('Villa');setIsOpen(!isOpen)}}>Villa</p>
        <p className="py-2 px-2 hover:bg-gray-100 cursor-pointer" onClick={()=>{setHtype('Home');setIsOpen(!isOpen)}}>Home</p>
      </div>
    </div>
  );
};

export default Dropdown;
