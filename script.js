// Wrap in an IIFE
(function() {
    console.log('Hybrid Grid ASCII with LARGER Pixelated Native Text animation loading...');

    const SimplexNoise = (() => { // ... (Simplex Noise code - remains unchanged from previous versions)
        const F2 = 0.5 * (Math.sqrt(3.0) - 1.0); const G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
        const F3 = 1.0 / 3.0; const G3 = 1.0 / 6.0;
        const grad3 = new Float32Array([1,1,0,-1,1,0,1,-1,0,-1,-1,0,1,0,1,-1,0,1,1,0,-1,-1,0,-1,0,1,1,0,-1,1,0,1,-1,0,-1,-1,]);
        const p = new Uint8Array(256); for(let i=0; i<256; i++) p[i]=i;
        let perm = new Uint8Array(512); let permMod12 = new Uint8Array(512);
        shufflePermutations();
        function shufflePermutations(){for(let i=255;i>0;i--){const r=Math.floor(Math.random()*(i+1));const temp=p[i];p[i]=p[r];p[r]=temp;}for(let i=0;i<512;i++){perm[i]=p[i&255];permMod12[i]=perm[i]%12;}}
        shufflePermutations();
        function noise3D(xin,yin,zin){let n0,n1,n2,n3;const s=(xin+yin+zin)*F3;const i=Math.floor(xin+s);const j=Math.floor(yin+s);const k=Math.floor(zin+s);const t=(i+j+k)*G3;const X0=i-t;const Y0=j-t;const Z0=k-t;const x0=xin-X0;const y0=yin-Y0;const z0=zin-Z0;let i1,j1,k1;let i2,j2,k2;if(x0>=y0){if(y0>=z0){i1=1;j1=0;k1=0;i2=1;j2=1;k2=0;}else if(x0>=z0){i1=1;j1=0;k1=0;i2=1;j2=0;k2=1;}else{i1=0;j1=0;k1=1;i2=1;j2=0;k2=1;}}else{if(y0<z0){i1=0;j1=0;k1=1;i2=0;j2=1;k2=1;}else if(x0<z0){i1=0;j1=1;k1=0;i2=0;j2=1;k2=1;}else{i1=0;j1=1;k1=0;i2=1;j2=1;k2=0;}}const x1=x0-i1+G3;const y1=y0-j1+G3;const z1=z0-k1+G3;const x2=x0-i2+2.0*G3;const y2=y0-j2+2.0*G3;const z2=z0-k2+2.0*G3;const x3=x0-1.0+3.0*G3;const y3=y0-1.0+3.0*G3;const z3=z0-1.0+3.0*G3;const ii=i&255;const jj=j&255;const kk=k&255;const gi0=permMod12[ii+perm[jj+perm[kk]]];const gi1=permMod12[ii+i1+perm[jj+j1+perm[kk+k1]]];const gi2=permMod12[ii+i2+perm[jj+j2+perm[kk+k2]]];const gi3=permMod12[ii+1+perm[jj+1+perm[kk+1]]];let t0=0.6-x0*x0-y0*y0-z0*z0;if(t0<0)n0=0.0;else{t0*=t0;n0=t0*t0*dot(grad3,gi0*3,x0,y0,z0);}let t1=0.6-x1*x1-y1*y1-z1*z1;if(t1<0)n1=0.0;else{t1*=t1;n1=t1*t1*dot(grad3,gi1*3,x1,y1,z1);}let t2=0.6-x2*x2-y2*y2-z2*z2;if(t2<0)n2=0.0;else{t2*=t2;n2=t2*t2*dot(grad3,gi2*3,x2,y2,z2);}let t3=0.6-x3*x3-y3*y3-z3*z3;if(t3<0)n3=0.0;else{t3*=t3;n3=t3*t3*dot(grad3,gi3*3,x3,y3,z3);}return 32.0*(n0+n1+n2+n3);}
        function dot(g,gIdx,x,y,z){return g[gIdx]*x+g[gIdx+1]*y+g[gIdx+2]*z;}
        return{noise3D,shufflePermutations};
    })();

    const phrases = [ // Same phrases as before
        { lang: "English", text: "Hello, I'm Noah" },
        { lang: "Chinese", text: "你好，我是诺亚" }, 
        { lang: "Russian", text: "Привет, я Ноа" },  
        { lang: "Hindi", text: "नमस्ते, मैं नोआ हूँ" }, 
        { lang: "Japanese", text: "こんにちは、ノアです" }, 
        { lang: "Arabic", text: "مرحباً، أنا نوح" }, 
        { lang: "Spanish", text: "Hola, soy Noah" },
        { lang: "French", text: "Bonjour, je suis Noah" },
        { lang: "German", text: "Hallo, ich bin Noah" }
    ];

    function ready(callback) {
        if (document.readyState !== 'loading') callback();
        else document.addEventListener('DOMContentLoaded', callback);
    }

    function initAnimation() {
        try {
            const backgroundContainer = document.querySelector('.background-animation');
            if (!backgroundContainer) throw new Error('.background-animation not found!');
            backgroundContainer.innerHTML = ''; 
            
            const canvas = document.createElement('canvas');
            const offscreenCanvas = document.createElement('canvas');
            backgroundContainer.appendChild(canvas);
            const ctx = canvas.getContext('2d', { willReadFrequently: false }); 
            const offCtx = offscreenCanvas.getContext('2d', { willReadFrequently: true });
            if (!ctx || !offCtx) throw new Error('Failed to get 2D context');

            let animationFrameId;
            let grid = []; 
            let numCols, numRows;
            let time = Math.random() * 1000;

            const config = {
                backgroundFontSize: 12, 
                textPixelSize: 2, // Smaller pixel size for denser, potentially more detailed text
                // Increased base font size for offscreen rendering significantly
                nativeTextRenderFontBaseSize: 96, // Base font size in px to aim for height
                nativeTextRenderFontFamily: "Arial, Noto Sans, Noto Sans JP, Noto Sans SC, Noto Sans KR, Noto Naskh Arabic, sans-serif",
                charSet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$*#@&?", 
                baseColor: 'rgba(180, 200, 255, VAL)', 
                highlightColor: 'rgba(230, 240, 255, VAL)',
                borderColor: 'rgba(220, 220, 255, 0.8)',
                borderChar: { corner: '+', top_bottom: '-', side: '|' },
                textPixelOnColor: 'rgba(250, 250, 255, 0.95)',
                textPixelOffAlpha: 0.03, // Make background even dimmer under text
                canvasClearColor: 'rgba(10, 10, 25, 1)', 
                noiseScale: 0.08,       
                timeScale: 0.08,        
                activationThreshold: 0.3, 
                highlightThreshold: 0.65, 
                fadeSpeed: 0.1,         
                charChangeProbability: 0.03,
                phraseChangeInterval: 5000, 
                textAreaWidthRatio: 0.75, // Slightly wider text area
                textAreaHeightRatio: 0.30, // Slightly taller text area
                textPaddingRatio: 0.08, // Padding as a ratio of the smaller dimension of text area
            };
            
            let currentPhraseIndex = 0;
            let lastPhraseChangeTime = 0;
            let pixelatedTextData = { width: 0, height: 0, data: [] }; 

            let textDisplayArea = { x: 0, y: 0, width: 0, height: 0, padding: 0 };
            let borderRectCells = { startCol:0, endCol:0, startRow:0, endRow:0 };


            class GridCell { // ... (GridCell class remains largely unchanged)
                constructor(col, row) {
                    this.col = col; this.row = row; this.char = getRandomChar();
                    this.currentAlpha = 0; this.targetAlpha = 0;
                    this.colorTemplate = config.baseColor; this.isBorder = false;
                    this.borderRole = null; this.isWithinTextDisplay = false;
                }
                update(noiseValue) {
                    this.isBorder = (this.col === borderRectCells.startCol || this.col === borderRectCells.endCol -1) && (this.row >= borderRectCells.startRow && this.row < borderRectCells.endRow) || (this.row === borderRectCells.startRow || this.row === borderRectCells.endRow -1) && (this.col >= borderRectCells.startCol && this.col < borderRectCells.endCol);
                    const cellCenterX = (this.col + 0.5) * config.backgroundFontSize; const cellCenterY = (this.row + 0.5) * config.backgroundFontSize;
                    this.isWithinTextDisplay = cellCenterX >= textDisplayArea.x && cellCenterX < textDisplayArea.x + textDisplayArea.width && cellCenterY >= textDisplayArea.y && cellCenterY < textDisplayArea.y + textDisplayArea.height;
                    if (this.isBorder) {
                        this.targetAlpha = 0.7 + (Math.sin(time * 2 + this.col + this.row) + 1) * 0.15;
                        this.colorTemplate = config.borderColor.replace('VAL', this.targetAlpha.toFixed(2));
                        const isTop = this.row === borderRectCells.startRow; const isBottom = this.row === borderRectCells.endRow - 1;
                        const isLeft = this.col === borderRectCells.startCol; const isRight = this.col === borderRectCells.endCol - 1;
                        if ((isTop && isLeft) || (isTop && isRight) || (isBottom && isLeft) || (isBottom && isRight)) { this.char = config.borderChar.corner; }
                        else if (isTop || isBottom) { this.char = config.borderChar.top_bottom; } else if (isLeft || isRight) { this.char = config.borderChar.side; }
                    } else if (this.isWithinTextDisplay) {
                        this.targetAlpha = config.textPixelOffAlpha; this.char = '·'; this.colorTemplate = config.baseColor;
                    } else {
                        if (noiseValue > config.activationThreshold) {
                            this.targetAlpha = Math.min(1, (noiseValue - config.activationThreshold) / (1 - config.activationThreshold) * 1.2); 
                            if (this.currentAlpha < 0.1 || Math.random() < config.charChangeProbability) { this.char = getRandomChar(); }
                            this.colorTemplate = (noiseValue > config.highlightThreshold) ? config.highlightColor : config.baseColor;
                        } else { this.targetAlpha = 0; }
                    }
                    this.currentAlpha += (this.targetAlpha - this.currentAlpha) * config.fadeSpeed;
                    if (Math.abs(this.currentAlpha - this.targetAlpha) < 0.01) this.currentAlpha = this.targetAlpha;
                }
                draw() {
                    if (this.currentAlpha > 0.01) {
                        ctx.fillStyle = this.isBorder ? this.colorTemplate : this.colorTemplate.replace('VAL', this.currentAlpha.toFixed(2));
                        ctx.fillText(this.char, this.col*config.backgroundFontSize + config.backgroundFontSize*0.5, this.row*config.backgroundFontSize + config.backgroundFontSize*0.7);
                    }
                }
            }

            function getRandomChar() {
                return config.charSet.charAt(Math.floor(Math.random() * config.charSet.length));
            }

            function renderAndPixelateCurrentPhrase() {
                const phraseObj = phrases[currentPhraseIndex];
                const textToRender = phraseObj.text;

                // Content area for text rendering (inside padding)
                const contentRenderWidth = textDisplayArea.width - 2 * textDisplayArea.padding;
                const contentRenderHeight = textDisplayArea.height - 2 * textDisplayArea.padding;

                if (contentRenderWidth <= 0 || contentRenderHeight <= 0) {
                    pixelatedTextData = { width: 0, height: 0, data: [] }; return;
                }

                // --- Determine optimal font size for offscreen rendering ---
                let dynamicFontSize = config.nativeTextRenderFontBaseSize;
                offCtx.font = `bold ${dynamicFontSize}px ${config.nativeTextRenderFontFamily}`;
                let textMetrics = offCtx.measureText(textToRender);
                let textHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;
                textHeight = (textHeight && !isNaN(textHeight) && textHeight > 0) ? textHeight : dynamicFontSize; // Fallback if metrics fail

                // Adjust font size based on height first to fill most of the contentRenderHeight
                if (textHeight > contentRenderHeight && contentRenderHeight > 0) {
                    dynamicFontSize = Math.floor(dynamicFontSize * (contentRenderHeight / textHeight));
                } else if (textHeight < contentRenderHeight * 0.7 && textHeight > 0) { // If too small, try to scale up
                     dynamicFontSize = Math.floor(dynamicFontSize * (contentRenderHeight * 0.85 / textHeight)); // Aim for 85% height
                }
                dynamicFontSize = Math.max(10, dynamicFontSize); // Minimum font size

                offCtx.font = `bold ${dynamicFontSize}px ${config.nativeTextRenderFontFamily}`;
                textMetrics = offCtx.measureText(textToRender);
                textHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;
                textHeight = (textHeight && !isNaN(textHeight) && textHeight > 0) ? textHeight : dynamicFontSize;
                let textWidth = textMetrics.width;
                
                // Adjust font size based on width if it overflows
                if (textWidth > contentRenderWidth && contentRenderWidth > 0) {
                    dynamicFontSize = Math.floor(dynamicFontSize * (contentRenderWidth / textWidth));
                }
                dynamicFontSize = Math.max(10, dynamicFontSize);

                // Final font setting for offscreen rendering
                offCtx.font = `bold ${dynamicFontSize}px ${config.nativeTextRenderFontFamily}`;
                textMetrics = offCtx.measureText(textToRender);
                textWidth = textMetrics.width;
                textHeight = (textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent);
                textHeight = (textHeight && !isNaN(textHeight) && textHeight > 0) ? textHeight : dynamicFontSize;
                
                offscreenCanvas.width = Math.max(1, Math.ceil(textWidth));
                offscreenCanvas.height = Math.max(1, Math.ceil(textHeight));
                
                // Re-apply font & draw (important after canvas resize)
                offCtx.font = `bold ${dynamicFontSize}px ${config.nativeTextRenderFontFamily}`;
                offCtx.fillStyle = '#FFFFFF'; // Render white text on transparent for sampling alpha
                offCtx.textAlign = 'left'; 
                offCtx.textBaseline = 'top';
                offCtx.clearRect(0,0, offscreenCanvas.width, offscreenCanvas.height); // Clear with transparent
                offCtx.fillText(textToRender, 0, 0);

                const imageData = offCtx.getImageData(0, 0, offscreenCanvas.width, offscreenCanvas.height);
                const data = imageData.data;

                // Number of pixel boxes to fit into the *contentRender* area
                const numPixelCols = Math.floor(contentRenderWidth / config.textPixelSize);
                const numPixelRows = Math.floor(contentRenderHeight / config.textPixelSize);
                
                if (numPixelCols <= 0 || numPixelRows <=0) {
                     pixelatedTextData = { width: 0, height: 0, data: [] }; return;
                }

                pixelatedTextData.width = numPixelCols;
                pixelatedTextData.height = numPixelRows;
                pixelatedTextData.data = [];

                for (let r = 0; r < numPixelRows; r++) {
                    for (let c = 0; c < numPixelCols; c++) {
                        const sourceX = Math.floor(c * (offscreenCanvas.width / numPixelCols));
                        const sourceY = Math.floor(r * (offscreenCanvas.height / numPixelRows));
                        
                        // More robust sampling: check center of source pixel mapped from target
                        const sampleSourceX = Math.min(offscreenCanvas.width - 1, Math.floor(sourceX + (offscreenCanvas.width / numPixelCols) * 0.5));
                        const sampleSourceY = Math.min(offscreenCanvas.height - 1, Math.floor(sourceY + (offscreenCanvas.height / numPixelRows) * 0.5));

                        const alphaIndex = (sampleSourceY * offscreenCanvas.width + sampleSourceX) * 4 + 3;
                        const alphaVal = data[alphaIndex];
                        pixelatedTextData.data.push(alphaVal > 128 ? 1 : 0); // Threshold for "on"
                    }
                }
                console.log(`Pixelated "${phraseObj.text}" (font: ${dynamicFontSize}px) to ${numPixelCols}x${numPixelRows} boxes.`);
            }

            function drawPixelatedText() {
                if (!pixelatedTextData.data.length || pixelatedTextData.width === 0) return;

                const totalPixelatedWidth = pixelatedTextData.width * config.textPixelSize;
                const totalPixelatedHeight = pixelatedTextData.height * config.textPixelSize;

                // Centering within the padded content area
                const contentRenderWidth = textDisplayArea.width - 2 * textDisplayArea.padding;
                const contentRenderHeight = textDisplayArea.height - 2 * textDisplayArea.padding;

                const startDrawX = textDisplayArea.x + textDisplayArea.padding + Math.floor((contentRenderWidth - totalPixelatedWidth) / 2);
                const startDrawY = textDisplayArea.y + textDisplayArea.padding + Math.floor((contentRenderHeight - totalPixelatedHeight) / 2);

                ctx.fillStyle = config.textPixelOnColor;
                for (let r = 0; r < pixelatedTextData.height; r++) {
                    for (let c = 0; c < pixelatedTextData.width; c++) {
                        if (pixelatedTextData.data[r * pixelatedTextData.width + c] === 1) {
                            ctx.fillRect(
                                startDrawX + c * config.textPixelSize,
                                startDrawY + r * config.textPixelSize,
                                config.textPixelSize,
                                config.textPixelSize
                            );
                        }
                    }
                }
            }

            function setupAndRun() {
                if (animationFrameId) cancelAnimationFrame(animationFrameId);
                
                SimplexNoise.shufflePermutations();
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                
                numCols = Math.floor(canvas.width / config.backgroundFontSize);
                numRows = Math.floor(canvas.height / config.backgroundFontSize);
                
                textDisplayArea.width = Math.floor(canvas.width * config.textAreaWidthRatio);
                textDisplayArea.height = Math.floor(canvas.height * config.textAreaHeightRatio);
                textDisplayArea.x = Math.floor((canvas.width - textDisplayArea.width) / 2);
                textDisplayArea.y = Math.floor((canvas.height - textDisplayArea.height) / 2);
                textDisplayArea.padding = Math.floor(Math.min(textDisplayArea.width, textDisplayArea.height) * config.textPaddingRatio);


                borderRectCells.startCol = Math.max(0, Math.floor(textDisplayArea.x / config.backgroundFontSize) -1);
                borderRectCells.endCol = Math.min(numCols, Math.ceil((textDisplayArea.x + textDisplayArea.width) / config.backgroundFontSize) +1);
                borderRectCells.startRow = Math.max(0, Math.floor(textDisplayArea.y / config.backgroundFontSize) -1);
                borderRectCells.endRow = Math.min(numRows, Math.ceil((textDisplayArea.y + textDisplayArea.height) / config.backgroundFontSize) +1);

                grid = [];
                for (let r = 0; r < numRows; r++) {
                    let rowCells = []; for (let c = 0; c < numCols; c++) { rowCells.push(new GridCell(c, r));}
                    grid.push(rowCells);
                }
                console.log(`BG Grid: ${numCols}x${numRows}, Font: ${config.backgroundFontSize}px. Pixel Box: ${config.textPixelSize}px`);
                console.log(`Text Area (pixels): x:${textDisplayArea.x}, y:${textDisplayArea.y}, w:${textDisplayArea.width}, h:${textDisplayArea.height}, pad:${textDisplayArea.padding}`);

                renderAndPixelateCurrentPhrase(); 
                lastPhraseChangeTime = performance.now();

                ctx.font = `${config.backgroundFontSize}px monospace`;
                ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; 
                time = Math.random() * 1000; 
                animate();
            }
            
            let lastFrameTime = performance.now();
            const targetFPS = 25; 
            const frameInterval = 1000 / targetFPS;

            function animate() {
                animationFrameId = requestAnimationFrame(animate);
                const now = performance.now(); const elapsed = now - lastFrameTime;

                if (elapsed > frameInterval) {
                    lastFrameTime = now - (elapsed % frameInterval);
                    time += config.timeScale * 0.1; 

                    if (now - lastPhraseChangeTime > config.phraseChangeInterval) {
                        currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
                        renderAndPixelateCurrentPhrase();
                        lastPhraseChangeTime = now;
                    }
                    ctx.fillStyle = config.canvasClearColor; ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.font = `${config.backgroundFontSize}px monospace`; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
                    for (let r = 0; r < numRows; r++) {
                        for (let c = 0; c < numCols; c++) {
                            const noiseVal = (SimplexNoise.noise3D(c*config.noiseScale,r*config.noiseScale,time)+1)/2; 
                            grid[r][c].update(noiseVal); grid[r][c].draw();
                        }
                    }
                    drawPixelatedText();
                }
            }
            
            setupAndRun();
            let resizeTimeout;
            window.addEventListener('resize', () => {clearTimeout(resizeTimeout); resizeTimeout = setTimeout(setupAndRun, 300);});
            console.log('Hybrid animation with larger text setup complete');
        } catch (error) { /* ... error handling ... */
            console.error('Animation initialization failed:', error);
            const errorElement = document.createElement('div');
            Object.assign(errorElement.style, { position: 'fixed', top: '10px', left: '10px', background: 'rgba(255,0,0,0.8)', color: 'white', padding: '15px', zIndex: '10000', border: '1px solid white', borderRadius: '5px', maxWidth: 'calc(100% - 20px)', fontSize: '12px' });
            errorElement.innerHTML = `<strong>Animation Error:</strong><br>${error.message}<br><small>Check console (F12).</small>`;
            if (document.body) document.body.appendChild(errorElement); else document.addEventListener('DOMContentLoaded', () => document.body.appendChild(errorElement));
        }
    }
    ready(initAnimation);
    window.addEventListener('load', () => { const bgC = document.querySelector('.background-animation'); if (bgC && !bgC.querySelector('canvas')) { initAnimation(); } });
})();