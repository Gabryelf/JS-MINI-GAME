// ===== ui/BoardRenderer.js =====
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
            this.pipeSprite = null;
            this.spriteLoaded = false;
            this._loadSprite();

            // Для drag-камеры
            this.isDragging = false;
            this.dragStartX = 0;
            this.dragStartY = 0;
            this.cameraStartX = 0;
            this.cameraStartY = 0;

            this._setupCanvas();
            this._bindEvents();
        }

        _loadSprite() {
            this.pipeSprite = new Image();
            this.pipeSprite.crossOrigin = 'anonymous';
            this.pipeSprite.onload = () => {
                this.spriteLoaded = true;
                this.render();
            };
            this.pipeSprite.onerror = () => {
                console.warn('[BoardRenderer] Не удалось загрузить спрайт трубы, используем векторную отрисовку');
                this.spriteLoaded = false;
                this.render();
            };
            this.pipeSprite.src = 'assets/images/pipe.png';
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
            this.hexSize = Math.min(this.size / (this.board.radius * 2.8 + 1.5), 55);
            this.offsetX = this.size / 2;
            this.offsetY = this.size / 2;
        }

        _bindEvents() {
            // Mouse events
            this.canvas.addEventListener('mousedown', (e) => {
                const rect = this.canvas.getBoundingClientRect();
                const scaleX = this.size / rect.width;
                const scaleY = this.size / rect.height;
                const x = (e.clientX - rect.left) * scaleX;
                const y = (e.clientY - rect.top) * scaleY;
                
                // Проверяем, кликнули ли по гексу
                const hex = this._getHexAt(x, y);
                if (hex && this.selectedCard) {
                    this._handleClick(hex);
                    return;
                }
                
                // Начинаем drag
                this.isDragging = true;
                this.dragStartX = x;
                this.dragStartY = y;
                this.cameraStartX = this.board.cameraX;
                this.cameraStartY = this.board.cameraY;
                this.canvas.style.cursor = 'grabbing';
            });

            window.addEventListener('mousemove', (e) => {
                const rect = this.canvas.getBoundingClientRect();
                const scaleX = this.size / rect.width;
                const scaleY = this.size / rect.height;
                const x = (e.clientX - rect.left) * scaleX;
                const y = (e.clientY - rect.top) * scaleY;
                
                if (this.isDragging) {
                    const dx = x - this.dragStartX;
                    const dy = y - this.dragStartY;
                    this.board.setCamera(this.cameraStartX + dx, this.cameraStartY + dy);
                    this.render();
                } else {
                    this._handleHover(x, y);
                }
            });

            window.addEventListener('mouseup', () => {
                if (this.isDragging) {
                    this.isDragging = false;
                    this.canvas.style.cursor = 'grab';
                }
            });

            // Touch events
            let touchStartX = 0, touchStartY = 0;
            let touchCameraStartX = 0, touchCameraStartY = 0;
            let isTouchDragging = false;

            this.canvas.addEventListener('touchstart', (e) => {
                e.preventDefault();
                const touch = e.touches[0];
                const rect = this.canvas.getBoundingClientRect();
                const scaleX = this.size / rect.width;
                const scaleY = this.size / rect.height;
                const x = (touch.clientX - rect.left) * scaleX;
                const y = (touch.clientY - rect.top) * scaleY;
                
                const hex = this._getHexAt(x, y);
                if (hex && this.selectedCard) {
                    this._handleClick(hex);
                    return;
                }
                
                isTouchDragging = true;
                touchStartX = x;
                touchStartY = y;
                touchCameraStartX = this.board.cameraX;
                touchCameraStartY = this.board.cameraY;
            }, { passive: false });

            this.canvas.addEventListener('touchmove', (e) => {
                e.preventDefault();
                if (!isTouchDragging) return;
                const touch = e.touches[0];
                const rect = this.canvas.getBoundingClientRect();
                const scaleX = this.size / rect.width;
                const scaleY = this.size / rect.height;
                const x = (touch.clientX - rect.left) * scaleX;
                const y = (touch.clientY - rect.top) * scaleY;
                
                const dx = x - touchStartX;
                const dy = y - touchStartY;
                this.board.setCamera(touchCameraStartX + dx, touchCameraStartY + dy);
                this.render();
            }, { passive: false });

            this.canvas.addEventListener('touchend', (e) => {
                isTouchDragging = false;
            });

            // Resize
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

        _handleClick(hex) {
            if (!hex || hex.isPlaced || hex.isBlocked) return;
            if (!this.selectedCard) return;
            
            const isAvailable = this.availableCellsForCard.some(
                h => h.x === hex.x && h.y === hex.y
            );
            if (!isAvailable) return;
            
            if (this.onHexClick) {
                this.onHexClick(hex);
                // Сбрасываем выбранную карту после клика
                this.selectedCard = null;
                this.availableCellsForCard = [];
                this.render();
            }
        }

        _handleHover(x, y) {
            const hex = this._getHexAt(x, y);
            if (hex !== this.hoveredHex) {
                this.hoveredHex = hex;
                if (this.onHexHover) this.onHexHover(hex);
                this.render();
            }
        }

        _getHexAt(mx, my) {
            const hexSize = this.hexSize;
            const allHexes = this.board.getAllHexes();
            const camX = this.board.cameraX || 0;
            const camY = this.board.cameraY || 0;

            for (let i = 0; i < allHexes.length; i++) {
                const hex = allHexes[i];
                const pos = this._hexToPixel(hex.x, hex.y);
                const dx = mx - pos.x - camX;
                const dy = my - pos.y - camY;
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
            return { x, y };
        }

        _drawPipe(ctx, x, y, size, edgeIndex, isActive = false, config = null) {
            const cfg = config || this.drawConfig;
            
            // Если спрайт загружен - рисуем через спрайт
            if (this.spriteLoaded && this.pipeSprite) {
                const angleDeg = cfg.edgeAngles[edgeIndex % 6];
                const angle = Math.PI / 180 * angleDeg;
                const spriteSize = size * 0.65;
                const centerX = x + size * 0.15 * Math.cos(angle);
                const centerY = y + size * 0.15 * Math.sin(angle);
                
                ctx.save();
                ctx.translate(centerX, centerY);
                ctx.rotate(angle + Math.PI / 2);
                ctx.drawImage(this.pipeSprite, -spriteSize/2, -spriteSize/2, spriteSize, spriteSize);
                ctx.restore();
                return;
            }

            // Векторная отрисовка (fallback)
            const angleDeg = cfg.edgeAngles[edgeIndex % 6];
            const angle = Math.PI / 180 * angleDeg;
            
            const startX = x + size * cfg.pipeStartOffset * Math.cos(angle);
            const startY = y + size * cfg.pipeStartOffset * Math.sin(angle);
            const endX = x + size * cfg.pipeEndOffset * Math.cos(angle);
            const endY = y + size * cfg.pipeEndOffset * Math.sin(angle);

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

            const radius = isActive ? cfg.pipeEndRadius + 1 : cfg.pipeEndRadius;
            ctx.beginPath();
            ctx.arc(endX, endY, radius, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
        }

        _drawHex(ctx, hex, x, y, size, isHighlighted = false, isHovered = false, isAvailable = false) {
            const isPlaced = hex.isPlaced;
            const isStart = hex.isStart;
            const isBlocked = hex.isBlocked;

            let fillColor = 'rgba(30, 40, 60, 0.6)';
            let strokeColor = 'rgba(255, 255, 255, 0.15)';

            if (isBlocked) {
                fillColor = 'rgba(60, 30, 30, 0.5)';
                strokeColor = 'rgba(255, 50, 50, 0.2)';
            } else if (isStart) {
                fillColor = 'rgba(0, 200, 150, 0.25)';
                strokeColor = 'rgba(0, 230, 170, 0.5)';
            } else if (isPlaced) {
                fillColor = 'rgba(40, 60, 90, 0.7)';
                strokeColor = 'rgba(255, 255, 255, 0.2)';
            }

            if (isAvailable && !isPlaced && this.selectedCard && !isBlocked) {
                fillColor = 'rgba(79, 195, 255, 0.25)';
                strokeColor = 'rgba(79, 195, 255, 0.7)';
                const pulse = 0.6 + 0.4 * Math.sin(Date.now() / 500);
                ctx.shadowColor = `rgba(79, 195, 255, ${0.3 * pulse})`;
                ctx.shadowBlur = 20;
            }

            if (isHovered && isAvailable && !isPlaced && this.selectedCard && !isBlocked) {
                fillColor = 'rgba(79, 195, 255, 0.4)';
                strokeColor = 'rgba(79, 195, 255, 1)';
                ctx.shadowColor = 'rgba(79, 195, 255, 0.6)';
                ctx.shadowBlur = 30;
            }

            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = Math.PI / 180 * (60 * i + 30);
                const px = x + size * Math.cos(angle);
                const py = y + size * Math.sin(angle);
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();

            ctx.fillStyle = fillColor;
            ctx.fill();
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = isAvailable && this.selectedCard ? 2.5 : 1.5;
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Если заблокирован - рисуем крест
            if (isBlocked) {
                ctx.strokeStyle = 'rgba(255, 50, 50, 0.3)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(x - size*0.4, y - size*0.4);
                ctx.lineTo(x + size*0.4, y + size*0.4);
                ctx.moveTo(x + size*0.4, y - size*0.4);
                ctx.lineTo(x - size*0.4, y + size*0.4);
                ctx.stroke();
                return;
            }

            const cardToDraw = (isAvailable && this.selectedCard && !isPlaced) ? this.selectedCard : hex;
            const activeEdges = cardToDraw.getActiveEdges();
            const config = this.drawConfig;

            activeEdges.forEach(edgeIndex => {
                const isActive = isAvailable && this.selectedCard && !isPlaced;
                this._drawPipe(ctx, x, y, size, edgeIndex, isActive, config);
            });
        }

        render() {
            const ctx = this.ctx;
            const size = this.size;
            const hexSize = this.hexSize;
            const camX = this.board.cameraX || 0;
            const camY = this.board.cameraY || 0;

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

            // Сортируем для правильного z-порядка
            allHexes.sort((a, b) => {
                if (a.y !== b.y) return a.y - b.y;
                return a.x - b.x;
            });

            allHexes.forEach(hex => {
                const pos = this._hexToPixel(hex.x, hex.y);
                const x = pos.x + camX;
                const y = pos.y + camY;
                
                // Проверяем, виден ли гекс на экране
                if (x < -hexSize || x > size + hexSize || y < -hexSize || y > size + hexSize) {
                    return;
                }
                
                const isAvailable = availableSet.has(hex.x + ',' + hex.y);
                const isHovered = this.hoveredHex && 
                    this.hoveredHex.x === hex.x && 
                    this.hoveredHex.y === hex.y;

                if (this.selectedCard && isAvailable && !hex.isPlaced && !hex.isBlocked) {
                    this._drawHex(ctx, this.selectedCard, x, y, hexSize, false, isHovered, true);
                } else {
                    this._drawHex(ctx, hex, x, y, hexSize, false, isHovered, isAvailable);
                }
            });

            // Анимация пульсации для доступных клеток
            if (this.availableCellsForCard.length > 0 && this.selectedCard) {
                requestAnimationFrame(() => {
                    setTimeout(() => this.render(), 500);
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