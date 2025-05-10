// Wrap in an IIFE
(function() {
    console.log('Hybrid Grid ASCII V7: Page Specific Logic, Cursor Fix, Faster Scramble...');

    const SimplexNoise = (() => { /* ... Simplex Noise code unchanged ... */ 
        const F2=0.5*(Math.sqrt(3.0)-1.0);const G2=(3.0-Math.sqrt(3.0))/6.0;const F3=1.0/3.0;const G3=1.0/6.0;
        const grad3=new Float32Array([1,1,0,-1,1,0,1,-1,0,-1,-1,0,1,0,1,-1,0,1,1,0,-1,-1,0,-1,0,1,1,0,-1,1,0,1,-1,0,-1,-1,]);
        const p=new Uint8Array(256);for(let i=0;i<256;i++)p[i]=i;let perm=new Uint8Array(512);let permMod12=new Uint8Array(512);
        shufflePermutations();function shufflePermutations(){for(let i=255;i>0;i--){const r=Math.floor(Math.random()*(i+1));const temp=p[i];p[i]=p[r];p[r]=temp;}for(let i=0;i<512;i++){perm[i]=p[i&255];permMod12[i]=perm[i]%12;}}shufflePermutations();
        function noise3D(xin,yin,zin){let n0,n1,n2,n3;const s=(xin+yin+zin)*F3;const i=Math.floor(xin+s);const j=Math.floor(yin+s);const k=Math.floor(zin+s);const t=(i+j+k)*G3;const X0=i-t;const Y0=j-t;const Z0=k-t;const x0=xin-X0;const y0=yin-Y0;const z0=zin-Z0;let i1,j1,k1;let i2,j2,k2;if(x0>=y0){if(y0>=z0){i1=1;j1=0;k1=0;i2=1;j2=1;k2=0;}else if(x0>=z0){i1=1;j1=0;k1=0;i2=1;j2=0;k2=1;}else{i1=0;j1=0;k1=1;i2=1;j2=0;k2=1;}}else{if(y0<z0){i1=0;j1=0;k1=1;i2=0;j2=1;k2=1;}else if(x0<z0){i1=0;j1=1;k1=0;i2=0;j2=1;k2=1;}else{i1=0;j1=1;k1=0;i2=1;j2=1;k2=0;}}const x1=x0-i1+G3;const y1=y0-j1+G3;const z1=z0-k1+G3;const x2=x0-i2+2.0*G3;const y2=y0-j2+2.0*G3;const z2=z0-k2+2.0*G3;const x3=x0-1.0+3.0*G3;const y3=y0-1.0+3.0*G3;const z3=z0-1.0+3.0*G3;const ii=i&255;const jj=j&255;const kk=k&255;const gi0=permMod12[ii+perm[jj+perm[kk]]];const gi1=permMod12[ii+i1+perm[jj+j1+perm[kk+k1]]];const gi2=permMod12[ii+i2+perm[jj+j2+perm[kk+k2]]];const gi3=permMod12[ii+1+perm[jj+1+perm[kk+1]]];let t0=0.6-x0*x0-y0*y0-z0*z0;if(t0<0)n0=0.0;else{t0*=t0;n0=t0*t0*dot(grad3,gi0*3,x0,y0,z0);}let t1=0.6-x1*x1-y1*y1-z1*z1;if(t1<0)n1=0.0;else{t1*=t1;n1=t1*t1*dot(grad3,gi1*3,x1,y1,z1);}let t2=0.6-x2*x2-y2*y2-z2*z2;if(t2<0)n2=0.0;else{t2*=t2;n2=t2*t2*dot(grad3,gi2*3,x2,y2,z2);}let t3=0.6-x3*x3-y3*y3-z3*z3;if(t3<0)n3=0.0;else{t3*=t3;n3=t3*t3*dot(grad3,gi3*3,x3,y3,z3);}return 32.0*(n0+n1+n2+n3);}
        function dot(g,gIdx,x,y,z){return g[gIdx]*x+g[gIdx+1]*y+g[gIdx+2]*z;} return{noise3D,shufflePermutations};
    })();

    const phrases = [ /* ... same phrases ... */
        { lang: "English", text: "Hello, I'm Noah" }, { lang: "Chinese", text: "你好，我是诺亚" }, 
        { lang: "Russian", text: "Привет, я Ноа" }, { lang: "Hindi", text: "नमस्ते, मैं नोआ हूँ" }, 
        { lang: "Japanese", text: "こんにちは、ノアです" }, { lang: "Arabic", text: "مرحباً، أنا نوح" }, 
        { lang: "Spanish", text: "Hola, soy Noah" }, { lang: "French", text: "Bonjour, je suis Noah" },
        { lang: "German", text: "Hallo, ich bin Noah" }, { lang: "Portuguese", text: "Olá, sou Noah" }
    ];
    const visitedCountryCodes = ["US", "CA", "PE", "RS", "HR", "AL", "CN", "AE", "ES"];

    function ready(callback) { if (document.readyState !== 'loading') callback(); else document.addEventListener('DOMContentLoaded', callback); }

    function initSiteFeatures() { 
        const backgroundContainer = document.querySelector('.background-animation');
        const canvas = backgroundContainer ? backgroundContainer.querySelector('canvas') : null;
        const offscreenCanvas = document.createElement('canvas');

        if (!canvas) { console.error('Main canvas element not found!'); return; }
        if (!backgroundContainer) { console.error('.background-animation container not found!'); return; }
        
        const ctx = canvas.getContext('2d', { willReadFrequently: false }); 
        const offCtx = offscreenCanvas.getContext('2d', { willReadFrequently: true });
        if (!ctx || !offCtx) { console.error('Failed to get 2D context'); return; }

        let animationFrameId; let grid = []; let numCols, numRows; let time = Math.random() * 1000;
        let mouseX = -10000, mouseY = -10000; 

        const isHomePage = canvas.dataset.page === 'home'; // Check if it's the homepage canvas

        const config = {
            backgroundFontSize: 12, textPixelSize: 2, 
            nativeTextRenderFontFamily: "Arial, Noto Sans, Noto Sans JP, Noto Sans SC, Noto Sans KR, Noto Naskh Arabic, sans-serif",
            nativeTextTargetHeightRatio: 0.80, minNativeRenderFontSize: 10,
            charSet: "ABCDEFGHIJKLMN0PQRSTUVWXYZ123456789$*#@&?", 
            baseColor: 'rgba(180, 200, 255, VAL)', highlightColor: 'rgba(230, 240, 255, VAL)',
            borderColor: 'rgba(220, 220, 255, 0.8)',
            borderChar: { corner:'+', top_bottom:'-', side:'|' },
            textPixelOnColor: 'rgba(250, 250, 255, 1)',
            canvasClearColor: 'rgba(10, 10, 25, 1)', 
            noiseScale: 0.08, timeScale: 0.08, activationThreshold: 0.3, highlightThreshold: 0.65, 
            fadeSpeed: 0.15, charChangeProbability: 0.03,
            phraseStableDisplayDuration: 7000, 
            textTransitionDuration: 350,    
            textAreaWidthRatio: 0.375, textAreaHeightRatio: 0.15, textPaddingRatio: 0.1,
            cursorInteractionRadius: 70,    
            cursorVanishStrength: 0.95,     
            cursorVanishFalloff: 2.0,       
        };
        
        let currentPhraseIndex = 0; let lastPhraseChangeTime = 0;
        let currentPixelatedTextData = { width:0,height:0,data:[] }; 
        let outgoingPixelatedTextData = null; 
        let transitionDisplayPixelData = { width:0,height:0,data:[] }; 
        let isTextTransitioning = false; let textTransitionProgress = 0;

        let textDisplayArea = { x:0,y:0,width:0,height:0,padding:0 };
        let borderRectCells = { startCol:0,endCol:0,startRow:0,endRow:0 };

        class GridCell { /* ... GridCell class mostly unchanged, ensure cursor interaction is effective ... */ 
            constructor(col, row) {
                this.col=col; this.row=row; this.char=getRandomChar(); this.currentAlpha=0; this.targetAlpha=0;
                this.colorTemplate=config.baseColor; this.isBorder=false; this.borderRole=null; this.isWithinTextDisplayInterior=false;
            }
            update(noiseValue) {
                const isTopB=this.row===borderRectCells.startRow;const isBottomB=this.row===borderRectCells.endRow-1;
                const isLeftB=this.col===borderRectCells.startCol;const isRightB=this.col===borderRectCells.endCol-1;
                this.isBorder=(isLeftB||isRightB)&&(this.row>=borderRectCells.startRow&&this.row<borderRectCells.endRow)||(isTopB||isBottomB)&&(this.col>=borderRectCells.startCol&&this.col<borderRectCells.endCol);
                this.isWithinTextDisplayInterior = isHomePage && this.col>borderRectCells.startCol&&this.col<borderRectCells.endCol-1&&this.row>borderRectCells.startRow&&this.row<borderRectCells.endRow-1;
                
                let baseTargetAlpha = 0;
                if (noiseValue > config.activationThreshold) {
                    baseTargetAlpha = Math.min(1, (noiseValue - config.activationThreshold) / (1 - config.activationThreshold) * 1.2);
                }

                if (this.isBorder && isHomePage) { // Border only on homepage for now
                    this.targetAlpha = 0.7 + (Math.sin(time * 2.5 + this.col * 0.2 + this.row * 0.3) + 1) * 0.15; 
                    this.colorTemplate = config.borderColor.replace('VAL', this.targetAlpha.toFixed(2));
                    if((isTopB&&isLeftB)||(isTopB&&isRightB)||(isBottomB&&isLeftB)||(isBottomB&&isRightB)){this.char=config.borderChar.corner;}
                    else if(isTopB||isBottomB){this.char=config.borderChar.top_bottom;} else if(isLeftB||isRightB){this.char=config.borderChar.side;}
                } else if (this.isWithinTextDisplayInterior && isHomePage) {
                    this.targetAlpha = 0; this.char = ''; 
                } else { 
                    this.targetAlpha = baseTargetAlpha;
                    if (this.targetAlpha > 0.01) {
                        if (this.currentAlpha < 0.1 || Math.random() < config.charChangeProbability) { this.char = getRandomChar(); }
                        this.colorTemplate = (noiseValue > config.highlightThreshold && this.targetAlpha > 0.5) ? config.highlightColor : config.baseColor;
                    } else {
                        this.char = getRandomChar(); this.colorTemplate = config.baseColor;
                    }
                    const cellX = (this.col + 0.5) * config.backgroundFontSize;
                    const cellY = (this.row + 0.5) * config.backgroundFontSize;
                    const distToCursor = Math.sqrt(Math.pow(cellX - mouseX, 2) + Math.pow(cellY - mouseY, 2));
                    if (distToCursor < config.cursorInteractionRadius) {
                        const proximityFactor = Math.max(0, 1 - (distToCursor / config.cursorInteractionRadius));
                        const vanishAmount = Math.pow(proximityFactor, config.cursorVanishFalloff) * config.cursorVanishStrength;
                        this.targetAlpha *= (1 - vanishAmount);
                    }
                }
                this.currentAlpha += (this.targetAlpha - this.currentAlpha) * config.fadeSpeed;
                if(Math.abs(this.currentAlpha-this.targetAlpha)<0.01)this.currentAlpha=this.targetAlpha;
            }
            draw() { /* ... unchanged ... */ 
                if (this.currentAlpha > 0.001) { 
                     if(this.isBorder && isHomePage) { ctx.fillStyle = this.colorTemplate; } 
                     else { ctx.fillStyle = this.colorTemplate.replace('VAL', this.currentAlpha.toFixed(2)); }
                    ctx.fillText(this.char, this.col*config.backgroundFontSize + config.backgroundFontSize*0.5, this.row*config.backgroundFontSize + config.backgroundFontSize*0.7);
                }
            }
        }

        function getRandomChar() {return config.charSet.charAt(Math.floor(Math.random()*config.charSet.length));}
        function clonePixelatedData(dataToClone) { /* ... unchanged ... */ if(!dataToClone||!dataToClone.data)return{width:0,height:0,data:[]}; return{width:dataToClone.width,height:dataToClone.height,data:dataToClone.data.slice()};}
        function renderAndPixelateCurrentPhrase(targetDataStore) { /* ... unchanged ... */ 
            const phraseObj=phrases[currentPhraseIndex];const textToRender=phraseObj.text;
            const contentRenderWidth=textDisplayArea.width-2*textDisplayArea.padding;const contentRenderHeight=textDisplayArea.height-2*textDisplayArea.padding;
            if(contentRenderWidth<=0||contentRenderHeight<=0){targetDataStore.width=0;targetDataStore.height=0;targetDataStore.data=[];return;}
            let dynamicFontSize=config.minNativeRenderFontSize;let textHeight=0;
            for(let fs=config.minNativeRenderFontSize;fs<200;fs++){offCtx.font=`bold ${fs}px ${config.nativeTextRenderFontFamily}`;const metrics=offCtx.measureText("Tg");textHeight=metrics.actualBoundingBoxAscent+metrics.actualBoundingBoxDescent;if(textHeight>=contentRenderHeight*config.nativeTextTargetHeightRatio||textHeight>=contentRenderHeight){dynamicFontSize=fs;break;}dynamicFontSize=fs;}
            dynamicFontSize=Math.max(config.minNativeRenderFontSize,dynamicFontSize);
            offCtx.font=`bold ${dynamicFontSize}px ${config.nativeTextRenderFontFamily}`;let textMetrics=offCtx.measureText(textToRender);let textWidth=textMetrics.width;
            if(textWidth>contentRenderWidth&&contentRenderWidth>0){dynamicFontSize=Math.floor(dynamicFontSize*(contentRenderWidth/textWidth));}dynamicFontSize=Math.max(config.minNativeRenderFontSize,dynamicFontSize);
            offCtx.font=`bold ${dynamicFontSize}px ${config.nativeTextRenderFontFamily}`;textMetrics=offCtx.measureText(textToRender);textWidth=textMetrics.width;textHeight=(textMetrics.actualBoundingBoxAscent+textMetrics.actualBoundingBoxDescent);textHeight=(textHeight&&!isNaN(textHeight)&&textHeight>0)?textHeight:dynamicFontSize;
            offscreenCanvas.width=Math.max(1,Math.ceil(textWidth));offscreenCanvas.height=Math.max(1,Math.ceil(textHeight));
            offCtx.font=`bold ${dynamicFontSize}px ${config.nativeTextRenderFontFamily}`;offCtx.fillStyle='#FFFFFF';offCtx.textAlign='center';offCtx.textBaseline='middle';offCtx.clearRect(0,0,offscreenCanvas.width,offscreenCanvas.height);offCtx.fillText(textToRender,offscreenCanvas.width/2,offscreenCanvas.height/2);
            const iData=offCtx.getImageData(0,0,offscreenCanvas.width,offscreenCanvas.height);const d=iData.data;
            const nPC=Math.floor(contentRenderWidth/config.textPixelSize);const nPR=Math.floor(contentRenderHeight/config.textPixelSize);
            if(nPC<=0||nPR<=0){targetDataStore.width=0;targetDataStore.height=0;targetDataStore.data=[];return;}
            targetDataStore.width=nPC;targetDataStore.height=nPR;targetDataStore.data=[];
            for(let r=0;r<nPR;r++){for(let c=0;c<nPC;c++){const sX=Math.floor(c*(offscreenCanvas.width/nPC));const sY=Math.floor(r*(offscreenCanvas.height/nPR));const sSX=Math.min(offscreenCanvas.width-1,Math.floor(sX+(offscreenCanvas.width/nPC)*0.5));const sSY=Math.min(offscreenCanvas.height-1,Math.floor(sY+(offscreenCanvas.height/nPR)*0.5));const aI=(sSY*offscreenCanvas.width+sSX)*4+3;const aV=d[aI];targetDataStore.data.push(aV>128?1:0);}}
        }
        function drawPixelatedTextScramble() { /* ... unchanged ... */ 
            if(!isHomePage || !transitionDisplayPixelData.data.length||transitionDisplayPixelData.width===0)return;
            const totalPixelatedWidth = transitionDisplayPixelData.width*config.textPixelSize;const totalPixelatedHeight=transitionDisplayPixelData.height*config.textPixelSize;
            const contentRenderWidth = textDisplayArea.width-2*textDisplayArea.padding;const contentRenderHeight=textDisplayArea.height-2*textDisplayArea.padding;
            const startDrawX = textDisplayArea.x+textDisplayArea.padding+Math.floor((contentRenderWidth-totalPixelatedWidth)/2);
            const startDrawY = textDisplayArea.y+textDisplayArea.padding+Math.floor((contentRenderHeight-totalPixelatedHeight)/2);
            ctx.fillStyle=config.textPixelOnColor;
            for(let r=0;r<transitionDisplayPixelData.height;r++){for(let c=0;c<transitionDisplayPixelData.width;c++){if(transitionDisplayPixelData.data[r*transitionDisplayPixelData.width+c]===1){ctx.fillRect(startDrawX+c*config.textPixelSize,startDrawY+r*config.textPixelSize,config.textPixelSize,config.textPixelSize);}}}
        }
        function computeTransitionFrame() { /* ... unchanged ... */ 
            if(!currentPixelatedTextData.data.length||!outgoingPixelatedTextData||!outgoingPixelatedTextData.data.length){transitionDisplayPixelData=clonePixelatedData(currentPixelatedTextData);return;}
            if(transitionDisplayPixelData.width!==currentPixelatedTextData.width||transitionDisplayPixelData.height!==currentPixelatedTextData.height){transitionDisplayPixelData.width=currentPixelatedTextData.width;transitionDisplayPixelData.height=currentPixelatedTextData.height;transitionDisplayPixelData.data=new Array(currentPixelatedTextData.width*currentPixelatedTextData.height).fill(0);}
            const totalPixels=transitionDisplayPixelData.width*transitionDisplayPixelData.height;
            for(let i=0;i<totalPixels;i++){const oldOn=outgoingPixelatedTextData.data[i]===1;const newOn=currentPixelatedTextData.data[i]===1;let shouldBeOn=0;if(oldOn&&!newOn){shouldBeOn=(Math.random()>textTransitionProgress)?1:0;}else if(!oldOn&&newOn){shouldBeOn=(Math.random()<textTransitionProgress)?1:0;}else if(newOn){shouldBeOn=1;}else{shouldBeOn=0;}transitionDisplayPixelData.data[i]=shouldBeOn;}
        }
        function setupAndRun() { /* ... setupAndRun largely unchanged ... */
            if(animationFrameId)cancelAnimationFrame(animationFrameId);SimplexNoise.shufflePermutations();canvas.width=window.innerWidth;canvas.height=window.innerHeight;
            numCols=Math.floor(canvas.width/config.backgroundFontSize);numRows=Math.floor(canvas.height/config.backgroundFontSize);
            if(isHomePage) { // Only setup text display area for homepage
                textDisplayArea.width=Math.floor(canvas.width*config.textAreaWidthRatio);textDisplayArea.height=Math.floor(canvas.height*config.textAreaHeightRatio);
                textDisplayArea.x=Math.floor((canvas.width-textDisplayArea.width)/2);textDisplayArea.y=Math.floor((canvas.height-textDisplayArea.height)/2);
                textDisplayArea.padding=Math.floor(Math.min(textDisplayArea.width,textDisplayArea.height)*config.textPaddingRatio);
                borderRectCells.startCol=Math.max(0,Math.floor(textDisplayArea.x/config.backgroundFontSize)-1);borderRectCells.endCol=Math.min(numCols,Math.ceil((textDisplayArea.x+textDisplayArea.width)/config.backgroundFontSize)+1);
                borderRectCells.startRow=Math.max(0,Math.floor(textDisplayArea.y/config.backgroundFontSize)-1);borderRectCells.endRow=Math.min(numRows,Math.ceil((textDisplayArea.y+textDisplayArea.height)/config.backgroundFontSize)+1);
            }
            grid=[];for(let r=0;r<numRows;r++){let rowCells=[];for(let c=0;c<numCols;c++){rowCells.push(new GridCell(c,r));}grid.push(rowCells);}
            if(isHomePage) {
                renderAndPixelateCurrentPhrase(currentPixelatedTextData); 
                transitionDisplayPixelData = clonePixelatedData(currentPixelatedTextData); 
                lastPhraseChangeTime=performance.now(); isTextTransitioning=false; textTransitionProgress=0; outgoingPixelatedTextData=null;
            }
            ctx.font=`${config.backgroundFontSize}px monospace`;ctx.textAlign='center';ctx.textBaseline='alphabetic';time=Math.random()*1000;animate();
        }
        
        let lastFrameDrawnTime = performance.now(); 
        const targetFPS = 30; const frameInterval = 1000 / targetFPS;

        function animate() { /* ... animate loop largely unchanged ... */
            animationFrameId = requestAnimationFrame(animate);
            const now = performance.now(); const elapsed = now - lastFrameDrawnTime;
            if (elapsed >= frameInterval) {
                lastFrameDrawnTime = now - (elapsed % frameInterval); time += config.timeScale * 0.1 * (elapsed / frameInterval);
                if (isHomePage && isTextTransitioning) {
                    textTransitionProgress += (elapsed / config.textTransitionDuration); computeTransitionFrame(); 
                    if (textTransitionProgress >= 1) { isTextTransitioning = false; textTransitionProgress = 0; outgoingPixelatedTextData = null; transitionDisplayPixelData = clonePixelatedData(currentPixelatedTextData); lastPhraseChangeTime = now; }
                } else if (isHomePage && now - lastPhraseChangeTime > config.phraseStableDisplayDuration) {
                    isTextTransitioning = true; textTransitionProgress = 0; outgoingPixelatedTextData = clonePixelatedData(currentPixelatedTextData);
                    currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length; renderAndPixelateCurrentPhrase(currentPixelatedTextData);
                }
                ctx.fillStyle = config.canvasClearColor; ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.font = `${config.backgroundFontSize}px monospace`; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
                for(let r=0;r<numRows;r++){for(let c=0;c<numCols;c++){const noiseVal=(SimplexNoise.noise3D(c*config.noiseScale,r*config.scale,time)+1)/2;grid[r][c].update(noiseVal);grid[r][c].draw();}}
                if(isHomePage) drawPixelatedTextScramble(); 
            }
        }
        
        // --- Map Logic (runs only if map container exists) ---
        const mapContainer = document.getElementById('world-map-container');
        if (mapContainer) {
            loadAndDisplayWorldMap();
        }

        async function loadAndDisplayWorldMap() {
            try {
                let svgText = '';
                try {
                    const response = await fetch('world.svg'); 
                    if (!response.ok) throw new Error(`SVG not found: ${response.status}`);
                    svgText = await response.text();
                    mapContainer.innerHTML = svgText;
                    console.log("External world.svg loaded.");
                } catch (fetchError) {
                    console.warn("Failed to fetch world.svg:", fetchError.message, "Using placeholder.");
                    mapContainer.innerHTML = `<svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="100" fill="#2a2a3a" /><path id="US" class="country" d="M30,30 h30 v20 h-30 z" /><text x="45" y="45" fill="white" font-size="5" text-anchor="middle">US</text><text x="100" y="50" font-size="6" fill="#777" text-anchor="middle">Provide 'world.svg'</text></svg>`;
                }
                const svgElement = mapContainer.querySelector('svg');
                if (svgElement) {
                    visitedCountryCodes.forEach(code => {
                        const countryPath = svgElement.getElementById(code) || svgElement.querySelector(`[id$="${code.toUpperCase()}"]`) || svgElement.querySelector(`[id$="${code.toLowerCase()}"]`);
                        if (countryPath) countryPath.classList.add('visited');
                        else console.warn(`Map path not found for: ${code}`);
                    });
                }
            } catch (error) {
                console.error("Error loading map:", error);
                mapContainer.innerHTML = "<p>Could not load world map.</p>";
            }
        }

        // Mouse listeners on window for cursor effect on background
        window.addEventListener('mousemove', (event) => { mouseX = event.clientX; mouseY = event.clientY; }, false);
        window.addEventListener('mouseleave', () => { mouseX = -10000; mouseY = -10000; });
        window.addEventListener('mouseout', () => { mouseX = -10000; mouseY = -10000; });

        setupAndRun(); // Setup canvas and background animation
        let resizeTimeout; window.addEventListener('resize', () => {clearTimeout(resizeTimeout); resizeTimeout = setTimeout(setupAndRun, 300);});
    }
    ready(initSiteFeatures);
    window.addEventListener('load', () => { if (!document.querySelector('.background-animation canvas').getContext('2d')) { initSiteFeatures(); }});
})();