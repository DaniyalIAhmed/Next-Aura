"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePathname, useRouter } from "next/navigation";
import { Provider } from "react-redux";
import { store } from "../app/store/store";

const ClientCom = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const shouldHideNavbar =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/post/ad" ||
    pathname === "/make/appointment" ||
    pathname === "/make/offer";

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      if (pathname !== "/" && pathname !== "/register") {
        router.push("/login");
      }
    }
  }, [pathname, router]);

  return (
    <div>
      <Provider store={store}>
        {!shouldHideNavbar && <Navbar />}
        {children}
        {!shouldHideNavbar && isAuthenticated && <Footer />}
      </Provider>
    </div>
  );
};

export default ClientCom;
