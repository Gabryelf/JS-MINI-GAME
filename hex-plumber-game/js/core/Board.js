/**
 * Игровое поле
 * @namespace Board
 */
 window.Board = (function() {
    'use strict';

    class Board {
        constructor(params = {}) {
            this.radius = params.radius || 4;
            this.hexSize = params.hexSize || 40;
            this.hexes = new Map();
            this.startHexes = [];
            this.placedHexes = [];
            this.isLocked = false;
            this._initBoard();
        }

        _initBoard() {
            this.hexes.clear();
            this.startHexes = [];
            this.placedHexes = [];

            for (let q = -this.radius; q <= this.radius; q++) {
                for (let r = -this.radius; r <= this.radius; r++) {
                    if (Math.abs(q + r) <= this.radius) {
                        const key = q + ',' + r;
                        const hex = new Hex({
                            x: q,
                            y: r,
                            rotation: 0,
                            edges: [],
                            isPlaced: false,
                            isStart: false
                        });
                        this.hexes.set(key, hex);
                    }
                }
            }

            this.addStartHex(0, 0);
        }

        addStartHex(x, y) {
            const key = x + ',' + y;
            if (this.hexes.has(key)) {
                // Создаем стартовый гекс с поворотом на 180° (3)
                // чтобы трубы указывали на стороны
                const startHex = Hex.createStart(x, y);
                startHex.rotation = 3; // Поворот на 180°
                startHex.id = 'start_' + Date.now() + '_' + this.startHexes.length;
                this.hexes.set(key, startHex);
                this.startHexes.push(startHex);
                this.placedHexes.push(startHex);
                return startHex;
            }
            return null;
        }

        addStartHexes(coords) {
            const results = [];
            coords.forEach(([x, y]) => {
                const hex = this.addStartHex(x, y);
                if (hex) results.push(hex);
            });
            return results;
        }

        canPlaceHex(x, y, hex) {
            const key = x + ',' + y;
            if (!this.hexes.has(key)) {
                return false;
            }
            
            const existing = this.hexes.get(key);
            if (existing.isPlaced) {
                return false;
            }

            const neighbors = this._getNeighborCoords(x, y);
            let hasMatchingNeighbor = false;

            for (let dir = 0; dir < 6; dir++) {
                const neighbor = neighbors[dir];
                const neighborKey = neighbor.x + ',' + neighbor.y;
                
                if (this.hexes.has(neighborKey)) {
                    const neighborHex = this.hexes.get(neighborKey);
                    if (neighborHex.isPlaced) {
                        const oppositeDir = (dir + 3) % 6;
                        
                        const hasOurEdge = hex.hasEdge(dir);
                        const hasNeighborEdge = neighborHex.hasEdge(oppositeDir);
                        
                        if (hasNeighborEdge) {
                            if (!hasOurEdge) {
                                return false;
                            }
                            hasMatchingNeighbor = true;
                        } else {
                            if (hasOurEdge) {
                                return false;
                            }
                        }
                    }
                }
            }

            return hasMatchingNeighbor;
        }

        getAvailableCellsForCard(card) {
            const available = [];
            const allHexes = this.getAllHexes();
            
            for (let i = 0; i < allHexes.length; i++) {
                const hex = allHexes[i];
                if (hex.isPlaced) continue;
                
                if (this.canPlaceHex(hex.x, hex.y, card)) {
                    available.push(hex);
                }
            }
            
            return available;
        }

        placeHex(x, y, hex) {
            const key = x + ',' + y;
            if (!this.hexes.has(key)) return false;
            if (!this.canPlaceHex(x, y, hex)) return false;

            const existing = this.hexes.get(key);
            existing.edges = [...hex.edges];
            existing.rotation = hex.rotation;
            existing.isPlaced = true;
            existing.isStart = false;
            existing.id = hex.id || 'placed_' + Date.now();

            this.hexes.set(key, existing);
            this.placedHexes.push(existing);

            return true;
        }

        getHex(x, y) {
            const key = x + ',' + y;
            return this.hexes.get(key) || null;
        }

        getAllHexes() {
            return Array.from(this.hexes.values());
        }

        getPlacedHexes() {
            return this.placedHexes;
        }

        calculateFlood() {
            let leakCount = 0;
            const placed = this.getPlacedHexes();
            
            for (let i = 0; i < placed.length; i++) {
                for (let j = i + 1; j < placed.length; j++) {
                    const hex1 = placed[i];
                    const hex2 = placed[j];
                    
                    const dx = hex2.x - hex1.x;
                    const dy = hex2.y - hex1.y;
                    
                    let dir = -1;
                    const offsets = Hex.EDGE_OFFSETS;
                    for (let d = 0; d < offsets.length; d++) {
                        if (offsets[d].dx === dx && offsets[d].dy === dy) {
                            dir = d;
                            break;
                        }
                    }
                    
                    if (dir !== -1) {
                        const oppositeDir = (dir + 3) % 6;
                        const has1 = hex1.hasEdge(dir);
                        const has2 = hex2.hasEdge(oppositeDir);
                        
                        if (has1 !== has2) {
                            leakCount++;
                        }
                    }
                }
            }

            placed.forEach(hex => {
                const neighbors = this._getNeighborCoords(hex.x, hex.y);
                for (let dir = 0; dir < 6; dir++) {
                    const neighbor = neighbors[dir];
                    const key = neighbor.x + ',' + neighbor.y;
                    
                    if (!this.hexes.has(key)) {
                        if (hex.hasEdge(dir)) {
                            leakCount++;
                        }
                    } else {
                        const neighborHex = this.hexes.get(key);
                        if (!neighborHex.isPlaced && hex.hasEdge(dir)) {
                            leakCount++;
                        }
                    }
                }
            });

            return Math.max(0, leakCount / 2);
        }

        calculateProgress() {
            const total = this.hexes.size;
            const placed = this.placedHexes.length;
            return total > 0 ? placed / total : 0;
        }

        isLevelComplete() {
            return this.calculateFlood() === 0;
        }

        reset() {
            this.hexes.clear();
            this.startHexes = [];
            this.placedHexes = [];
            this._initBoard();
        }

        _getNeighborCoords(x, y) {
            const neighbors = [];
            const offsets = Hex.EDGE_OFFSETS;
            for (let i = 0; i < offsets.length; i++) {
                neighbors.push({
                    x: x + offsets[i].dx,
                    y: y + offsets[i].dy
                });
            }
            return neighbors;
        }

        getNeighbors(x, y) {
            const neighbors = [];
            const coords = this._getNeighborCoords(x, y);
            coords.forEach(coord => {
                const neighbor = this.getHex(coord.x, coord.y);
                if (neighbor) {
                    neighbors.push(neighbor);
                }
            });
            return neighbors;
        }

        getAvailableCells() {
            const available = [];
            const allHexes = this.getAllHexes();
            
            for (let i = 0; i < allHexes.length; i++) {
                const hex = allHexes[i];
                if (hex.isPlaced) continue;
                
                const neighbors = this.getNeighbors(hex.x, hex.y);
                let hasNeighborWithOutput = false;
                
                for (let j = 0; j < neighbors.length; j++) {
                    const neighbor = neighbors[j];
                    if (!neighbor.isPlaced) continue;
                    
                    const dx = hex.x - neighbor.x;
                    const dy = hex.y - neighbor.y;
                    let dir = -1;
                    const offsets = Hex.EDGE_OFFSETS;
                    for (let d = 0; d < offsets.length; d++) {
                        if (offsets[d].dx === dx && offsets[d].dy === dy) {
                            dir = d;
                            break;
                        }
                    }
                    
                    if (dir !== -1 && neighbor.hasEdge(dir)) {
                        hasNeighborWithOutput = true;
                        break;
                    }
                }
                
                if (hasNeighborWithOutput) {
                    available.push(hex);
                }
            }
            
            return available;
        }
    }

    return Board;
})();