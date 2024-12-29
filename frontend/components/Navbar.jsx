"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { CgProfile } from "react-icons/cg";
import Menu from "./Menu";

const Navbar = () => {
  const path = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const user = useSelector((state) => state.user.user);

  const handleLogin = () => {
    router.push("/login");
  };

  const toggleMenu = () => {
    if (isOpen) {
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
        setIsOpen(false);
      }, 500);
    } else {
      setIsOpen(true);
    }
  };

  return (
    <nav className="bg-[#0F1A29] flex justify-between items-center py-2 relative h-[60px] px-8">
      <div className="flex items-center w-full justify-between">
        <div className="text-4xl font-bold text-[#F2F2F2] select-none">
          Next
          <span className="text-2xl text-[#C5A880]">Aura</span>
        </div>

        <div className="hidden md:flex space-x-6 text-[#F8F5F2]">
          <Link href="/" className="hover:text-[#C5A880] ">
            <span className={`${path==='/'?"border-b-2 hover:border-[#C5A880]":"border-none"}`}>Home</span>
          </Link>
          <Link href="/about" className="hover:text-[#C5A880] ">
            <span className={`${path==='/about'?"border-b-2 hover:border-[#C5A880]":"border-none"}`}>About</span>
          </Link>
          <Link href="/services" className="hover:text-[#C5A880] ">
            <span className={`${path==='/services'?"border-b-2 hover:border-[#C5A880]":"border-none"}`}>Services</span>
          </Link>
          <Link href="/contact" className="hover:text-[#C5A880] ">
            <span className={`${path==='/contact'?"border-b-2 hover:border-[#C5A880]":"border-none"}`}>Contact</span>
          </Link>
        </div>

        {user && user.User_name ? (
          <>
            <CgProfile
              size={28}
              className="text-white hover:text-[#C5A880] cursor-pointer"
              onClick={toggleMenu}
            />
            {isOpen && (
              <Menu
                name={user.User_name}
                email={user.Email}
                isAnimating={isAnimating}
              />
            )}
          </>
        ) : (
          <Button
            onClick={handleLogin}
            className="bg-gradient-to-r from-[#D4AF37] to-[#C5A880] text-[#101010] hover:bg-[#F8F5F2] transition-all duration-300 p-4"
          >
            Login
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
