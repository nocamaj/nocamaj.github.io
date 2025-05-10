// Wrap in an IIFE
(function() {
    console.log('Hybrid Grid ASCII with Fading Pixelated Text animation loading...');

    const SimplexNoise = (() => { // ... (Simplex Noise code - remains unchanged)
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

    const phrases = [ // Same phrases as before, including Portuguese
        { lang: "English", text: "Hello, I'm Noah" }, { lang: "Chinese", text: "你好，我是诺亚" }, 
        { lang: "Russian", text: "Привет, я Ноа" }, { lang: "Hindi", text: "नमस्ते, मैं नोआ हूँ" }, 
        { lang: "Japanese", text: "こんにちは、ノアです" }, { lang: "Arabic", text: "مرحباً، أنا نوح" }, 
        { lang: "Spanish", text: "Hola, soy Noah" }, { lang: "French", text: "Bonjour, je suis Noah" },
        { lang: "German", text: "Hallo, ich bin Noah" }, { lang: "Portuguese", text: "Olá, sou Noah" }
    ];

    function ready(callback) { if (document.readyState !== 'loading') callback(); else document.addEventListener('DOMContentLoaded', callback); }

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
                backgroundFontSize: 12, textPixelSize: 2, 
                nativeTextRenderFontBaseSize: 72, 
                nativeTextRenderFontFamily: "Arial, Noto Sans, Noto Sans JP, Noto Sans SC, Noto Sans KR, Noto Naskh Arabic, sans-serif",
                charSet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$*#@&?", 
                baseColor: 'rgba(180, 200, 255, VAL)', highlightColor: 'rgba(230, 240, 255, VAL)',
                borderColor: 'rgba(220, 220, 255, 0.8)',
                borderChar: { corner: '+', top_bottom: '-', side: '|' },
                textPixelOnColor: 'rgba(250, 250, 255, VAL_ALPHA)', // VAL_ALPHA for fade
                canvasClearColor: 'rgba(10, 10, 25, 1)', 
                noiseScale: 0.08, timeScale: 0.08, activationThreshold: 0.3, highlightThreshold: 0.65, 
                fadeSpeed: 0.1, charChangeProbability: 0.03,
                // Timing for text transitions
                phraseStableDisplayDuration: 4000, // ms phrase stays fully visible
                textTransitionDuration: 1000, // ms for fade in/out
                textAreaWidthRatio: 0.375, textAreaHeightRatio: 0.15, textPaddingRatio: 0.08, 
            };
            
            let currentPhraseIndex = 0;
            let lastPhraseChangeTime = 0; // Marks the beginning of stable display or end of transition
            
            let currentPixelatedTextData = { width: 0, height: 0, data: [] }; 
            let outgoingPixelatedTextData = null; // For the text fading out
            let isTextTransitioning = false;
            let textTransitionProgress = 0; // 0 to 1

            let textDisplayArea = { x:0,y:0,width:0,height:0,padding:0 };
            let borderRectCells = { startCol:0,endCol:0,startRow:0,endRow:0 };

            class GridCell {
                constructor(col, row) {
                    this.col = col; this.row = row; this.char = getRandomChar();
                    this.currentAlpha = 0; this.targetAlpha = 0;
                    this.colorTemplate = config.baseColor; this.isBorder = false;
                    this.borderRole = null; this.isWithinTextDisplayInterior = false; // NEW: True if inside border, not border itself
                }
                update(noiseValue) {
                    const isTopBorder = this.row === borderRectCells.startRow;
                    const isBottomBorder = this.row === borderRectCells.endRow - 1;
                    const isLeftBorder = this.col === borderRectCells.startCol;
                    const isRightBorder = this.col === borderRectCells.endCol - 1;

                    this.isBorder = (isLeftBorder || isRightBorder) && (this.row >= borderRectCells.startRow && this.row < borderRectCells.endRow) ||
                                    (isTopBorder || isBottomBorder) && (this.col >= borderRectCells.startCol && this.col < borderRectCells.endCol);

                    // Check if cell is strictly inside the border
                    this.isWithinTextDisplayInterior = 
                        this.col > borderRectCells.startCol && this.col < borderRectCells.endCol - 1 &&
                        this.row > borderRectCells.startRow && this.row < borderRectCells.endRow - 1;
                    
                    if (this.isBorder) {
                        this.targetAlpha = 0.7 + (Math.sin(time * 2 + this.col + this.row) + 1) * 0.15;
                        this.colorTemplate = config.borderColor.replace('VAL', this.targetAlpha.toFixed(2)); // Border has fixed alpha here
                        if ((isTopBorder && isLeftBorder) || (isTopBorder && isRightBorder) || (isBottomBorder && isLeftBorder) || (isBottomBorder && isRightBorder)) { this.char = config.borderChar.corner; }
                        else if (isTopBorder || isBottomBorder) { this.char = config.borderChar.top_bottom; }
                        else if (isLeftBorder || isRightBorder) { this.char = config.borderChar.side; }
                    } else if (this.isWithinTextDisplayInterior) {
                        this.targetAlpha = 0; // Force interior (non-border part of text area) to be transparent
                        this.char = '';       // No character for these cells
                    } else { // Regular background cell
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
                    if (this.currentAlpha > 0.001) { // Allow border to draw even if low targetAlpha due to direct color set
                         if(this.isBorder) {
                            ctx.fillStyle = this.colorTemplate; // Already has alpha from borderColor or pulsing
                         } else {
                            ctx.fillStyle = this.colorTemplate.replace('VAL', this.currentAlpha.toFixed(2));
                         }
                        ctx.fillText(this.char, this.col*config.backgroundFontSize + config.backgroundFontSize*0.5, this.row*config.backgroundFontSize + config.backgroundFontSize*0.7);
                    }
                }
            }

            function getRandomChar() { return config.charSet.charAt(Math.floor(Math.random() * config.charSet.length)); }
            function clonePixelatedData(dataToClone) {
                if (!dataToClone || !dataToClone.data) return { width: 0, height: 0, data: [] };
                return { width: dataToClone.width, height: dataToClone.height, data: dataToClone.data.slice() };
            }

            function renderAndPixelateCurrentPhrase(targetDataStore) { // TargetDataStore can be currentPixelatedTextData
                const phraseObj = phrases[currentPhraseIndex];
                const textToRender = phraseObj.text;
                const contentRenderWidth = textDisplayArea.width - 2 * textDisplayArea.padding;
                const contentRenderHeight = textDisplayArea.height - 2 * textDisplayArea.padding;
                if (contentRenderWidth <=0 || contentRenderHeight <=0) {targetDataStore.width=0; targetDataStore.height=0; targetDataStore.data=[]; return;}
                let dynamicFontSize = config.nativeTextRenderFontBaseSize;
                offCtx.font = `bold ${dynamicFontSize}px ${config.nativeTextRenderFontFamily}`;
                let tm = offCtx.measureText(textToRender); let th = tm.actualBoundingBoxAscent+tm.actualBoundingBoxDescent; th=(th&&!isNaN(th)&&th>0)?th:dynamicFontSize;
                if(th > contentRenderHeight && contentRenderHeight > 0){dynamicFontSize=Math.floor(dynamicFontSize*(contentRenderHeight/th));}
                else if(th < contentRenderHeight*0.7 && th > 0){dynamicFontSize=Math.floor(dynamicFontSize*(contentRenderHeight*0.85/th));}
                dynamicFontSize=Math.max(8,dynamicFontSize); offCtx.font=`bold ${dynamicFontSize}px ${config.nativeTextRenderFontFamily}`;
                tm=offCtx.measureText(textToRender);th=(tm.actualBoundingBoxAscent+tm.actualBoundingBoxDescent);th=(th&&!isNaN(th)&&th>0)?th:dynamicFontSize;let tw=tm.width;
                if(tw > contentRenderWidth && contentRenderWidth > 0){dynamicFontSize=Math.floor(dynamicFontSize*(contentRenderWidth/tw));}
                dynamicFontSize=Math.max(8,dynamicFontSize); offCtx.font=`bold ${dynamicFontSize}px ${config.nativeTextRenderFontFamily}`;
                tm=offCtx.measureText(textToRender);tw=tm.width;th=(tm.actualBoundingBoxAscent+tm.actualBoundingBoxDescent);th=(th&&!isNaN(th)&&th>0)?th:dynamicFontSize;
                offscreenCanvas.width=Math.max(1,Math.ceil(tw)); offscreenCanvas.height=Math.max(1,Math.ceil(th));
                offCtx.font=`bold ${dynamicFontSize}px ${config.nativeTextRenderFontFamily}`; offCtx.fillStyle='#FFFFFF'; offCtx.textAlign='left';offCtx.textBaseline='top';
                offCtx.clearRect(0,0,offscreenCanvas.width,offscreenCanvas.height); offCtx.fillText(textToRender,0,0);
                const iData=offCtx.getImageData(0,0,offscreenCanvas.width,offscreenCanvas.height);const d=iData.data;
                const nPC=Math.floor(contentRenderWidth/config.textPixelSize);const nPR=Math.floor(contentRenderHeight/config.textPixelSize);
                if(nPC<=0||nPR<=0){targetDataStore.width=0;targetDataStore.height=0;targetDataStore.data=[];return;}
                targetDataStore.width=nPC; targetDataStore.height=nPR; targetDataStore.data=[];
                for(let r=0;r<nPR;r++){for(let c=0;c<nPC;c++){
                    const sX=Math.floor(c*(offscreenCanvas.width/nPC));const sY=Math.floor(r*(offscreenCanvas.height/nPR));
                    const sSX=Math.min(offscreenCanvas.width-1,Math.floor(sX+(offscreenCanvas.width/nPC)*0.5));
                    const sSY=Math.min(offscreenCanvas.height-1,Math.floor(sY+(offscreenCanvas.height/nPR)*0.5));
                    const aI=(sSY*offscreenCanvas.width+sSX)*4+3;const aV=d[aI];targetDataStore.data.push(aV>128?1:0);
                }}
            }

            function drawPixelatedTextInstance(pixelData, alphaMultiplier = 1) {
                if (!pixelData || !pixelData.data.length || pixelData.width === 0) return;
                const totalPixelatedWidth = pixelData.width * config.textPixelSize;
                const totalPixelatedHeight = pixelData.height * config.textPixelSize;
                const contentRenderWidth = textDisplayArea.width - 2 * textDisplayArea.padding;
                const contentRenderHeight = textDisplayArea.height - 2 * textDisplayArea.padding;
                const startDrawX = textDisplayArea.x + textDisplayArea.padding + Math.floor((contentRenderWidth - totalPixelatedWidth) / 2);
                const startDrawY = textDisplayArea.y + textDisplayArea.padding + Math.floor((contentRenderHeight - totalPixelatedHeight) / 2);
                
                const baseColor = config.textPixelOnColor.substring(0, config.textPixelOnColor.lastIndexOf(',')) // "rgba(R,G,B"
                ctx.fillStyle = `${baseColor}, ${alphaMultiplier.toFixed(2)})`;

                for (let r = 0; r < pixelData.height; r++) {
                    for (let c = 0; c < pixelData.width; c++) {
                        if (pixelData.data[r * pixelData.width + c] === 1) {
                            ctx.fillRect(startDrawX+c*config.textPixelSize,startDrawY+r*config.textPixelSize,config.textPixelSize,config.textPixelSize);
                        }
                    }
                }
            }
            
            function setupAndRun() {
                if(animationFrameId)cancelAnimationFrame(animationFrameId);SimplexNoise.shufflePermutations();canvas.width=window.innerWidth;canvas.height=window.innerHeight;
                numCols=Math.floor(canvas.width/config.backgroundFontSize);numRows=Math.floor(canvas.height/config.backgroundFontSize);
                textDisplayArea.width=Math.floor(canvas.width*config.textAreaWidthRatio);textDisplayArea.height=Math.floor(canvas.height*config.textAreaHeightRatio);
                textDisplayArea.x=Math.floor((canvas.width-textDisplayArea.width)/2);textDisplayArea.y=Math.floor((canvas.height-textDisplayArea.height)/2);
                textDisplayArea.padding=Math.floor(Math.min(textDisplayArea.width,textDisplayArea.height)*config.textPaddingRatio);
                borderRectCells.startCol=Math.max(0,Math.floor(textDisplayArea.x/config.backgroundFontSize)-1);borderRectCells.endCol=Math.min(numCols,Math.ceil((textDisplayArea.x+textDisplayArea.width)/config.backgroundFontSize)+1);
                borderRectCells.startRow=Math.max(0,Math.floor(textDisplayArea.y/config.backgroundFontSize)-1);borderRectCells.endRow=Math.min(numRows,Math.ceil((textDisplayArea.y+textDisplayArea.height)/config.backgroundFontSize)+1);
                grid=[];for(let r=0;r<numRows;r++){let rowCells=[];for(let c=0;c<numCols;c++){rowCells.push(new GridCell(c,r));}grid.push(rowCells);}
                renderAndPixelateCurrentPhrase(currentPixelatedTextData); // Initial phrase
                lastPhraseChangeTime = performance.now(); isTextTransitioning = false; textTransitionProgress = 0; outgoingPixelatedTextData = null;
                ctx.font=`${config.backgroundFontSize}px monospace`;ctx.textAlign='center';ctx.textBaseline='alphabetic';time=Math.random()*1000;animate();
            }
            
            let lastFrameDrawnTime = performance.now(); // Renamed from lastFrameTime for clarity
            const targetFPS = 25; const frameInterval = 1000 / targetFPS;

            function animate() {
                animationFrameId = requestAnimationFrame(animate);
                const now = performance.now(); const elapsed = now - lastFrameDrawnTime;

                if (elapsed >= frameInterval) {
                    lastFrameDrawnTime = now - (elapsed % frameInterval);
                    time += config.timeScale * 0.1 * (elapsed / frameInterval); // Scale time by actual elapsed vs target

                    // Text Transition Logic
                    if (isTextTransitioning) {
                        textTransitionProgress += (elapsed / config.textTransitionDuration);
                        if (textTransitionProgress >= 1) {
                            isTextTransitioning = false;
                            textTransitionProgress = 0;
                            outgoingPixelatedTextData = null; 
                            lastPhraseChangeTime = now; // New phrase stable display starts
                        }
                    } else if (now - lastPhraseChangeTime > config.phraseStableDisplayDuration) {
                        isTextTransitioning = true;
                        textTransitionProgress = 0;
                        outgoingPixelatedTextData = clonePixelatedData(currentPixelatedTextData);
                        currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
                        renderAndPixelateCurrentPhrase(currentPixelatedTextData); // Prepare new phrase data
                    }

                    ctx.fillStyle = config.canvasClearColor; ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.font = `${config.backgroundFontSize}px monospace`; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
                    for(let r=0;r<numRows;r++){for(let c=0;c<numCols;c++){
                        const noiseVal=(SimplexNoise.noise3D(c*config.noiseScale,r*config.noiseScale,time)+1)/2;
                        grid[r][c].update(noiseVal); grid[r][c].draw();
                    }}
                    
                    // Draw pixelated text with fade
                    if (isTextTransitioning) {
                        if (outgoingPixelatedTextData) {
                            drawPixelatedTextInstance(outgoingPixelatedTextData, 1 - textTransitionProgress);
                        }
                        drawPixelatedTextInstance(currentPixelatedTextData, textTransitionProgress);
                    } else {
                        drawPixelatedTextInstance(currentPixelatedTextData, 1); // Fully visible
                    }
                }
            }
            
            setupAndRun();
            let resizeTimeout; window.addEventListener('resize', () => {clearTimeout(resizeTimeout); resizeTimeout = setTimeout(setupAndRun, 300);});
            console.log('Hybrid animation with fading text and isolated rect setup complete');
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