import { getUnvisitedNeighbors, getAllNodes } from './helpers';

// Performs Dijkstra's algorithm; returns *all* nodes in the order
// in which they were visited. Also makes nodes point back to their
// previous node, effectively allowing us to compute the shortest path
// by backtracking from the finish node.
export function dijkstra(grid, startNode, finishNode) {
  const visitedNodesInOrder = []; // List to keep track of the order in which nodes are visited
  startNode.distance = 0; // Initialize the start node's distance
  const unvisitedNodes = getAllNodes(grid); // Get all nodes in the grid

  while (!!unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes); // Sort unvisited nodes by distance
    const closestNode = unvisitedNodes.shift(); // Get the closest node

    // If we encounter a wall, we skip it.
    if (closestNode.isWall) continue;

    // If the closest node is at a distance of infinity,
    // we must be trapped and should therefore stop.
    if (closestNode.distance === Infinity) return visitedNodesInOrder;

    closestNode.isVisited = true; // Mark the node as visited
    visitedNodesInOrder.push(closestNode); // Add the node to the visited order

    // If we reached the finish node, return the visited nodes
    if (closestNode === finishNode) return visitedNodesInOrder;

    updateUnvisitedNeighbors(closestNode, grid); // Update the neighbors of the closest node
  }
}

// Sorts the unvisited nodes by distance
function sortNodesByDistance(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

// Updates the unvisited neighbors of the given node
function updateUnvisitedNeighbors(node, grid) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid); // Get the unvisited neighbors
  for (const neighbor of unvisitedNeighbors) {
    neighbor.distance = node.distance + 1; // Update distance
    neighbor.previousNode = node; // Set the previous node
  }
}

// Backtracks from the finishNode to find the shortest path.
// Only works when called *after* the dijkstra method above.
export function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = []; // List to keep track of nodes in the shortest path order
  let currentNode = finishNode; // Start from the finish node
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode); // Add the node to the front of the list
    currentNode = currentNode.previousNode; // Move to the previous node
  }
  return nodesInShortestPathOrder; // Return the nodes in the shortest path order
}