const ROWS = 20;
const COLS = 20;

// State Tracking
let startNode = { row: 10, col: 4 };
let endNode = { row: 10, col: 15 };
let grid = [];
let isRunning = false;
let isMousePressed = false;
let drawMode = 'wall'; // can be 'wall', 'weight', 'start', 'end'
let paintType = 'wall'; // what we draw when clicking empty nodes

// UI Elements
const btnDrawWall = document.getElementById('btn-draw-wall');
const btnDrawWeight = document.getElementById('btn-draw-weight');

btnDrawWall.addEventListener('click', () => {
    paintType = 'wall';
    btnDrawWall.style.border = '2px solid white';
    btnDrawWeight.style.border = 'none';
});

btnDrawWeight.addEventListener('click', () => {
    paintType = 'weight';
    btnDrawWeight.style.border = '2px solid white';
    btnDrawWall.style.border = 'none';
});

// DOM Elements
const gridElement = document.getElementById('grid');
const statVisited = document.getElementById('stat-visited');
const statPath = document.getElementById('stat-path');

/**
 * Grid Initialization & Setup
 */
function initializeGrid() {
    gridElement.innerHTML = '';
    gridElement.style.gridTemplateColumns = `repeat(${COLS}, 25px)`;
    gridElement.style.gridTemplateRows = `repeat(${ROWS}, 25px)`;
    
    grid = [];
    
    for (let r = 0; r < ROWS; r++) {
        const rowArray = [];
        for (let c = 0; c < COLS; c++) {
            const nodeElement = document.createElement('div');
            nodeElement.id = `node-${r}-${c}`;
            nodeElement.className = 'node';
            
            if (r === startNode.row && c === startNode.col) {
                nodeElement.classList.add('start');
            } else if (r === endNode.row && c === endNode.col) {
                nodeElement.classList.add('end');
            }
            
            // Mouse Events for drawing
            nodeElement.addEventListener('mousedown', () => handleMouseDown(r, c));
            nodeElement.addEventListener('mouseenter', () => handleMouseEnter(r, c));
            nodeElement.addEventListener('mouseup', () => handleMouseUp());
            
            gridElement.appendChild(nodeElement);
            
            rowArray.push({
                row: r,
                col: c,
                isStart: r === startNode.row && c === startNode.col,
                isEnd: r === endNode.row && c === endNode.col,
                isWall: false,
                isWeight: false,
                isVisited: false,
                previousNode: null,
                distance: Infinity,
                fScore: Infinity,
                gScore: Infinity,
            });
        }
        grid.push(rowArray);
    }
}

/**
 * Event Handlers
 */
function handleMouseDown(r, c) {
    if (isRunning) return;
    isMousePressed = true;
    
    if (r === startNode.row && c === startNode.col) {
        drawMode = 'start';
    } else if (r === endNode.row && c === endNode.col) {
        drawMode = 'end';
    } else {
        const node = grid[r][c];
        if (paintType === 'wall') {
            if (node.isWall) {
                drawMode = 'erase_wall';
                setWall(r, c, false);
            } else {
                drawMode = 'paint_wall';
                setWall(r, c, true);
            }
        } else if (paintType === 'weight') {
            if (node.isWeight) {
                drawMode = 'erase_weight';
                setWeight(r, c, false);
            } else {
                drawMode = 'paint_weight';
                setWeight(r, c, true);
            }
        }
    }
}

function handleMouseEnter(r, c) {
    if (isRunning || !isMousePressed) return;
    
    if (drawMode === 'start') {
        moveStartNode(r, c);
    } else if (drawMode === 'end') {
        moveEndNode(r, c);
    } else if (drawMode === 'paint_wall') {
        setWall(r, c, true);
    } else if (drawMode === 'erase_wall') {
        setWall(r, c, false);
    } else if (drawMode === 'paint_weight') {
        setWeight(r, c, true);
    } else if (drawMode === 'erase_weight') {
        setWeight(r, c, false);
    }
}

function handleMouseUp() {
    isMousePressed = false;
    drawMode = 'wall';
}

// Global mouse up to prevent getting stuck in drawing state
document.body.addEventListener('mouseup', handleMouseUp);
document.body.addEventListener('mouseleave', handleMouseUp);
// Prevent HTML drag and drop API
document.body.addEventListener('dragstart', (e) => e.preventDefault());

function setWall(r, c, isWall) {
    if ((r === startNode.row && c === startNode.col) || 
        (r === endNode.row && c === endNode.col)) return;
        
    const node = grid[r][c];
    if (node.isWall === isWall) return; 
    
    node.isWall = isWall;
    if (isWall) node.isWeight = false; // mutually exclusive
    
    const element = document.getElementById(`node-${r}-${c}`);
    if (isWall) {
        element.classList.add('wall');
        element.classList.remove('weight');
    } else {
        element.classList.remove('wall');
    }
}

function setWeight(r, c, isWeight) {
    if ((r === startNode.row && c === startNode.col) || 
        (r === endNode.row && c === endNode.col)) return;
        
    const node = grid[r][c];
    if (node.isWeight === isWeight) return; 
    
    node.isWeight = isWeight;
    if (isWeight) node.isWall = false; // mutually exclusive
    
    const element = document.getElementById(`node-${r}-${c}`);
    if (isWeight) {
        element.classList.add('weight');
        element.classList.remove('wall');
    } else {
        element.classList.remove('weight');
    }
}

function moveStartNode(r, c) {
    if (grid[r][c].isWall || (r === endNode.row && c === endNode.col)) return;
    
    const oldStartNode = grid[startNode.row][startNode.col];
    oldStartNode.isStart = false;
    document.getElementById(`node-${startNode.row}-${startNode.col}`).classList.remove('start');
    
    startNode = { row: r, col: c };
    grid[r][c].isStart = true;
    document.getElementById(`node-${r}-${c}`).classList.add('start');
}

function moveEndNode(r, c) {
    if (grid[r][c].isWall || (r === startNode.row && c === startNode.col)) return;
    
    const oldEndNode = grid[endNode.row][endNode.col];
    oldEndNode.isEnd = false;
    document.getElementById(`node-${endNode.row}-${endNode.col}`).classList.remove('end');
    
    endNode = { row: r, col: c };
    grid[r][c].isEnd = true;
    document.getElementById(`node-${r}-${c}`).classList.add('end');
}

function clearGrid() {
    if (isRunning) return;
    initializeGrid();
    resetStats();
}

function clearPath() {
    if (isRunning) return;
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const node = grid[r][c];
            node.isVisited = false;
            node.previousNode = null;
            node.distance = Infinity;
            node.fScore = Infinity;
            node.gScore = Infinity;
            
            const el = document.getElementById(`node-${r}-${c}`);
            el.classList.remove('visited', 'path');
        }
    }
    resetStats();
}

function resetStats() {
    statVisited.textContent = '0';
    statPath.textContent = '0';
}

/**
 * Helpers for Pathfinding
 */
function getNeighbors(node) {
    const neighbors = [];
    const { row, col } = node;
    
    // Check up, down, left, right limits
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < ROWS - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < COLS - 1) neighbors.push(grid[row][col + 1]);
    
    // Only return non-walls and unvisited nodes
    return neighbors.filter(n => !n.isVisited && !n.isWall);
}

function reconstructPath(finishNode) {
    const path = [];
    let curr = finishNode;
    while (curr !== null) {
        path.unshift(curr);
        curr = curr.previousNode;
    }
    // Only return the path if we actually originated from start node
    if (path.length > 0 && path[0].isStart) {
        return path;
    }
    return [];
}

/**
 * Animation Engine
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function animateAlgorithm(visitedNodesInOrder, pathNodes) {
    for (let i = 0; i < visitedNodesInOrder.length; i++) {
        const node = visitedNodesInOrder[i];
        
        // Skip animating the start/end visual classes directly 
        if (!node.isStart && !node.isEnd) {
            const el = document.getElementById(`node-${node.row}-${node.col}`);
            el.classList.add('visited');
        }
        
        statVisited.textContent = i + 1;
        
        // Speed control: animate every node with a slight delay
        await sleep(5);
    }
    
    await sleep(200); // small pause before path animation
    
    if (pathNodes && pathNodes.length > 0) {
        for (let i = 0; i < pathNodes.length; i++) {
            const node = pathNodes[i];
            if (!node.isStart && !node.isEnd) {
                const el = document.getElementById(`node-${node.row}-${node.col}`);
                el.classList.remove('visited'); // overwrite styles with path classes
                el.classList.add('path');
            }
            statPath.textContent = i + 1;
            await sleep(25);
        }
    }
    
    isRunning = false;
    toggleButtons(false);
}

function toggleButtons(disabled) {
    document.querySelectorAll('.btn').forEach(btn => btn.disabled = disabled);
}

function runAlgorithm(algoFn) {
    if (isRunning) return;
    clearPath();
    
    isRunning = true;
    toggleButtons(true);
    
    const start = grid[startNode.row][startNode.col];
    const end = grid[endNode.row][endNode.col];
    
    const { visitedNodesInOrder, pathNodes } = algoFn(grid, start, end);
    animateAlgorithm(visitedNodesInOrder, pathNodes);
}

/**
 * Algorithms
 */

// 1. Breadth First Search
function bfs(grid, start, end) {
    const visitedNodesInOrder = [];
    const queue = [start];
    start.isVisited = true;
    
    while (queue.length > 0) {
        const curr = queue.shift();
        visitedNodesInOrder.push(curr);
        
        if (curr === end) break;
        
        const neighbors = getNeighbors(curr);
        for (const n of neighbors) {
            n.isVisited = true;
            n.previousNode = curr;
            queue.push(n);
        }
    }
    return { visitedNodesInOrder, pathNodes: reconstructPath(end) };
}

// 2. Dijkstra's Algorithm
function dijkstra(grid, start, end) {
    const visitedNodesInOrder = [];
    start.distance = 0;
    
    // Gather all nodes
    const unvisitedNodes = [];
    for (const row of grid) {
        for (const node of row) {
            unvisitedNodes.push(node);
        }
    }
    
    while (unvisitedNodes.length > 0) {
        // Sort to get minimum distance node (pseudo-priority queue)
        unvisitedNodes.sort((a, b) => a.distance - b.distance);
        
        const closest = unvisitedNodes.shift();
        
        // If the closest node has infinity distance, we are trapped
        if (closest.distance === Infinity) break;
        
        if (closest.isWall) continue;
        
        closest.isVisited = true;
        visitedNodesInOrder.push(closest);
        
        if (closest === end) break;
        
        const neighbors = getNeighbors(closest);
        for (const n of neighbors) {
            const weight = n.isWeight ? 10 : 1;
            if (closest.distance + weight < n.distance) {
                n.distance = closest.distance + weight;
                n.previousNode = closest;
            }
        }
    }
    return { visitedNodesInOrder, pathNodes: reconstructPath(end) };
}

// 3. A* Search Algorithm
function manhattanDistance(nodeA, nodeB) {
    return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
}

function aStar(grid, start, end) {
    const visitedNodesInOrder = [];
    
    start.gScore = 0;
    start.fScore = manhattanDistance(start, end);
    
    const openSet = [start];
    
    while (openSet.length > 0) {
        // Find node with lowest fScore
        openSet.sort((a, b) => a.fScore - b.fScore);
        const curr = openSet.shift();
        
        if (curr.isWall) continue;
        
        curr.isVisited = true;
        visitedNodesInOrder.push(curr);
        
        if (curr === end) break;
        
        const neighbors = getNeighbors(curr);
        for (const n of neighbors) {
            const weight = n.isWeight ? 10 : 1;
            const tentativeGScore = curr.gScore + weight;
            
            if (tentativeGScore < n.gScore) {
                // This path to neighbor is better than any previous one
                n.previousNode = curr;
                n.gScore = tentativeGScore;
                n.fScore = tentativeGScore + manhattanDistance(n, end);
                
                if (!openSet.includes(n)) {
                    openSet.push(n);
                }
            }
        }
    }
    
    return { visitedNodesInOrder, pathNodes: reconstructPath(end) };
}

/**
 * Event Listeners Binding
 */
document.getElementById('btn-bfs').addEventListener('click', () => runAlgorithm(bfs));
document.getElementById('btn-dijkstra').addEventListener('click', () => runAlgorithm(dijkstra));
document.getElementById('btn-astar').addEventListener('click', () => runAlgorithm(aStar));
document.getElementById('btn-clear').addEventListener('click', clearGrid);
document.getElementById('btn-clear-path').addEventListener('click', clearPath);

// Run initial setup
initializeGrid();
