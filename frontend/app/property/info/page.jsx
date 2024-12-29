"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { IoSend } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import Make from "@/components/Make";

const Home = () => {
  const property = useSelector((state) => state.property.property);
  const user = useSelector((state) => state.user.user);
  const dummyProperty = {
    Property_id: property?.Property_id,
    Property_title: property?.Property_title,
    Description: property?.Description,
    location: property?.location,
    price: property?.price,
    size: property?.size,
    type: property?.type,
    posting_date: property?.posting_date,
    seller_id: property?.seller_id,
  };
  console.log(dummyProperty);
  const [modalView, setModalView] = useState(""); // State to manage modal view
  const [showModal, setShowModal] = useState(false); // State to toggle modal
  const router = useRouter();
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [userRating, setUserRating] = useState(0);
  function formatTimestampTo12Hour(timestamp) {
    const date = new Date(timestamp);

    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    const options = { year: "numeric", month: "short", day: "numeric" };
    const dateString = date.toLocaleDateString("en-US", options);
    const timeString = date.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return `${dateString}, ${timeString}`;
  }

  useEffect(() => {
    const fetchRatingsAndComments = async () => {
      if (dummyProperty?.Property_id) {
        try {
          // Fetch ratings
          const ratingsResponse = await fetch(
            "http://localhost:5000/api/next_aura/ratings/get",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ property_id: dummyProperty.Property_id }),
            }
          );
          if (ratingsResponse.ok) {
            const ratingsData = await ratingsResponse.json();
            setRatings(ratingsData.ratings || []);
            setAverageRating(
              Math.round(parseFloat(ratingsData.averageRating)) || 0
            );
          } else {
            console.error("Failed to fetch ratings");
          }

          const commentsResponse = await fetch(
            "http://localhost:5000/api/next_aura/messages/property",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ property_id: dummyProperty.Property_id }),
            }
          );

          if (commentsResponse.ok) {
            const commentsData = await commentsResponse.json();
            setComments(commentsData.messages || []);
          } else {
            console.error("Failed to fetch comments");
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchRatingsAndComments();
  }, [dummyProperty?.Property_id]);

  const handleAddRating = async (rating) => {
    if (!user) {
      alert("You need to log in to add a rating!");
      return;
    }

    const ratingData = {
      user_id: user.user_id,
      property_id: dummyProperty.Property_id,
      rating,
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/next_aura/ratings/add",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(ratingData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setRatings([...ratings, data.rating]);
        setAverageRating(rating);
        alert("Rating submitted!");
      } else {
        alert("Rating already exist");
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  const toggleModal = (view) => {
    setModalView(view);
    setShowModal(!showModal);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      alert("Please enter a comment before submitting.");
      return;
    }
    const newCommentData = {
      Sender_id: user.user_id,
      Property_id: dummyProperty.Property_id,
      msg_content: newComment
    };
  
    try {
      const response = await fetch(
        "http://localhost:5000/api/next_aura/messages/add",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newCommentData),
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log("Data:", data);
        setComments([...comments, data.messageDetails]);
        setNewComment("");
        alert("Comment posted!");
      } else {
        console.error("Failed to submit comment");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };
  return (
    <div className="h-[calc(90vh-60px)] bg-gradient-to-r from-[#F8F5F2] to-[#D8D9DA] p-6 flex items-center justify-center">
      <div className="max-w-4xl h-max w-full bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
        <div className="flex h-[600px]">
          <div className="relative w-1/2">
            <img
              src="/house3.jpg"
              alt="House"
              className="w-full h-full object-cover"
            />
            <button className="absolute top-4 right-4 bg-white text-sm px-3 py-1 rounded-full shadow-md">
              Open Map
            </button>
          </div>

          <div className="p-6 w-1/2 flex flex-col">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold">
                ${dummyProperty.price}
              </h1>
              <p className="text-green-600 font-medium">For sale</p>
            </div>
            <p className="text-gray-600 mt-2">{dummyProperty.location}</p>

            <div className="flex flex-wrap space-x-6 mt-4">
              <div className="flex items-center">
                <span className="text-gray-600 font-medium">
                  {dummyProperty.size}
                </span>
                <span className="ml-1 text-gray-400">sqft</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-600 font-medium">
                  {dummyProperty.type}
                </span>
                <span className="ml-1 text-gray-400">type</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-600 font-medium">Posted on:</span>
                <span className="ml-1 text-gray-400">{new Date(dummyProperty.posting_date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-600 font-medium">Title:</span>
                <span className="ml-1 text-gray-400">{dummyProperty.Property_title}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-600 font-medium">Description:</span>
                <span className="ml-1 text-gray-400">{dummyProperty?.Description}</span>
              </div>
            </div>

            <div className="mt-6 bg-gray-50 p-4 rounded-md">
              <div className="flex items-center">
                <span className="text-gray-700 font-medium">
                  Average Rating:
                </span>
                <div className="ml-2 flex">
                  {averageRating > 0 ? (
                    [...Array(5)].map((_, index) => (
                      <span
                        key={index}
                        className={`ml-1 text-xl ${
                          index < averageRating
                            ? "text-yellow-500"
                            : "text-gray-300"
                        }`}
                      >
                        ★
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 ml-2">No rating yet.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h2 className="text-lg font-semibold">Rate this Property</h2>
              <div className="flex items-center">
                {[...Array(5)].map((_, index) => (
                  <span
                    key={index}
                    className={`ml-1 text-2xl cursor-pointer ${
                      index < userRating ? "text-yellow-500" : "text-gray-300"
                    }`}
                    onMouseEnter={() => setUserRating(index + 1)}
                    onMouseLeave={() => setUserRating(0)}
                    onClick={() => {
                      setAverageRating(index + 1);
                      handleAddRating(index + 1);
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-center items-center gap-4 align-centre">
              <button
                className="bg-gray-100 text-gray-700 w-max h-max px-4 py-2 rounded-md hover:bg-gray-200"
                onClick={() => toggleModal("offer")}
              >
                Make an Offer
              </button>
              <button
                className="bg-gray-100 text-gray-700 w-max h-max px-4 py-2 rounded-md hover:bg-gray-200"
                onClick={() => toggleModal("appointment")}
              >
                Book an appointment
              </button>
            </div>
            {/* Modal */}
            {showModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                  {/* Close button */}
                  <button
                    className="absolute top-3 right-3  hover:text-gray-700 transition"
                    onClick={() => setShowModal(false)}
                    aria-label="Close Modal"
                  >
                    <IoMdClose size={24} className="text-[#0F1A29]" />
                  </button>
                  {/* Modal Content */}
                  <Make view={modalView} Property_id={dummyProperty.Property_id} seller_id={dummyProperty.seller_id} />
                </div>
              </div>
            )}
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-4">Comments</h2>
              <div
                className="space-y-4 overflow-y-auto max-h-20"
                style={{ maxHeight: "100px" }}
              >
                {comments.length > 0 ? (
                  comments.map((comment, index) => (
                    <div
                      key={index}
                      className="h-max bg-gray-100 p-3 rounded-md text-gray-700 flex flex-col"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-[14px]">
                          {comment.User_name}
                        </span>{" "}
                        <span className="text-gray-500 text-[9px]">
                          {formatTimestampTo12Hour(comment.timestamp)}
                        </span>
                      </div>
                      <div className="text-[14px]">{comment.msg_content}</div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No comments yet.</p>
                )}
              </div>
              <div className="mt-4 flex items-center gap-4">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="border rounded-l-md px-4 py-2 w-full"
                  placeholder="Add a comment..."
                />
                <IoSend
                  size={30}
                  onClick={handleAddComment}
                  className="text-gray-500 hover:text-[#D9B888] duration-300 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
