import { getUnvisitedNeighbors, getAllNodes } from './helpers';

// Performs A* algorithm; returns all nodes in the order in which they were visited.
export function astar(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  startNode.distance = 0;
  startNode.totalDistance = 0; // Initialize the start node's total distance
  const unvisitedNodes = getAllNodes(grid); // Get all nodes in the grid

  while (unvisitedNodes.length > 0) {
    sortNodesByTotalDistance(unvisitedNodes); // Sort unvisited nodes by total distance
    const closestNode = unvisitedNodes.shift(); // Get the closest node

    if (closestNode.isWall) continue; // Skip walls

    if (closestNode.distance === Infinity) return visitedNodesInOrder; // If the closest node is at a distance of infinity, we're trapped and should stop

    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode); // Mark the node as visited and add it to the order

    if (closestNode === finishNode) return visitedNodesInOrder; // If we reached the finish node, return the visited nodes

    updateUnvisitedNeighbors(closestNode, grid, finishNode); // Update the neighbors of the closest node
  }

  return visitedNodesInOrder; // Return all visited nodes in order
}

// Sorts the unvisited nodes by total distance
function sortNodesByTotalDistance(unvisitedNodes) {
  unvisitedNodes.sort(
    (nodeA, nodeB) => nodeA.totalDistance - nodeB.totalDistance
  );
}

// Updates the unvisited neighbors of the given node
function updateUnvisitedNeighbors(node, grid, finishNode) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid); // Get the unvisited neighbors
  for (const neighbor of unvisitedNeighbors) {
    neighbor.distance = node.distance + 1; // Update distance
    neighbor.totalDistance = neighbor.distance + heuristic(neighbor, finishNode); // Update total distance
    neighbor.previousNode = node; // Set the previous node
  }
}

// Heuristic function to estimate the distance to the finish node (Manhattan distance)
function heuristic(nodeA, nodeB) {
  return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
}
