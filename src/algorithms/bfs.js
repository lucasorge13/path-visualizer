import { getUnvisitedNeighbors } from './helpers';

// Performs BFS algorithm; returns all nodes in the order in which they were visited.
export function bfs(grid, startNode, finishNode) {
  const visitedNodesInOrder = []; // List to keep track of the order in which nodes are visited
  const queue = [startNode]; // Queue for BFS
  startNode.isVisited = true; // Mark the start node as visited

  while (queue.length > 0) {
    const currentNode = queue.shift(); // Dequeue the next node
    if (currentNode.isWall) continue; // Skip walls
    visitedNodesInOrder.push(currentNode); // Add the current node to the visited order

    if (currentNode === finishNode) return visitedNodesInOrder; // If we reached the finish node, return the visited nodes

    const unvisitedNeighbors = getUnvisitedNeighbors(currentNode, grid); // Get unvisited neighbors of the current node
    for (const neighbor of unvisitedNeighbors) {
      if (!neighbor.isVisited && !neighbor.isWall) { // Skip visited nodes and walls
        neighbor.isVisited = true; // Mark neighbor as visited
        neighbor.previousNode = currentNode; // Set the previous node (for path reconstruction)
        queue.push(neighbor); // Enqueue the neighbor
      }
    }
  }

  return visitedNodesInOrder; // Return all visited nodes in order
}
