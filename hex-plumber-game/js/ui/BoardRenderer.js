/**
 * Рендеринг игрового поля на Canvas
 * @namespace BoardRenderer
 */
 window.BoardRenderer = (function() {
    'use strict';

    class BoardRenderer {
        constructor(canvas, board) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.board = board;
            this.hexSize = board.hexSize || 40;
            this.padding = 20;
            this.selectedCard = null;
            this.hoveredHex = null;
            this.availableCellsForCard = [];
            this.onHexClick = null;
            this.onHexHover = null;
            this.drawConfig = Hex.getBoardDrawConfig();

            this._setupCanvas();
            this._bindEvents();
        }

        _setupCanvas() {
            const rect = this.canvas.parentElement.getBoundingClientRect();
            const size = Math.min(rect.width - 16, rect.height - 16);
            const dpr = window.devicePixelRatio || 1;
            
            this.canvas.width = size * dpr;
            this.canvas.height = size * dpr;
            this.canvas.style.width = size + 'px';
            this.canvas.style.height = size + 'px';
            
            this.ctx.scale(dpr, dpr);
            this.size = size;
            this.hexSize = this.size / (this.board.radius * 2.8 + 1.5);
            
            this.offsetX = this.size / 2;
            this.offsetY = this.size / 2;
        }

        _bindEvents() {
            this.canvas.addEventListener('click', (e) => {
                const rect = this.canvas.getBoundingClientRect();
                const scaleX = this.size / rect.width;
                const scaleY = this.size / rect.height;
                const x = (e.clientX - rect.left) * scaleX;
                const y = (e.clientY - rect.top) * scaleY;
                this._handleClick(x, y);
            });

            this.canvas.addEventListener('mousemove', (e) => {
                const rect = this.canvas.getBoundingClientRect();
                const scaleX = this.size / rect.width;
                const scaleY = this.size / rect.height;
                const x = (e.clientX - rect.left) * scaleX;
                const y = (e.clientY - rect.top) * scaleY;
                this._handleHover(x, y);
            });

            this.canvas.addEventListener('mouseleave', () => {
                this.hoveredHex = null;
                this.render();
            });

            this.canvas.addEventListener('touchstart', (e) => {
                e.preventDefault();
                const touch = e.touches[0];
                const rect = this.canvas.getBoundingClientRect();
                const scaleX = this.size / rect.width;
                const scaleY = this.size / rect.height;
                const x = (touch.clientX - rect.left) * scaleX;
                const y = (touch.clientY - rect.top) * scaleY;
                this._handleClick(x, y);
            });

            const resizeObserver = new ResizeObserver(() => {
                this._setupCanvas();
                this.render();
            });
            resizeObserver.observe(this.canvas.parentElement);

            window.addEventListener('resize', () => {
                this._setupCanvas();
                this.render();
            });
        }

        _handleClick(x, y) {
            const hex = this._getHexAt(x, y);
            if (hex && this.onHexClick) {
                const isAvailable = this.availableCellsForCard.some(
                    h => h.x === hex.x && h.y === hex.y
                );
                if (isAvailable) {
                    this.onHexClick(hex);
                }
            }
        }

        _handleHover(x, y) {
            const hex = this._getHexAt(x, y);
            if (hex !== this.hoveredHex) {
                this.hoveredHex = hex;
                if (this.onHexHover) {
                    this.onHexHover(hex);
                }
                this.render();
            }
        }

        _getHexAt(mx, my) {
            const hexSize = this.hexSize;
            const allHexes = this.board.getAllHexes();

            for (let i = 0; i < allHexes.length; i++) {
                const hex = allHexes[i];
                const pos = this._hexToPixel(hex.x, hex.y);
                const dx = mx - pos.x;
                const dy = my - pos.y;

                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < hexSize * 0.85) {
                    return hex;
                }
            }
            return null;
        }

        _hexToPixel(q, r) {
            const x = this.hexSize * (Math.sqrt(3) * q + Math.sqrt(3) / 2 * r);
            const y = this.hexSize * (3 / 2 * r);
            return {
                x: x + this.offsetX,
                y: y + this.offsetY
            };
        }
        
        /**
         * Отрисовка трубы для одной грани
         */
        _drawPipe(ctx, x, y, size, edgeIndex, isActive = false, config = null) {
            const cfg = config || this.drawConfig;
            
            // Получаем угол из конфигурации
            const angleDeg = cfg.edgeAngles[edgeIndex % 6];
            const angle = Math.PI / 180 * angleDeg;
            
            // Координаты трубы
            const startX = x + size * cfg.pipeStartOffset * Math.cos(angle);
            const startY = y + size * cfg.pipeStartOffset * Math.sin(angle);
            const endX = x + size * cfg.pipeEndOffset * Math.cos(angle);
            const endY = y + size * cfg.pipeEndOffset * Math.sin(angle);

            // Рисуем линию трубы
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            
            const color = isActive ? '#81d4fa' : cfg.pipeColor;
            const width = isActive ? cfg.pipeWidth + 1 : cfg.pipeWidth;
            ctx.strokeStyle = color;
            ctx.lineWidth = width;
            ctx.shadowColor = isActive ? 'rgba(79, 195, 255, 0.6)' : 'rgba(79, 195, 255, 0.4)';
            ctx.shadowBlur = isActive ? 12 : 8;
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Круг на конце трубы
            const radius = isActive ? cfg.pipeEndRadius + 1 : cfg.pipeEndRadius;
            ctx.beginPath();
            ctx.arc(endX, endY, radius, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
        }

        _drawHex(ctx, hex, x, y, size, isHighlighted = false, isHovered = false, isAvailable = false) {
            const isPlaced = hex.isPlaced;
            const isStart = hex.isStart;

            let fillColor = 'rgba(30, 40, 60, 0.6)';
            let strokeColor = 'rgba(255, 255, 255, 0.15)';

            if (isStart) {
                fillColor = 'rgba(0, 200, 150, 0.25)';
                strokeColor = 'rgba(0, 230, 170, 0.5)';
            } else if (isPlaced) {
                fillColor = 'rgba(40, 60, 90, 0.7)';
                strokeColor = 'rgba(255, 255, 255, 0.2)';
            }

            if (isAvailable && !isPlaced && this.selectedCard) {
                fillColor = 'rgba(79, 195, 255, 0.25)';
                strokeColor = 'rgba(79, 195, 255, 0.7)';
                const pulse = 0.6 + 0.4 * Math.sin(Date.now() / 500);
                ctx.shadowColor = `rgba(79, 195, 255, ${0.3 * pulse})`;
                ctx.shadowBlur = 20;
            }

            if (isHovered && isAvailable && !isPlaced && this.selectedCard) {
                fillColor = 'rgba(79, 195, 255, 0.4)';
                strokeColor = 'rgba(79, 195, 255, 1)';
                ctx.shadowColor = 'rgba(79, 195, 255, 0.6)';
                ctx.shadowBlur = 30;
            }

            if (isHighlighted) {
                strokeColor = 'rgba(255, 215, 0, 0.8)';
                fillColor = 'rgba(255, 215, 0, 0.1)';
            }

            // Рисуем шестиугольник - pointy-top (вершина вверх)
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = Math.PI / 180 * (60 * i + 30);
                const px = x + size * Math.cos(angle);
                const py = y + size * Math.sin(angle);
                if (i === 0) {
                    ctx.moveTo(px, py);
                } else {
                    ctx.lineTo(px, py);
                }
            }
            ctx.closePath();

            ctx.fillStyle = fillColor;
            ctx.fill();
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = isAvailable && this.selectedCard ? 2.5 : 1.5;
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Рисуем трубы на СТОРОНАХ используя конфигурацию
            const cardToDraw = (isAvailable && this.selectedCard && !isPlaced) ? this.selectedCard : hex;
            const activeEdges = cardToDraw.getActiveEdges();
            const config = this.drawConfig;

            activeEdges.forEach(edgeIndex => {
                const isActive = isAvailable && this.selectedCard && !isPlaced;
                this._drawPipe(ctx, x, y, size, edgeIndex, isActive, config);
            });

            // Отладочные номера граней (на сторонах)
            if (!isPlaced && !isStart) {
                for (let i = 0; i < 6; i++) {
                    const angleDeg = config.edgeAngles[i];
                    const angle = Math.PI / 180 * angleDeg;
                    const px = x + size * 0.7 * Math.cos(angle);
                    const py = y + size * 0.7 * Math.sin(angle);
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                    ctx.font = 'bold 12px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(i, px, py);
                }
            }
        }

        render() {
            const ctx = this.ctx;
            const size = this.size;
            const hexSize = this.hexSize;

            ctx.clearRect(0, 0, size, size);

            const gradient = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
            gradient.addColorStop(0, 'rgba(20, 40, 70, 0.2)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, size, size);

            const allHexes = this.board.getAllHexes();
            
            this.availableCellsForCard = [];
            if (this.selectedCard) {
                this.availableCellsForCard = this.board.getAvailableCellsForCard(this.selectedCard);
            }
            
            const availableSet = new Set(this.availableCellsForCard.map(h => h.x + ',' + h.y));

            allHexes.sort((a, b) => {
                if (a.y !== b.y) return a.y - b.y;
                return a.x - b.x;
            });

            allHexes.forEach(hex => {
                const pos = this._hexToPixel(hex.x, hex.y);
                const isAvailable = availableSet.has(hex.x + ',' + hex.y);
                const isHovered = this.hoveredHex && 
                    this.hoveredHex.x === hex.x && 
                    this.hoveredHex.y === hex.y;

                if (this.selectedCard && isAvailable && !hex.isPlaced) {
                    this._drawHex(ctx, this.selectedCard, pos.x, pos.y, hexSize, false, isHovered, true);
                } else {
                    this._drawHex(ctx, hex, pos.x, pos.y, hexSize, false, isHovered, isAvailable);
                }
            });

            // Сетка
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
            ctx.lineWidth = 0.5;
            
            for (let r = -this.board.radius - 1; r <= this.board.radius + 1; r++) {
                const startQ = -this.board.radius - 1;
                const endQ = this.board.radius + 1;
                const p1 = this._hexToPixel(startQ, r);
                const p2 = this._hexToPixel(endQ, r);
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
            
            for (let q = -this.board.radius - 1; q <= this.board.radius + 1; q++) {
                const startR = -this.board.radius - 1;
                const endR = this.board.radius + 1;
                const p1 = this._hexToPixel(q, startR);
                const p2 = this._hexToPixel(q, endR);
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }

            if (this.availableCellsForCard.length > 0 && this.selectedCard) {
                requestAnimationFrame(() => {
                    if (this.availableCellsForCard.length > 0) {
                        setTimeout(() => this.render(), 500);
                    }
                });
            }
        }

        setSelectedCard(card) {
            this.selectedCard = card;
            this.availableCellsForCard = [];
            if (card) {
                this.availableCellsForCard = this.board.getAvailableCellsForCard(card);
            }
            this.render();
        }

        resize() {
            this._setupCanvas();
            this.render();
        }
    }

    return BoardRenderer;
})();