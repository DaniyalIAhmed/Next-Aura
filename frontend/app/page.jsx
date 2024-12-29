"use client";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLocation } from "@/app/store/searchSlice";
import { useRouter } from "next/navigation";
import PropertyCarousel from "@/components/PropertyCarousel";

export default function Home() {
  const router = useRouter();
  const [activebutton, setactivebutton] = useState(null);
  const [activestate, setactivestate] = useState(null);
  const [searchItems, setSearchItems] = useState("");
  const [propertyCounts, setPropertyCounts] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPropertyCounts = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/next_aura/properties/get_type",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch property counts");
        }
        const data = await response.json();
        setPropertyCounts(data.counts);
        setProperties(data.properties);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching property counts:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPropertyCounts();
  }, []);

  const handleactivestate = async (state) => {
    setactivestate(state);
    try {
      const response = await fetch(
        "http://localhost:5000/api/next_aura/properties/get_type",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ type: state }), // Sending the selected property type to the server
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch properties for selected type");
      }
      const data = await response.json();
      setProperties(data.properties); // Update properties based on the response for the selected type
    } catch (err) {
      console.error("Error fetching properties:", err);
      setError(err.message);
    }
  };

  const handlebuttonclick = (button) => {
    setactivebutton(button);
  };

  const handleSearch = () => {
    if (searchItems.trim() !== "") {
      dispatch(setLocation(searchItems));
    }
    router.push("/propertyview");
  };

  const getstateclasses = (state) =>
    `px-7 py-2 mr-4 rounded-lg ${
      activestate == state
        ? "bg-black text-white"
        : "bg-[#D8D9DA] text-[#0F1A29] hover:bg-[#C5A880]"
    }`;

  const getbuttonclasses = (button) =>
    `px-7 py-2 mr-2 rounded-lg ${
      activebutton == button
        ? "bg-black text-white"
        : "bg-[#D8D9DA] text-[#0F1A29] hover:bg-[#C5A880]"
    }`;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <main className="flex flex-col justify-center min-h-screen bg-gradient-to-r from-[#F8F5F2] to-[#D8D9DA]">
      <div
        className="flex flex-col items-center w-[100%] min-h-screen bg-gradient-to-r from-[#F8F5F2] to-[#D8D9DA] md:pt-5 lg:pt-32 mb-5"
        style={{
          backgroundImage: "url('/img2.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <h1 className="text-6xl font-bold text-[#C5A880] mt-10 mb-5">
          Find your dream home
        </h1>
        <div className="flex mt-10 mb-3">
          <button
            className={getbuttonclasses("buy")}
            onClick={() => handlebuttonclick("buy")}
          >
            Buy
          </button>
          <button
            className={getbuttonclasses("sale")}
            onClick={() => handlebuttonclick("sale")}
          >
            Sale
          </button>
          <button
            className={getbuttonclasses("rent")}
            onClick={() => handlebuttonclick("rent")}
          >
            Rent
          </button>
        </div>
        <div className="flex border-1 border-[#C5A880] w-full items-center max-w-3xl rounded-lg shadow-lg mt-5">
          <input
            type="text"
            placeholder="Search by location"
            className="flex-1 px-3 py-3 rounded-lg focus:border-[#C5A880] text-[#0F1A29]"
            value={searchItems}
            onChange={(e) => setSearchItems(e.target.value)}
          />
          <button
            className="px-3 py-3 rounded-lg bg-[#C5A880] text-[#0F1A29] ml-1"
            onClick={handleSearch}
          >
            Find out
          </button>
        </div>
      </div>

      <div className="flex w-full bg-gradient-to-r from-[#F8F5F2] to-[#D8D9DA] mt-5 p-2 md:p-5">
        <div className="flex flex-col space-y-4 bg-gradient-to-r from-[#F8F5F2] to-[#D8D9DA] p-4 rounded-lg shadow-lg w-full">
          <h2 className="text-2xl font-bold mb-2">Popular Listings</h2>
          <p className="text-gray-500 text-sm">
            NextAura's most popular watchlists
          </p>

          <div className="flex space-x-2 mb-4">
            <button
              className={getstateclasses("house")}
              onClick={() => handleactivestate("house")}
            >
              House
            </button>
            <button
              className={getstateclasses("apartment")}
              onClick={() => handleactivestate("apartment")}
            >
              Apartment
            </button>
            <button
              className={getstateclasses("villa")}
              onClick={() => handleactivestate("villa")}
            >
              Villa
            </button>
          </div>

          {/* Scrollable Cards Container */}
          <PropertyCarousel properties={properties} />
        </div>
      </div>

      <div className="flex flex-col w-full min-h-screen bg-white justify-center items-center text-white">
        <div className="w-10/12 bg-white text-black p-6 rounded-lg shadow-lg mt-5">
          <h2 className="text-2xl font-bold text-center mb-6">
            How to sell your home in NextAura in the easiest way
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-gray-100 rounded-md shadow-md text-center">
              <img src="estimate.jpg" alt="Estimate" className="mx-auto mb-4" />
              <h3 className="font-semibold">
                We estimate your home and help you prepare to sell it.
              </h3>
            </div>
            <div className="p-4 bg-gray-100 rounded-md shadow-md text-center">
              <img src="price.jpg" alt="Price" className="mx-auto mb-4" />
              <h3 className="font-semibold">
                Find the best price that works for you.
              </h3>
            </div>
            <div className="p-4 bg-gray-100 rounded-md shadow-md text-center">
              <img src="sale.jpg" alt="Sale" className="mx-auto mb-4" />
              <h3 className="font-semibold">
                We take care of the sale from start to finish.
              </h3>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Listing Category</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {propertyCounts.map((property) => (
                <div
                  key={property.type}
                  className="p-4 bg-blue-100 rounded-md shadow-md text-center cursor-pointer"
                >
                  <h4 className="font-semibold">{property.type}</h4>
                  <p>{property.count} listings</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
