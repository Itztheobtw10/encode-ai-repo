"use client";

import { useState, useEffect, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { performanceData, swarmGraphData } from "./mockData";  // Import the mock data
import dynamic from "next/dynamic";
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';  // Import icons from Heroicons

// Dynamically import ForceGraph2D
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), { 
  ssr: false,
  loading: () => <div className="h-[300px] flex items-center justify-center text-white">Loading graph...</div>
});

export default function Home() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [summarizePrompt, setSummarizePrompt] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  
  // References for scroll targets
  const homeRef = useRef(null);
  const performanceRef = useRef(null);
  const swarmNetworkRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleSummarize = async () => {
    if (!summarizePrompt.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: summarizePrompt }),
      });
      
      const data = await response.json();
      setSummary(data.summary || "Could not generate summary. Please try again.");
    } catch (error) {
      console.error("Error summarizing data:", error);
      setSummary("Error generating summary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Navigation handler function
  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const targetRef = {
      home: homeRef,
      performance: performanceRef,
      "swarm-network": swarmNetworkRef
    }[sectionId];
    
    if (targetRef && targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Growth rate indicator
  const growthRate = "+3.24%";

  return (
    <div className="flex min-h-screen bg-[#241b44]">
      {/* Sidebar - left fixed sidebar */}
      <div className="w-64 min-h-screen bg-[#1a162e] p-6 fixed left-0 top-0 z-10">
        <div className="flex items-center space-x-2 mb-8">
          <span className="text-pink-500 text-2xl">🧠</span>
          <h1 className="text-xl font-bold text-white">RL Swarm<br/>Dashboard</h1>
        </div>
        
        <nav className="space-y-6 mt-12">
          <a onClick={() => scrollToSection("home")} 
             className={`flex items-center text-white hover:text-purple-300 transition-colors cursor-pointer ${activeSection === "home" ? "text-purple-300" : ""}`}>
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
            <span>Home</span>
          </a>
          <a onClick={() => scrollToSection("performance")}
             className={`flex items-center text-white hover:text-purple-300 transition-colors cursor-pointer ${activeSection === "performance" ? "text-purple-300" : ""}`}>
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
            <span>Performance</span>
          </a>
          <a onClick={() => scrollToSection("swarm-network")}
             className={`flex items-center text-white hover:text-purple-300 transition-colors cursor-pointer ${activeSection === "swarm-network" ? "text-purple-300" : ""}`}>
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
            <span>Swarm Network</span>
          </a>
        </nav>
      </div>

      {/* Main content area */}
      <div className="flex-1 pl-64">
        <div className="p-6 grid grid-cols-12 gap-6">
          {/* Top section - Performance Graph */}
          <div ref={homeRef} id="home" className="col-span-12 bg-[#1f1b34] rounded-xl p-4 border-2 border-purple-500">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white">Performance Graph</h2>
              <div className="flex space-x-5">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-400 mr-2"></div>
                  <span className="text-xs text-gray-300">Current Month</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-orange-400 mr-2"></div>
                  <span className="text-xs text-gray-300">Last Month</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="episode" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip contentStyle={{ backgroundColor: "#2a2a4a", borderColor: "#3a3a5a", color: "white" }} />
                <Line type="monotone" dataKey="Node A" stroke="#4eb8fa" strokeWidth={2} dot={{ stroke: "#4eb8fa", strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Node B" stroke="#f3a328" strokeWidth={2} dot={{ stroke: "#f3a328", strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Middle section - Swarm Network Graph */}
          <div ref={swarmNetworkRef} id="swarm-network" className="col-span-8 bg-[#1f1b34] rounded-xl p-4 border-2 border-purple-500 overflow-hidden">
            <h2 className="text-lg font-semibold text-white mb-3">Swarm Network</h2>
            <div className="h-[300px] bg-[#171429] rounded-lg relative">
              <ForceGraph2D
                graphData={swarmGraphData}
                nodeAutoColorBy="group"
                backgroundColor="#171429"
                linkColor={() => 'rgba(255, 255, 255, 0.2)'}
                nodeCanvasObjectMode={() => 'after'}
                nodeCanvasObject={(node, ctx, globalScale) => {
                  if (node.x !== undefined && node.y !== undefined) {
                    const label = `Node ${node.id}`;
                    const fontSize = 12/globalScale;
                    ctx.font = `${fontSize}px Sans-Serif`;
                    ctx.fillStyle = 'white';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(label, node.x, node.y + 8);
                  }
                }}
                onNodeClick={node => setSelectedNode(node)}
                nodeRelSize={5}
                linkWidth={1}
                width={600}
                height={300}
                enableZoomInteraction={false} // Disable zoom
                enablePanInteraction={false}  // Disable panning
                cooldownTicks={100}           // Run the simulation for a set time then stop
                onEngineStop={() => {
                  // Once the simulation stops, fix the nodes in place
                  swarmGraphData.nodes.forEach(node => {
                    node.fx = node.x;
                    node.fy = node.y;
                  });
                }}
              />
            </div>
          </div>

          {/* Right section with growth rate and OpenAI summarizer */}
          <div className="col-span-4 grid grid-rows-2 gap-6">
            {/* Growth rate card */}
            <div className="bg-[#1f1b34] rounded-xl p-4 h-full border-2 border-purple-500">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-white">Growth Rate</h2>
                <div className="bg-purple-700 px-3 py-1 rounded-lg">
                  <span className="text-green-400 text-sm font-semibold">{growthRate}</span>
                </div>
              </div>
              <div className="mt-4">
                <ResponsiveContainer width="100%" height={80}>
                  <LineChart data={performanceData.slice(-10)}>
                    <Line 
                      type="monotone" 
                      dataKey="Node A" 
                      stroke="#2EC4B6" 
                      strokeWidth={2} 
                      dot={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* OpenAI Summarizer */}
            <div className="bg-[#1f1b34] rounded-xl p-4 h-full border-2 border-purple-500">
              <h2 className="text-lg font-semibold text-white mb-3">OpenAI Summariser</h2>
              <textarea 
                className="w-full h-20 p-2 bg-[#171429] text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none mb-2"
                placeholder="Enter data to summarise..." 
                value={summarizePrompt}
                onChange={(e) => setSummarizePrompt(e.target.value)}
              />
              <button 
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors mb-2 w-full"
                onClick={handleSummarize}
                disabled={loading}
              >
                {loading ? "Summarizing..." : "Summarize"}
              </button>
              {summary && (
                <div className="p-2 bg-[#171429] text-white rounded-lg max-h-24 overflow-y-auto">
                  {summary}
                </div>
              )}
            </div>
          </div>

          {/* Bottom section - Node Info Panel with performance section reference */}
          <div ref={performanceRef} id="performance" className="col-span-12 bg-[#1f1b34] rounded-xl p-4 border-2 border-purple-500">
            <h2 className="text-lg font-semibold text-white mb-3">Node Info</h2>
            {selectedNode ? (
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-[#171429] p-3 rounded-lg">
                  <p className="text-gray-400 text-sm">Node ID</p>
                  <p className="text-white font-medium">{selectedNode.id}</p>
                </div>
                <div className="bg-[#171429] p-3 rounded-lg">
                  <p className="text-gray-400 text-sm">Group</p>
                  <p className="text-white font-medium">{selectedNode.group}</p>
                </div>
                <div className="bg-[#171429] p-3 rounded-lg">
                  <p className="text-gray-400 text-sm">Value</p>
                  <p className="text-white font-medium">{selectedNode.val || 'N/A'}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400 p-3 bg-[#171429] rounded-lg">Click a node in the graph to see more details.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}