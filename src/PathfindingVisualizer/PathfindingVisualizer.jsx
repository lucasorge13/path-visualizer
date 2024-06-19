import React, { Component } from 'react';
import Node from './Node/Node';
import { dijkstra, getNodesInShortestPathOrder } from '../algorithms/dijkstra';
import { bfs } from '../algorithms/bfs';
import { dfs } from '../algorithms/dfs';
import { astar } from '../algorithms/astar';

import './PathfindingVisualizer.css';

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      selectedAlgorithm: 'dijkstra', // Default selected algorithm
      isAnimating: false, // Track animation status
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({ grid });
  }

  handleMouseDown(row, col) {
    if (this.state.isAnimating) return; // Prevent changes while animating
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid, mouseIsPressed: true });
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed || this.state.isAnimating) return; // Prevent changes while animating
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  }

  handleMouseUp() {
    if (this.state.isAnimating) return; // Prevent changes while animating
    this.setState({ mouseIsPressed: false });
  }

  resetNodeStates() {
    const { grid } = this.state;
    const newGrid = grid.map(row =>
      row.map(node => {
        const newNode = {
          ...node,
          isVisited: false,
          distance: Infinity,
          totalDistance: Infinity,
          previousNode: null,
        };
        if (newNode.isStart) newNode.distance = 0;
        return newNode;
      })
    );
    this.setState({ grid: newGrid }, () => {
      this.resetNodeClasses();
      this.setStartAndFinishNodes();
    });
  }

  animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        if (!node.isWall) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            'node node-visited';
        }
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        if (!node.isWall) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            'node node-shortest-path';
        }
        if (i === nodesInShortestPathOrder.length - 1) {
          this.setState({ isAnimating: false }); // Animation complete
        }
      }, 50 * i);
    }
  }

  visualizeSelectedAlgorithm() {
    this.setState({ isAnimating: true }, () => {
      this.resetNodeStates(); // Reset node states before running a new algorithm
      const { grid, selectedAlgorithm } = this.state;
      const startNode = grid[START_NODE_ROW][START_NODE_COL];
      const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
      let visitedNodesInOrder;
      switch (selectedAlgorithm) {
        case 'bfs':
          visitedNodesInOrder = bfs(grid, startNode, finishNode);
          break;
        case 'dfs':
          visitedNodesInOrder = dfs(grid, startNode, finishNode);
          break;
        case 'astar':
          visitedNodesInOrder = astar(grid, startNode, finishNode);
          break;
        case 'dijkstra':
        default:
          visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
          break;
      }
      const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
      this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
    });
  }

  resetGrid() {
    if (this.state.isAnimating) return; // Prevent changes while animating
    const grid = getInitialGrid();
    this.setState({ grid }, () => {
      this.resetNodeClasses();
      this.setStartAndFinishNodes();
    });
  }

  clearWalls() {
    if (this.state.isAnimating) return; // Prevent changes while animating
    const { grid } = this.state;
    const newGrid = grid.map(row => {
      return row.map(node => {
        if (node.isWall) {
          return { ...node, isWall: false };
        }
        return node;
      });
    });
    this.setState({ grid: newGrid });
  }

  resetNodeClasses() {
    const { grid } = this.state;
    for (const row of grid) {
      for (const node of row) {
        let extraClass = '';
        if (node.isFinish) extraClass = 'node-finish';
        else if (node.isStart) extraClass = 'node-start';
        else if (node.isWall) extraClass = 'node-wall';
        document.getElementById(`node-${node.row}-${node.col}`).className = `node ${extraClass}`;
      }
    }
  }

  setStartAndFinishNodes() {
    document.getElementById(`node-${START_NODE_ROW}-${START_NODE_COL}`).className = 'node node-start';
    document.getElementById(`node-${FINISH_NODE_ROW}-${FINISH_NODE_COL}`).className = 'node node-finish';
  }

  render() {
    const { grid, mouseIsPressed, selectedAlgorithm, isAnimating } = this.state;

    return (
      <>
        <header className="header">
          <h1>Pathfinding Visualizer</h1>
          <div className="header-buttons">
            <div className="dropdown">
              <button className="dropbtn" disabled={isAnimating}>
                Algorithms <span className="arrow"></span>
              </button>
              <div className="dropdown-content">
                <button onClick={() => this.setState({ selectedAlgorithm: 'dijkstra' })} disabled={isAnimating}>
                  Dijkstra's Algorithm
                </button>
                <button onClick={() => this.setState({ selectedAlgorithm: 'bfs' })} disabled={isAnimating}>
                  BFS
                </button>
                <button onClick={() => this.setState({ selectedAlgorithm: 'dfs' })} disabled={isAnimating}>
                  DFS
                </button>
                <button onClick={() => this.setState({ selectedAlgorithm: 'astar' })} disabled={isAnimating}>
                  A*
                </button>
              </div>
            </div>
            <button className="visualize-btn" onClick={() => this.visualizeSelectedAlgorithm()} disabled={isAnimating}>
              Visualize {selectedAlgorithm.charAt(0).toUpperCase() + selectedAlgorithm.slice(1)}
            </button>
            <button onClick={() => this.resetGrid()} disabled={isAnimating}>
              Reset Grid
            </button>
            <button onClick={() => this.clearWalls()} disabled={isAnimating}>
              Clear Walls
            </button>
          </div>
        </header>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx} className="grid-row">
                {row.map((node, nodeIdx) => {
                  const { row, col, isFinish, isStart, isWall } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    totalDistance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};
