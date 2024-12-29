"use client";
import Link from "next/link";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../app/store/userSlice"; // Import setUser action
import { useRouter } from "next/navigation";
import Toast from "./Toast"; // Import the Toast component

const Account = ({ status }) => {
  const isRegistering = status === "register"; // Check if the current status is 'register'
  const [role, setRole] = useState(""); // Role selection
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [contact, setContact] = useState("");
  const [errors, setErrors] = useState({}); // Store validation errors
  const [closed, setClosed] = useState(true); // Manage toast visibility
  const router = useRouter();
  const dispatch = useDispatch(); // Initialize Redux dispatch

  // Handle form submission
  const handleSubmit = async () => {
    const newErrors = {};
  
    if (isRegistering) {
      if (!username) newErrors.username = "Username is required.";
      if (!email) newErrors.email = "Email is required.";
      if (!password) newErrors.password = "Password is required.";
      if (!role) newErrors.role = "Please select a role.";
    } else {
      if (!email) newErrors.email = "Email is required.";
      if (!password) newErrors.password = "Password is required.";
    }
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5000/api/next_aura/users/${isRegistering ? 'add' : 'login'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          isRegistering
            ? { User_name: username, Email: email, password, Role: role, Contact_info: contact }
            : { Email: email, password }
        ),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setClosed(false);
        dispatch(setUser(data.user));
        setTimeout(() => router.push('/'), 2500);
      } else {
        alert(data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to connect to the server.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#F8F5F2] via-yellow-50 to-[#D8D9DA] flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-center mb-4">
          {isRegistering ? "Register" : "Login"}
        </h2>

        {/* Conditional Fields for Registration */}
        {isRegistering && (
          <>
            <div className="mb-4">
              <label className="block text-gray-700">User Name</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              />
              {errors.username && (
                <p className="text-red-500 text-sm">{errors.username}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Contact No</label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Enter your contact no (optional)"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Role</label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="buyer"
                    checked={role === "buyer"}
                    onChange={() => setRole("buyer")}
                    className="mr-2"
                  />
                  Buyer
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="seller"
                    checked={role === "seller"}
                    onChange={() => setRole("seller")}
                    className="mr-2"
                  />
                  Seller
                </label>
              </div>
              {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
            </div>
          </>
        )}

        {/* Username and Password */}
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Type your email"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Type your password"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>

        {/* Forgot Password (Login only) */}
        {!isRegistering && (
          <div className="text-right mb-4">
            <Link href="/register" className="text-blue-500 hover:underline">
              New? Register
            </Link>
          </div>
        )}

        {/* Login/Register Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-[#F8F5F2] to-[#D8D9DA] text-black py-2 rounded-lg hover:opacity-90 hover:bg-gradient-to-l hover:from-[#F8F5F2] hover:to-[#D8D9DA] transition-all duration-500"
        >
          {isRegistering ? "REGISTER" : "LOGIN"}
        </button>

        {/* Social Login */}
        <div className="text-center mt-6">
          <p className="text-gray-500">
            {isRegistering ? "Or Sign Up Using" : "Or Sign In Using"}
          </p>
          <div className="flex items-center justify-center space-x-4 mt-2">
            <button className="w-10 h-10 bg-blue-600 text-white rounded-full hover:opacity-90 hover:scale-105 transition-all">
              F
            </button>
            <button className="w-10 h-10 bg-blue-400 text-white rounded-full hover:opacity-90 hover:scale-105 transition-all">
              T
            </button>
            <button className="w-10 h-10 bg-red-600 text-white rounded-full hover:opacity-90 hover:scale-105 transition-all">
              G
            </button>
          </div>
        </div>
      </div>

      {/* Display Toast on success */}
      <Toast msg={"Success"} closeD={closed} setCloseD={setClosed} />
    </div>
  );
};

export default Account;
