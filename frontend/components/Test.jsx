"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

const CircleToSquare = () => {
  const [isSquare, setIsSquare] = useState(false);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <motion.div
        onClick={() => setIsSquare(!isSquare)}
        animate={{
          width: isSquare ? "300px" : "24px",
          height: isSquare ? "300px" : "24px",
          borderRadius: isSquare ? "5px" : "50%",
          backgroundColor: isSquare ? "#6F86D8" : "#FF5733",
          x: isSquare ? -140 : 0,
          y: isSquare ? -140 : 0,
        }}
        whileHover={{
          backgroundColor: isSquare?"6F86D8":["#FF5733", "#3B82F6", "#EF4444", "#D946EF"],
          transition: { duration: 0.5, repeat: Infinity, repeatDelay: 0 },
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
        }}
      >
        {isSquare ? "Hello World" : ""}
      </motion.div>
    </div>
  );
};

export default CircleToSquare;