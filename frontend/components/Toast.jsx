"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";

const Toast = ({ msg, closeD, setCloseD }) => {
  useEffect(() => {
    if (!closeD) {
      const timeout = setTimeout(() => {
        setCloseD(true);
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [closeD, setCloseD]);

  return (
    <motion.div
      onClick={() => setCloseD(!closeD)}
      animate={{
        opacity: closeD ? 0 : 1,
        y: closeD ? -400 : 0,
      }}
      transition={{
        duration: 1,
        ease: "easeInOut",
      }}
      style={{
        position: "absolute",
        top: "20px",
        left: "47%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        width: "120px",
        height: "50px",
        borderRadius: "5px",
        backgroundColor: "#f3f4f6",
        opacity: 0,
        gap: "10px",
      }}
    >
      {!closeD && <FaCheckCircle className="text-[18px] text-[#0F1A29]" />}
      <span className="text-[#0F1A29]">{!closeD && msg}</span>
    </motion.div>
  );
};

export default Toast;
