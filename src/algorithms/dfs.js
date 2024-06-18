import { getUnvisitedNeighbors } from './helpers';

// Performs DFS algorithm; returns all nodes in the order in which they were visited.
export function dfs(grid, startNode, finishNode) {
  const visitedNodesInOrder = []; // List to keep track of the order in which nodes are visited
  const stack = [startNode]; // Stack for DFS
  startNode.isVisited = true; // Mark the start node as visited

  while (stack.length > 0) {
    const currentNode = stack.pop(); // Pop the top node from the stack
    if (currentNode.isWall) continue; // Skip walls
    visitedNodesInOrder.push(currentNode); // Add the current node to the visited order

    if (currentNode === finishNode) return visitedNodesInOrder; // If we reached the finish node, return the visited nodes

    const unvisitedNeighbors = getUnvisitedNeighbors(currentNode, grid); // Get unvisited neighbors of the current node
    for (const neighbor of unvisitedNeighbors) {
      if (!neighbor.isVisited && !neighbor.isWall) { // Skip visited nodes and walls
        neighbor.isVisited = true; // Mark neighbor as visited
        neighbor.previousNode = currentNode; // Set the previous node (for path reconstruction)
        stack.push(neighbor); // Push the neighbor onto the stack
      }
    }
  }

  return visitedNodesInOrder; // Return all visited nodes in order
}
