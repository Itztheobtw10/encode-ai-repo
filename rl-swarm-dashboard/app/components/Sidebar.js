"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Link from react-scroll with no SSR
const ScrollLink = dynamic(
  () => import('react-scroll').then((mod) => mod.Link),
  { ssr: false }
);

export default function Sidebar() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Return a placeholder while client-side rendering is happening
    return (
      <div className="w-64 h-screen bg-[#1a1a2e] dark:bg-[#13131f] p-6 fixed left-0 top-0">
        <h1 className="text-2xl font-bold text-white">🧠 RL Swarm Dashboard</h1>
        <nav className="flex flex-col space-y-4 mt-8">
          <div className="block text-lg text-white">Home</div>
          <div className="block text-lg text-white">Performance</div>
          <div className="block text-lg text-white">Swarm Network</div>
        </nav>
      </div>
    );
  }

  return (
    <div className="w-64 h-screen bg-[#1a1a2e] dark:bg-[#13131f] p-6 fixed left-0 top-0">
      <h1 className="text-2xl font-bold text-white">🧠 RL Swarm Dashboard</h1>
      <nav className="flex flex-col space-y-4 mt-8">
        <ScrollLink
          to="home-section"
          smooth={true}
          offset={-50}
          duration={500}
          className="block text-lg text-white cursor-pointer hover:text-purple-500 transition-colors"
        >
          Home
        </ScrollLink>
        <ScrollLink
          to="performance-section"
          smooth={true}
          offset={-50}
          duration={500}
          className="block text-lg text-white cursor-pointer hover:text-purple-500 transition-colors"
        >
          Performance
        </ScrollLink>
        <ScrollLink
          to="swarm-section"
          smooth={true}
          offset={-50}
          duration={500}
          className="block text-lg text-white cursor-pointer hover:text-purple-500 transition-colors"
        >
          Swarm Network
        </ScrollLink>
      </nav>
    </div>
  );
}