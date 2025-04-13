export const performanceData = [
  { episode: 1, "Node A": 0.2, "Node B": 0.3, "Node C": 0.5 },
  { episode: 2, "Node A": 0.4, "Node B": 0.5, "Node C": 0.7 },
  { episode: 3, "Node A": 0.6, "Node B": 0.65, "Node C": 0.8 },
  { episode: 4, "Node A": 0.7, "Node B": 0.75, "Node C": 0.9 },
  { episode: 5, "Node A": 0.8, "Node B": 0.82, "Node C": 1.0 },
];

export const swarmGraphData = {
  nodes: [
    { id: "Node A", group: "Swarm 1", x: 100, y: 100 },
    { id: "Node B", group: "Swarm 1", x: 300, y: 100 },
    { id: "Node C", group: "Swarm 1", x: 200, y: 200 },
    { id: "Node D", group: "Swarm 2", x: 100, y: 300 },
    { id: "Node E", group: "Swarm 2", x: 300, y: 300 },
  ],
  links: [
    { source: "Node A", target: "Node B" },
    { source: "Node B", target: "Node C" },
    { source: "Node A", target: "Node C" },
    { source: "Node D", target: "Node E" },
  ]
};

