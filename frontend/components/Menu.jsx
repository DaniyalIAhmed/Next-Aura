"use client";
import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { clearUser } from "@/app/store/userSlice";
import Link from "next/link";

const Menu = ({ name, email, isAnimating }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearUser());
  };

  return (
    <div
      className={`w-max h-max text-white absolute right-5 top-12 rounded-md p-4 bg-[#0F1A29] z-10
        transition-all duration-500 transform 
        ${isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
    >
      <h2 className="font-semibold">{name}</h2>
      <p className="text-[12px]">{email}</p>
      <div className="w-full flex flex-col gap-2 py-5">
        <Link href="/post/ad">
          <Button className="w-full bg-[#C5A880] hover:bg-[#e9c896]">
            Post an ad
          </Button>
        </Link>
        <div className=" w-full h-max flex justify-center items-center gap-4">
          <Link href="/myoffers">
            <Button className="w-full bg-[#C5A880] hover:bg-[#e9c896]">
              Offers
            </Button>
          </Link>
          <Link href="/myappointments" className="w-full">
            <Button className="w-full bg-[#C5A880] hover:bg-[#e9c896]">
              Appointments
            </Button>
          </Link>
          <Link href="/myproperties">
            <Button className="w-full bg-[#C5A880] hover:bg-[#e9c896]">
              Properties
            </Button>
          </Link>
        </div>
        <Link href="/login">
          <Button
            onClick={handleLogout}
            className="w-full bg-[#C5A880] hover:bg-[#e9c896]"
          >
            Logout
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Menu;
