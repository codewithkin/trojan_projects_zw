"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ backgroundColor: "#0F1B4D" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-6 max-w-2xl"
      >
        <motion.h1
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="text-5xl font-bold mb-4"
          style={{ color: "#FFC107" }}
        >
          Trojan Projects ZW
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-white/90 mb-8"
        >
          Your project is our mission.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-white/80 space-y-2 mb-12"
        >
          <p>Multi-service engineering provider specializing in:</p>
          <p className="font-medium" style={{ color: "#FFC107" }}>
            Solar • Electrical • CCTV • Water Systems • Welding
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Link href="/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-4 rounded-md font-semibold text-lg shadow-lg"
              style={{ backgroundColor: "#FFC107", color: "#0F1B4D" }}
            >
              Sign In to Continue
            </motion.button>
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-sm text-white/60 mt-8"
        >
          📍 Mutare, Zimbabwe | 📱 +263 77 341 2648
        </motion.p>
      </motion.div>
    </div>
  );
}
