"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import AnimatedInput from "./AnimatedInput";
import { useRouter } from "next/navigation";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaAngleDown } from "react-icons/fa6";
import Dropdown from "./DropDown";
import Toast from "./Toast";

const AddProperty = () => {
  const user = useSelector((state) => state.user.user);
  const userId = user.user_id;
  const [htype, setHtype] = useState("Apartment");
  const [closeD, setCloseD] = useState(true);

  const [formData, setFormData] = useState({
    Property_title: "",
    Description: "",
    location: "",
    price: "",
    size: "",
    type: htype,
    posting_date: new Date().toISOString().split("T")[0],
    seller_id: userId,
  });

  useEffect(() => {
    if (user && user.user_id) {
      setFormData((prev) => ({
        ...prev,
      }));
    } else {
      console.warn("User or user_id is not available!");
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value || "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/next_aura/properties/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error("Error:", error);
        alert(error.message || "Failed to add property");
        return;
      }

      const data = await response.json();
      setCloseD(false);
      setTimeout(() => {
        setFormData({
          Property_title: "",
          Description: "",
          location: "",
          price: "",
          size: "",
          type: "Apartment",
          posting_date: new Date().toISOString().split("T")[0],
          seller_id: userId,
        });
        router.push("/");
      }, 2500);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while adding the property");
    }
  };
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-[#F8F5F2] to-[#D8D9DA]">
      <div className="w-full xl:max-w-2xl md:max-w-lg bg-white p-6 rounded-2xl  shadow-md md:border-l-8 border-[#C5A880] relative h-max">
        <button
          className="bg-gray-100 text-gray-700 w-max h-max absolute px-4 py-1 rounded-md hover:bg-gray-200 flex justify-between items-center gap-2"
          onClick={handleBack}
        >
          <IoMdArrowRoundBack className="hover:translate-x-[-1rem]" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Add Property
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <AnimatedInput
              name="Property_title"
              type="text"
              value={formData.Property_title}
              onChange={handleChange}
              placeholder="Property Title"
              required
            />
          </div>
          <div>
            <textarea
              name="Description"
              value={formData.Description}
              onChange={handleChange}
              placeholder="Description"
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
            />
          </div>
          <div>
            <AnimatedInput
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              placeholder="City"
              required
            />
          </div>
          <div className="flex space-x-4 w-full">
            <AnimatedInput
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
              className="w-1/2"
              required
            />
            <AnimatedInput
              name="size"
              type="number"
              value={formData.size}
              onChange={handleChange}
              placeholder="Size (sq ft)"
              required
            />
            <Dropdown htype={htype} setHtype={setHtype} />
          </div>
          <button
            type="submit"
            className="bg-gray-100 text-gray-700 w-max h-max mx-auto px-4 py-2 font-semibold rounded-md hover:bg-gray-200"
          >
            Add Property
          </button>
        </form>
      </div>
      <Toast msg="Posted!" closeD={closeD} setCloseD={setCloseD} />
    </div>
  );
};

export default AddProperty;
