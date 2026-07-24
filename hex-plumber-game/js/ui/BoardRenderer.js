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
            
            // Создаем спрайт трубы
            this.pipeSprite = this._createPipeSprite();
            this.spriteLoaded = true;

            // Для drag-камеры
            this.isDragging = false;
            this.dragStartX = 0;
            this.dragStartY = 0;
            this.cameraStartX = 0;
            this.cameraStartY = 0;

            // Флаг для остановки анимации
            this.isDestroyed = false;
            this.animationFrameId = null;

            this._setupCanvas();
            this._bindEvents();
            
            // Центрируем камеру при создании
            this._centerCamera();
        }

        _createPipeSprite() {
            const canvas = document.createElement('canvas');
            canvas.width = 128;
            canvas.height = 128;
            const ctx = canvas.getContext('2d');
            
            const centerX = 64;
            const centerY = 64;
            
            ctx.shadowColor = 'rgba(0, 150, 255, 0.3)';
            ctx.shadowBlur = 15;
            
            const grad = ctx.createLinearGradient(centerX - 16, 0, centerX + 16, 0);
            grad.addColorStop(0, '#1a6b8a');
            grad.addColorStop(0.3, '#4fc3ff');
            grad.addColorStop(0.5, '#81d4fa');
            grad.addColorStop(0.7, '#4fc3ff');
            grad.addColorStop(1, '#1a6b8a');
            
            ctx.shadowBlur = 20;
            ctx.shadowColor = 'rgba(0, 150, 255, 0.2)';
            
            const w = 28;
            const h = 116;
            const x = centerX - w/2;
            const y = centerY - h/2;
            
            ctx.beginPath();
            ctx.roundRect(x, y, w, h, 6);
            ctx.fillStyle = grad;
            ctx.fill();
            ctx.shadowBlur = 0;
            
            ctx.beginPath();
            ctx.roundRect(x + 4, y + 8, 5, h - 16, 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
            ctx.fill();
            
            ctx.beginPath();
            ctx.roundRect(x + w - 8, y + 8, 3, h - 16, 1);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.fill();
            
            ctx.beginPath();
            ctx.roundRect(x - 3, y - 3, w + 6, 10, 3);
            ctx.fillStyle = '#2c7be5';
            ctx.fill();
            ctx.strokeStyle = '#1a6b8a';
            ctx.lineWidth = 1.5;
            ctx.stroke();
            
            ctx.beginPath();
            ctx.roundRect(x + 2, y + 1, 4, 5, 1);
            ctx.fillStyle = '#1a6b8a';
            ctx.fill();
            
            ctx.beginPath();
            ctx.roundRect(x + 2, y + h - 6, 4, 5, 1);
            ctx.fillStyle = '#1a6b8a';
            ctx.fill();
            
            ctx.beginPath();
            ctx.roundRect(x + w - 6, y + 1, 4, 5, 1);
            ctx.fillStyle = '#1a6b8a';
            ctx.fill();
            
            ctx.beginPath();
            ctx.roundRect(x + w - 6, y + h - 6, 4, 5, 1);
            ctx.fillStyle = '#1a6b8a';
            ctx.fill();
            
            const glowGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 20);
            glowGrad.addColorStop(0, 'rgba(79, 195, 255, 0.15)');
            glowGrad.addColorStop(1, 'rgba(79, 195, 255, 0)');
            ctx.fillStyle = glowGrad;
            ctx.beginPath();
            ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
            ctx.fill();
            
            const boltPositions = [
                [x + 3, y + 2],
                [x + w - 3, y + 2],
                [x + 3, y + h - 2],
                [x + w - 3, y + h - 2]
            ];
            boltPositions.forEach(([bx, by]) => {
                ctx.beginPath();
                ctx.arc(bx, by, 2.5, 0, Math.PI * 2);
                ctx.fillStyle = '#1a6b8a';
                ctx.fill();
                ctx.strokeStyle = '#0d4a66';
                ctx.lineWidth = 0.5;
                ctx.stroke();
                
                ctx.beginPath();
                ctx.arc(bx - 0.5, by - 0.5, 1, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.fill();
            });
            
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.lineWidth = 1;
            for (let i = 0; i < 3; i++) {
                const ly = y + 20 + i * 22;
                ctx.beginPath();
                ctx.moveTo(x + 4, ly);
                ctx.lineTo(x + w - 4, ly);
                ctx.stroke();
            }
            
            return canvas;
        }

        _centerCamera() {
            const allHexes = this.board.getAllHexes();
            if (allHexes.length === 0) return;
            
            let centerX = 0, centerY = 0;
            let count = 0;
            
            allHexes.forEach(hex => {
                const pos = this._hexToPixel(hex.x, hex.y);
                centerX += pos.x;
                centerY += pos.y;
                count++;
            });
            
            if (count > 0) {
                centerX /= count;
                centerY /= count;
                const targetX = this.size / 2 - centerX;
                const targetY = this.size / 2 - centerY;
                this.board.setCamera(targetX, targetY);
                this.cameraStartX = targetX;
                this.cameraStartY = targetY;
            }
        }

        _setupCanvas() {
            const rect = this.canvas.parentElement.getBoundingClientRect();
            const size = Math.min(rect.width - 16, rect.height - 16);
            const dpr = window.devicePixelRatio || 1;
            
            const safeSize = Math.max(size, 100);
            
            this.canvas.width = safeSize * dpr;
            this.canvas.height = safeSize * dpr;
            this.canvas.style.width = safeSize + 'px';
            this.canvas.style.height = safeSize + 'px';
            
            this.ctx.scale(dpr, dpr);
            this.size = safeSize;
            
            const maxHexSize = 55;
            const minHexSize = 25;
            const calculatedSize = this.size / (this.board.radius * 2.8 + 1.5);
            this.hexSize = Math.min(Math.max(calculatedSize, minHexSize), maxHexSize);
            
            this.offsetX = this.size / 2;
            this.offsetY = this.size / 2;
        }

        _bindEvents() {
            // Очищаем старые обработчики
            const newCanvas = this.canvas.cloneNode(true);
            this.canvas.parentNode.replaceChild(newCanvas, this.canvas);
            this.canvas = newCanvas;
            this.ctx = this.canvas.getContext('2d');

            // Mouse events
            this.canvas.addEventListener('mousedown', (e) => {
                if (this.isDestroyed) return;
                const rect = this.canvas.getBoundingClientRect();
                const scaleX = this.size / rect.width;
                const scaleY = this.size / rect.height;
                const x = (e.clientX - rect.left) * scaleX;
                const y = (e.clientY - rect.top) * scaleY;
                
                const hex = this._getHexAt(x, y);
                if (hex && this.selectedCard) {
                    this._handleClick(hex);
                    return;
                }
                
                this.isDragging = true;
                this.dragStartX = x;
                this.dragStartY = y;
                this.cameraStartX = this.board.cameraX || 0;
                this.cameraStartY = this.board.cameraY || 0;
                this.canvas.style.cursor = 'grabbing';
            });

            window.addEventListener('mousemove', (e) => {
                if (this.isDestroyed) return;
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
                if (this.isDestroyed) return;
                if (this.isDragging) {
                    this.isDragging = false;
                    this.canvas.style.cursor = 'grab';
                }
            });

            // Touch events
            let touchStartX = 0, touchStartY = 0;
            let touchCameraStartX = 0, touchCameraStartY = 0;
            let isTouchDragging = false;
            let touchTapTimeout = null;

            this.canvas.addEventListener('touchstart', (e) => {
                if (this.isDestroyed) return;
                e.preventDefault();
                const touch = e.touches[0];
                const rect = this.canvas.getBoundingClientRect();
                const scaleX = this.size / rect.width;
                const scaleY = this.size / rect.height;
                const x = (touch.clientX - rect.left) * scaleX;
                const y = (touch.clientY - rect.top) * scaleY;
                
                const hex = this._getHexAt(x, y);
                if (hex && this.selectedCard) {
                    touchTapTimeout = setTimeout(() => {
                        if (!this.isDestroyed) this._handleClick(hex);
                    }, 100);
                    return;
                }
                
                clearTimeout(touchTapTimeout);
                isTouchDragging = true;
                touchStartX = x;
                touchStartY = y;
                touchCameraStartX = this.board.cameraX || 0;
                touchCameraStartY = this.board.cameraY || 0;
            }, { passive: false });

            this.canvas.addEventListener('touchmove', (e) => {
                if (this.isDestroyed) return;
                e.preventDefault();
                if (!isTouchDragging) return;
                clearTimeout(touchTapTimeout);
                
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
                if (this.isDestroyed) return;
                clearTimeout(touchTapTimeout);
                isTouchDragging = false;
            });

            // Resize
            const resizeObserver = new ResizeObserver(() => {
                if (this.isDestroyed) return;
                this._setupCanvas();
                this._centerCamera();
                this.render();
            });
            resizeObserver.observe(this.canvas.parentElement);
            this._resizeObserver = resizeObserver;
            
            window.addEventListener('resize', () => {
                if (this.isDestroyed) return;
                this._setupCanvas();
                this._centerCamera();
                this.render();
            });
        }

        _handleClick(hex) {
            if (this.isDestroyed) return;
            if (!hex || hex.isPlaced || hex.isBlocked) return;
            if (!this.selectedCard) return;
            
            const isAvailable = this.availableCellsForCard.some(
                h => h.x === hex.x && h.y === hex.y
            );
            if (!isAvailable) return;
            
            if (this.onHexClick) {
                this.onHexClick(hex);
                this.selectedCard = null;
                this.availableCellsForCard = [];
                this.render();
            }
        }

        _handleHover(x, y) {
            if (this.isDestroyed) return;
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
            if (this.isDestroyed) return;
            const cfg = config || this.drawConfig;
            
            const angleDeg = cfg.edgeAngles[edgeIndex % 6];
            const angle = Math.PI / 180 * angleDeg;
            
            const distanceFromCenter = size * 0.05;
            const pipeLength = size * 0.7;
            
            const startX = x + distanceFromCenter * Math.cos(angle);
            const startY = y + distanceFromCenter * Math.sin(angle);
            const endX = x + (distanceFromCenter + pipeLength) * Math.cos(angle);
            const endY = y + (distanceFromCenter + pipeLength) * Math.sin(angle);

            if (this.pipeSprite && !this.isDestroyed) {
                ctx.save();
                
                const spriteSize = size * 0.9;
                const midX = (startX + endX) / 2;
                const midY = (startY + endY) / 2;
                
                ctx.translate(midX, midY);
                ctx.rotate(angle + Math.PI / 2);
                
                if (isActive) {
                    ctx.globalAlpha = 0.9;
                    ctx.shadowColor = 'rgba(79, 195, 255, 0.8)';
                    ctx.shadowBlur = 30;
                } else {
                    ctx.shadowColor = 'rgba(0, 150, 255, 0.3)';
                    ctx.shadowBlur = 10;
                }
                
                ctx.drawImage(this.pipeSprite, -spriteSize/2, -spriteSize/2, spriteSize, spriteSize);
                ctx.restore();
                
                if (isActive && !this.isDestroyed) {
                    ctx.save();
                    ctx.globalAlpha = 0.3;
                    const glowGrad = ctx.createRadialGradient(midX, midY, 0, midX, midY, spriteSize * 1.2);
                    glowGrad.addColorStop(0, 'rgba(79, 195, 255, 0.6)');
                    glowGrad.addColorStop(1, 'rgba(79, 195, 255, 0)');
                    ctx.fillStyle = glowGrad;
                    ctx.beginPath();
                    ctx.arc(midX, midY, spriteSize * 1.2, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
                return;
            }

            // Fallback
            const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
            if (isActive) {
                gradient.addColorStop(0, '#4fc3ff');
                gradient.addColorStop(0.5, '#81d4fa');
                gradient.addColorStop(1, '#4fc3ff');
            } else {
                gradient.addColorStop(0, '#1a6b8a');
                gradient.addColorStop(0.3, '#4fc3ff');
                gradient.addColorStop(0.7, '#4fc3ff');
                gradient.addColorStop(1, '#1a6b8a');
            }
            
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = isActive ? size * 0.25 : size * 0.2;
            ctx.lineCap = 'round';
            ctx.shadowColor = isActive ? 'rgba(79, 195, 255, 0.6)' : 'rgba(79, 195, 255, 0.2)';
            ctx.shadowBlur = isActive ? 25 : 10;
            ctx.stroke();
            ctx.shadowBlur = 0;

            const radius = isActive ? size * 0.14 : size * 0.11;
            ctx.beginPath();
            ctx.arc(endX, endY, radius, 0, Math.PI * 2);
            ctx.fillStyle = isActive ? '#81d4fa' : '#4fc3ff';
            ctx.shadowColor = 'rgba(79, 195, 255, 0.3)';
            ctx.shadowBlur = 15;
            ctx.fill();
            ctx.shadowBlur = 0;
            
            if (isActive && !this.isDestroyed) {
                ctx.beginPath();
                ctx.arc(endX, endY, radius * 3, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(79, 195, 255, 0.15)';
                ctx.fill();
            }
        }

        _drawHex(ctx, hex, x, y, size, isHighlighted = false, isHovered = false, isAvailable = false) {
            if (this.isDestroyed) return;
            const isPlaced = hex.isPlaced;
            const isStart = hex.isStart;
            const isBlocked = hex.isBlocked;

            let fillColor = 'rgba(30, 40, 60, 0.6)';
            let strokeColor = 'rgba(255, 255, 255, 0.15)';

            if (isBlocked) {
                fillColor = 'rgba(60, 30, 30, 0.5)';
                strokeColor = 'rgba(255, 50, 50, 0.2)';
            } else if (isStart) {
                fillColor = 'rgba(0, 200, 150, 0.2)';
                strokeColor = 'rgba(0, 230, 170, 0.4)';
            } else if (isPlaced) {
                fillColor = 'rgba(40, 60, 90, 0.7)';
                strokeColor = 'rgba(255, 255, 255, 0.2)';
            }

            if (isAvailable && !isPlaced && this.selectedCard && !isBlocked) {
                fillColor = 'rgba(79, 195, 255, 0.15)';
                strokeColor = 'rgba(79, 195, 255, 0.6)';
                const pulse = 0.6 + 0.4 * Math.sin(Date.now() / 500);
                ctx.shadowColor = `rgba(79, 195, 255, ${0.2 * pulse})`;
                ctx.shadowBlur = 15;
            }

            if (isHovered && isAvailable && !isPlaced && this.selectedCard && !isBlocked) {
                fillColor = 'rgba(79, 195, 255, 0.3)';
                strokeColor = 'rgba(79, 195, 255, 0.9)';
                ctx.shadowColor = 'rgba(79, 195, 255, 0.5)';
                ctx.shadowBlur = 25;
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

            if (isBlocked) {
                ctx.strokeStyle = 'rgba(255, 50, 50, 0.4)';
                ctx.lineWidth = 2;
                ctx.setLineDash([4, 4]);
                ctx.beginPath();
                ctx.moveTo(x - size*0.35, y - size*0.35);
                ctx.lineTo(x + size*0.35, y + size*0.35);
                ctx.moveTo(x + size*0.35, y - size*0.35);
                ctx.lineTo(x - size*0.35, y + size*0.35);
                ctx.stroke();
                ctx.setLineDash([]);
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
            if (this.isDestroyed) return;
            
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

            allHexes.sort((a, b) => {
                if (a.y !== b.y) return a.y - b.y;
                return a.x - b.x;
            });

            allHexes.forEach(hex => {
                const pos = this._hexToPixel(hex.x, hex.y);
                const x = pos.x + camX;
                const y = pos.y + camY;
                
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

            // Анимация пульсации только если не уничтожен
            if (!this.isDestroyed && this.availableCellsForCard.length > 0 && this.selectedCard) {
                if (this.animationFrameId) {
                    cancelAnimationFrame(this.animationFrameId);
                }
                this.animationFrameId = requestAnimationFrame(() => {
                    if (!this.isDestroyed) {
                        setTimeout(() => this.render(), 500);
                    }
                });
            }
        }

        setSelectedCard(card) {
            if (this.isDestroyed) return;
            this.selectedCard = card;
            this.availableCellsForCard = [];
            if (card) {
                this.availableCellsForCard = this.board.getAvailableCellsForCard(card);
            }
            this.render();
        }

        // Полное уничтожение рендерера
        destroy() {
            this.isDestroyed = true;
            
            // Отменяем все анимации
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
                this.animationFrameId = null;
            }
            
            // Отключаем resize observer
            if (this._resizeObserver) {
                this._resizeObserver.disconnect();
                this._resizeObserver = null;
            }
            
            // Очищаем канвас
            if (this.ctx) {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }
            
            // Сбрасываем все ссылки
            this.canvas = null;
            this.ctx = null;
            this.board = null;
            this.selectedCard = null;
            this.hoveredHex = null;
            this.availableCellsForCard = null;
            this.pipeSprite = null;
            this.onHexClick = null;
            this.onHexHover = null;
        }

        // Полный сброс с пересозданием
        fullReset() {
            if (this.isDestroyed) return;
            
            // Отменяем анимации
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
                this.animationFrameId = null;
            }
            
            // Полная очистка канваса
            if (this.ctx) {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }
            
            // Сброс состояний
            this.selectedCard = null;
            this.hoveredHex = null;
            this.availableCellsForCard = [];
            this.isDragging = false;
            this.dragStartX = 0;
            this.dragStartY = 0;
            this.cameraStartX = 0;
            this.cameraStartY = 0;
            
            // Пересоздаем спрайт
            this.pipeSprite = this._createPipeSprite();
            this.spriteLoaded = true;
            
            // Переустанавливаем канвас
            this._setupCanvas();
            
            // Центрируем камеру
            this._centerCamera();
            
            // Рендерим
            this.render();
        }

        resize() {
            if (this.isDestroyed) return;
            this._setupCanvas();
            this._centerCamera();
            this.render();
        }
    }

    if (!CanvasRenderingContext2D.prototype.roundRect) {
        CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, radii) {
            const r = typeof radii === 'number' ? radii : (radii || 0);
            this.moveTo(x + r, y);
            this.lineTo(x + w - r, y);
            this.quadraticCurveTo(x + w, y, x + w, y + r);
            this.lineTo(x + w, y + h - r);
            this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
            this.lineTo(x + r, y + h);
            this.quadraticCurveTo(x, y + h, x, y + h - r);
            this.lineTo(x, y + r);
            this.quadraticCurveTo(x, y, x + r, y);
            return this;
        };
    }

    return BoardRenderer;
})();