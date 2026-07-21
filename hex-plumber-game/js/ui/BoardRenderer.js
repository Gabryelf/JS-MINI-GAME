/**
 * Рендеринг игрового поля на Canvas
 * @namespace BoardRenderer
 */
 window.BoardRenderer = (function() {
    'use strict';

    /**
     * Класс рендерера поля
     */
    class BoardRenderer {
        /**
         * @param {HTMLCanvasElement} canvas - Элемент canvas
         * @param {Board} board - Игровое поле
         */
        constructor(canvas, board) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.board = board;
            this.hexSize = board.hexSize || 40;
            this.padding = 20;
            this.selectedCard = null;
            this.hoveredHex = null;
            this.onHexClick = null;
            this.onHexHover = null;

            this._setupCanvas();
            this._bindEvents();
        }

        /**
         * Настройка размера canvas
         */
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
            
            // Центрируем поле
            this.offsetX = this.size / 2;
            this.offsetY = this.size / 2;
        }

        /**
         * Привязка событий
         */
        _bindEvents() {
            // Клик
            this.canvas.addEventListener('click', (e) => {
                const rect = this.canvas.getBoundingClientRect();
                const scaleX = this.size / rect.width;
                const scaleY = this.size / rect.height;
                const x = (e.clientX - rect.left) * scaleX;
                const y = (e.clientY - rect.top) * scaleY;
                this._handleClick(x, y);
            });

            // Ховер (для мобильных - touch)
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

            // Touch
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

        /**
         * Обработка клика
         */
        _handleClick(x, y) {
            const hex = this._getHexAt(x, y);
            if (hex && this.onHexClick) {
                this.onHexClick(hex);
            }
        }

        /**
         * Обработка ховера
         */
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

        /**
         * Получение гекса по координатам мыши
         */
        _getHexAt(mx, my) {
            const hexSize = this.hexSize;
            const allHexes = this.board.getAllHexes();

            for (let i = 0; i < allHexes.length; i++) {
                const hex = allHexes[i];
                const pos = this._hexToPixel(hex.x, hex.y);
                const dx = mx - pos.x;
                const dy = my - pos.y;

                // Проверка попадания в гекс
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < hexSize * 0.85) {
                    // Дополнительная проверка углов
                    const angle = Math.atan2(dy, dx);
                    const hexAngle = Math.PI / 6;
                    const sector = Math.floor((angle + Math.PI / 2) / (Math.PI / 3));
                    // Простая проверка
                    return hex;
                }
            }
            return null;
        }

        /**
         * Преобразование координат гекса в пиксели
         */
        _hexToPixel(q, r) {
            const x = this.hexSize * (Math.sqrt(3) * q + Math.sqrt(3) / 2 * r);
            const y = this.hexSize * (3 / 2 * r);
            return {
                x: x + this.offsetX,
                y: y + this.offsetY
            };
        }

        /**
         * Отрисовка гекса
         */
        _drawHex(ctx, hex, x, y, size, isHighlighted = false, isHovered = false, isAvailable = false) {
            const edges = hex.getActiveEdges();
            const isPlaced = hex.isPlaced;
            const isStart = hex.isStart;

            // Цвета
            let fillColor = 'rgba(30, 40, 60, 0.6)';
            let strokeColor = 'rgba(255, 255, 255, 0.15)';
            let edgeColor = '#4fc3ff';

            if (isStart) {
                fillColor = 'rgba(0, 200, 150, 0.25)';
                strokeColor = 'rgba(0, 230, 170, 0.5)';
            } else if (isPlaced) {
                fillColor = 'rgba(40, 60, 90, 0.7)';
                strokeColor = 'rgba(255, 255, 255, 0.2)';
            }

            if (isAvailable && !isPlaced) {
                fillColor = 'rgba(79, 195, 255, 0.1)';
                strokeColor = 'rgba(79, 195, 255, 0.4)';
            }

            if (isHovered && !isPlaced && isAvailable) {
                fillColor = 'rgba(79, 195, 255, 0.2)';
                strokeColor = 'rgba(79, 195, 255, 0.7)';
            }

            if (isHighlighted) {
                strokeColor = 'rgba(255, 215, 0, 0.8)';
                fillColor = 'rgba(255, 215, 0, 0.1)';
            }

            // Рисуем шестиугольник
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = Math.PI / 180 * (60 * i - 30);
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
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Рисуем трубы (выходы)
            if (isPlaced || isStart || (isAvailable && this.selectedCard)) {
                const cardToDraw = this.selectedCard || hex;
                const activeEdges = cardToDraw.getActiveEdges();

                activeEdges.forEach(edgeIndex => {
                    const angle = Math.PI / 180 * (60 * edgeIndex - 30);
                    const startX = x + size * 0.25 * Math.cos(angle);
                    const startY = y + size * 0.25 * Math.sin(angle);
                    const endX = x + size * 0.85 * Math.cos(angle);
                    const endY = y + size * 0.85 * Math.sin(angle);

                    // Рисуем трубу (линию)
                    ctx.beginPath();
                    ctx.moveTo(startX, startY);
                    ctx.lineTo(endX, endY);
                    ctx.strokeStyle = '#4fc3ff';
                    ctx.lineWidth = 4;
                    ctx.shadowColor = 'rgba(79, 195, 255, 0.4)';
                    ctx.shadowBlur = 8;
                    ctx.stroke();
                    ctx.shadowBlur = 0;

                    // Круг на конце
                    ctx.beginPath();
                    ctx.arc(endX, endY, 4, 0, Math.PI * 2);
                    ctx.fillStyle = '#4fc3ff';
                    ctx.fill();
                });
            }

            // Если гекс пустой, показываем маленькие точки для ориентира
            if (!isPlaced && !isStart) {
                for (let i = 0; i < 6; i++) {
                    const angle = Math.PI / 180 * (60 * i - 30);
                    const px = x + size * 0.85 * Math.cos(angle);
                    const py = y + size * 0.85 * Math.sin(angle);
                    ctx.beginPath();
                    ctx.arc(px, py, 2, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                    ctx.fill();
                }
            }
        }

        /**
         * Основной метод рендеринга
         */
        render() {
            const ctx = this.ctx;
            const size = this.size;
            const hexSize = this.hexSize;

            // Очистка
            ctx.clearRect(0, 0, size, size);

            // Фон
            const gradient = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
            gradient.addColorStop(0, 'rgba(20, 40, 70, 0.2)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, size, size);

            // Получаем все гексы
            const allHexes = this.board.getAllHexes();
            const availableCells = this.board.getAvailableCells();
            const availableSet = new Set(availableCells.map(h => h.x + ',' + h.y));

            // Сортируем для правильного порядка отрисовки
            allHexes.sort((a, b) => (a.y + a.x/2) - (b.y + b.x/2));

            // Отрисовка каждого гекса
            allHexes.forEach(hex => {
                const pos = this._hexToPixel(hex.x, hex.y);
                const isAvailable = availableSet.has(hex.x + ',' + hex.y);
                const isHovered = this.hoveredHex && 
                    this.hoveredHex.x === hex.x && 
                    this.hoveredHex.y === hex.y;

                // Проверяем, нужно ли рисовать карту поверх
                if (this.selectedCard && !hex.isPlaced && isAvailable) {
                    // Рисуем пустой гекс с контуром
                    this._drawHex(ctx, hex, pos.x, pos.y, hexSize, false, isHovered, true);
                    // Рисуем карту поверх (прозрачно)
                    this._drawHex(ctx, this.selectedCard, pos.x, pos.y, hexSize, false, isHovered, true);
                } else {
                    this._drawHex(ctx, hex, pos.x, pos.y, hexSize, false, isHovered, isAvailable);
                }
            });

            // Рисуем сетку сверху (легкие линии)
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
            ctx.lineWidth = 0.5;
            for (let i = -this.board.radius - 1; i <= this.board.radius + 1; i++) {
                const p1 = this._hexToPixel(i, -this.board.radius - 1);
                const p2 = this._hexToPixel(i, this.board.radius + 1);
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
            for (let i = -this.board.radius - 1; i <= this.board.radius + 1; i++) {
                const p1 = this._hexToPixel(-this.board.radius - 1, i);
                const p2 = this._hexToPixel(this.board.radius + 1, i);
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        }

        /**
         * Установка выбранной карты для предпросмотра
         */
        setSelectedCard(card) {
            this.selectedCard = card;
            this.render();
        }

        /**
         * Обновление размера
         */
        resize() {
            this._setupCanvas();
            this.render();
        }
    }

    return BoardRenderer;
})();