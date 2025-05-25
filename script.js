// Wrap in an IIFE
(function() {
    // Determine if we are on the homepage (e.g., by presence of footer search or specific ID)
    // Using the presence of the footer as an indicator for the homepage.
    const isHomepage = !!document.querySelector('footer .search-container');
    
    if (isHomepage) {
        console.log('Homepage detected: Initializing ASCII animation WITH central text.');
    } else {
        console.log('Not homepage: Initializing ASCII animation WITHOUT central text (background only).');
    }

    const SimplexNoise = (() => { // ... (Simplex Noise code - remains unchanged)
        const F2=0.5*(Math.sqrt(3.0)-1.0);const G2=(3.0-Math.sqrt(3.0))/6.0;const F3=1.0/3.0;const G3=1.0/6.0;
        const grad3=new Float32Array([1,1,0,-1,1,0,1,-1,0,-1,-1,0,1,0,1,-1,0,1,1,0,-1,-1,0,-1,0,1,1,0,-1,1,0,1,-1,0,-1,-1,]);
        const p=new Uint8Array(256);for(let i=0;i<256;i++)p[i]=i;let perm=new Uint8Array(512);let permMod12=new Uint8Array(512);
        shufflePermutations();function shufflePermutations(){for(let i=255;i>0;i--){const r=Math.floor(Math.random()*(i+1));const temp=p[i];p[i]=p[r];p[r]=temp;}for(let i=0;i<512;i++){perm[i]=p[i&255];permMod12[i]=perm[i]%12;}}shufflePermutations();
        function noise3D(xin,yin,zin){let n0,n1,n2,n3;const s=(xin+yin+zin)*F3;const i=Math.floor(xin+s);const j=Math.floor(yin+s);const k=Math.floor(zin+s);const t=(i+j+k)*G3;const X0=i-t;const Y0=j-t;const Z0=k-t;const x0=xin-X0;const y0=yin-Y0;const z0=zin-Z0;let i1,j1,k1;let i2,j2,k2;if(x0>=y0){if(y0>=z0){i1=1;j1=0;k1=0;i2=1;j2=1;k2=0;}else if(x0>=z0){i1=1;j1=0;k1=0;i2=1;j2=0;k2=1;}else{i1=0;j1=0;k1=1;i2=1;j2=0;k2=1;}}else{if(y0<z0){i1=0;j1=0;k1=1;i2=0;j2=1;k2=1;}else if(x0<z0){i1=0;j1=1;k1=0;i2=0;j2=1;k2=1;}else{i1=0;j1=1;k1=0;i2=1;j2=1;k2=0;}}const x1=x0-i1+G3;const y1=y0-j1+G3;const z1=z0-k1+G3;const x2=x0-i2+2.0*G3;const y2=y0-j2+2.0*G3;const z2=z0-k2+2.0*G3;const x3=x0-1.0+3.0*G3;const y3=y0-1.0+3.0*G3;const z3=z0-1.0+3.0*G3;const ii=i&255;const jj=j&255;const kk=k&255;const gi0=permMod12[ii+perm[jj+perm[kk]]];const gi1=permMod12[ii+i1+perm[jj+j1+perm[kk+k1]]];const gi2=permMod12[ii+i2+perm[jj+j2+perm[kk+k2]]];const gi3=permMod12[ii+1+perm[jj+1+perm[kk+1]]];let t0=0.6-x0*x0-y0*y0-z0*z0;if(t0<0)n0=0.0;else{t0*=t0;n0=t0*t0*dot(grad3,gi0*3,x0,y0,z0);}let t1=0.6-x1*x1-y1*y1-z1*z1;if(t1<0)n1=0.0;else{t1*=t1;n1=t1*t1*dot(grad3,gi1*3,x1,y1,z1);}let t2=0.6-x2*x2-y2*y2-z2*z2;if(t2<0)n2=0.0;else{t2*=t2;n2=t2*t2*dot(grad3,gi2*3,x2,y2,z2);}let t3=0.6-x3*x3-y3*y3-z3*z3;if(t3<0)n3=0.0;else{t3*=t3;n3=t3*t3*dot(grad3,gi3*3,x3,y3,z3);}return 32.0*(n0+n1+n2+n3);}
        function dot(g,gIdx,x,y,z){return g[gIdx]*x+g[gIdx+1]*y+g[gIdx+2]*z;} return{noise3D,shufflePermutations};
    })();

    const phrases = [ /* ... same phrases ... */
        { lang: "English", text: "Hello, I'm Noah" }, { lang: "Chinese", text: "你好，我是诺亚" }, 
        { lang: "Russian", text: "Привет, я Ноа" }, {lang: "Albanian", text: "Ç'kemi, jam Noah"},
        { lang: "Japanese", text: "こんにちは、ノアです" }, { lang: "Arabic", text: "مرحباً، أنا نوح" }, 
        { lang: "Spanish", text: "Hola, soy Noah" }, { lang: "Hindi", text: "नमस्ते, मैं नोआ हूँ" }, 
        { lang: "French", text: "Bonjour, je suis Noah" }, { lang: "German", text: "Hallo, ich bin Noah" },
        { lang: "Portuguese", text: "Olá, sou Noah" }, { lang: "Korean", text: "안녕하세요, 저는 노아입니다."},
    ];

    function ready(callback) { if (document.readyState !== 'loading') callback(); else document.addEventListener('DOMContentLoaded', callback); }

    function initAnimation() {
        try {
            const backgroundContainer = document.querySelector('.background-animation');
            if (!backgroundContainer) { 
                console.warn('.background-animation container not found for this page.');
                return; // Don't proceed if the container isn't on the page
            }
            backgroundContainer.innerHTML = ''; 
            
            const canvas = document.createElement('canvas');
            const offscreenCanvas = document.createElement('canvas'); // Only used if isHomepage
            backgroundContainer.appendChild(canvas);
            const ctx = canvas.getContext('2d', { willReadFrequently: false }); 
            const offCtx = isHomepage ? offscreenCanvas.getContext('2d', { willReadFrequently: true }) : null;
            if (!ctx) throw new Error('Failed to get 2D context for main canvas');
            if (isHomepage && !offCtx) throw new Error('Failed to get 2D context for offscreen canvas on homepage');


            let animationFrameId; let grid = []; let numCols, numRows; let time = Math.random() * 1000;
            let mouseX = -10000, mouseY = -10000; 

            const config = {
                backgroundFontSize: 12, textPixelSize: 2, 
                nativeTextRenderFontFamily: "Arial, Noto Sans, Noto Sans JP, Noto Sans SC, Noto Sans KR, Noto Naskh Arabic, sans-serif",
                nativeTextTargetHeightRatio: 0.80, minNativeRenderFontSize: 10,
                charSet: "ABCDEFGHIJKLMN0PQRSTUVWXYZ123456789$*#@&?", 
                baseColor: 'rgba(180, 200, 255, VAL)', highlightColor: 'rgba(230, 240, 255, VAL)',
                borderColor: 'rgba(220, 220, 255, 0.8)',
                borderChar: { corner:'+', top_bottom:'-', side:'|' },
                textPixelOnColor: 'rgba(250, 250, 255, 1)',
                canvasClearColor: 'rgba(10, 10, 25, 0)', // Make ASCII canvas clear for page bg to show
                noiseScale: 0.08, timeScale: 0.08, activationThreshold: 0.3, highlightThreshold: 0.65, 
                fadeSpeed: 0.15, charChangeProbability: 0.03,
                phraseStableDisplayDuration: 7000, textTransitionDuration: 300,    
                textAreaWidthRatio: 0.375, textAreaHeightRatio: 0.15, textPaddingRatio: 0.1,
                cursorInteractionRadius: 70, cursorVanishStrength: 1.0, cursorVanishFalloff: 1.5,  
            };
            
            // Homepage-specific variables (only initialized if isHomepage)
            let currentPhraseIndex = 0; let lastPhraseChangeTime = 0;
            let currentPixelatedTextData = { width:0,height:0,data:[] }; 
            let outgoingPixelatedTextData = null; 
            let transitionDisplayPixelData = { width:0,height:0,data:[] };
            let isTextTransitioning = false; let textTransitionProgress = 0;
            let textDisplayArea = { x:0,y:0,width:0,height:0,padding:0 };
            let borderRectCells = { startCol:0,endCol:0,startRow:0,endRow:0 }; // For homepage text box

            class GridCell {
                constructor(col, row) {
                    this.col=col; this.row=row; this.char=getRandomChar(); this.currentAlpha=0; this.targetAlpha=0;
                    this.colorTemplate=config.baseColor; this.isBorderTextRect=false; this.isWithinTextDisplayInterior=false;
                }
                update(noiseValue) {
                    let finalTargetAlpha = 0; // Default to invisible

                    if (isHomepage) { // Logic for homepage text box border and interior
                        const isTopB=this.row===borderRectCells.startRow;const isBottomB=this.row===borderRectCells.endRow-1;
                        const isLeftB=this.col===borderRectCells.startCol;const isRightB=this.col===borderRectCells.endCol-1;
                        this.isBorderTextRect=(isLeftB||isRightB)&&(this.row>=borderRectCells.startRow&&this.row<borderRectCells.endRow)||(isTopB||isBottomB)&&(this.col>=borderRectCells.startCol&&this.col<borderRectCells.endCol);
                        this.isWithinTextDisplayInterior=this.col>borderRectCells.startCol&&this.col<borderRectCells.endCol-1&&this.row>borderRectCells.startRow&&this.row<borderRectCells.endRow-1;
                    } else { // Not homepage, so no text box border or interior logic
                        this.isBorderTextRect = false;
                        this.isWithinTextDisplayInterior = false;
                    }
                    
                    if (this.isBorderTextRect && isHomepage) { 
                        finalTargetAlpha = 0.7 + (Math.sin(time * 2.5 + this.col * 0.2 + this.row * 0.3) + 1) * 0.15; 
                        this.colorTemplate = config.borderColor.replace('VAL', finalTargetAlpha.toFixed(2));
                        const isTopB=this.row===borderRectCells.startRow;const isBottomB=this.row===borderRectCells.endRow-1; // Re-check for char assignment
                        const isLeftB=this.col===borderRectCells.startCol;const isRightB=this.col===borderRectCells.endCol-1;
                        if((isTopB&&isLeftB)||(isTopB&&isRightB)||(isBottomB&&isLeftB)||(isBottomB&&isRightB)){this.char=config.borderChar.corner;}
                        else if(isTopB||isBottomB){this.char=config.borderChar.top_bottom;} else if(isLeftB||isRightB){this.char=config.borderChar.side;}
                    } else if (this.isWithinTextDisplayInterior && isHomepage) {
                        finalTargetAlpha = 0; this.char = ''; 
                    } else { // Regular background cell (applies to all cells on non-homepage, and outside text box on homepage)
                        if (noiseValue > config.activationThreshold) {
                            finalTargetAlpha = Math.min(1, (noiseValue - config.activationThreshold) / (1 - config.activationThreshold) * 1.2);
                        }
                        this.colorTemplate = (noiseValue > config.highlightThreshold && finalTargetAlpha > 0.5) ? config.highlightColor : config.baseColor;
                        if (finalTargetAlpha > 0.01 && (this.currentAlpha < 0.1 || Math.random() < config.charChangeProbability)) { 
                            this.char = getRandomChar(); 
                        } else if (finalTargetAlpha < 0.01) {
                            this.char = '';
                        }

                        const cellX=(this.col+0.5)*config.backgroundFontSize; const cellY=(this.row+0.5)*config.backgroundFontSize;
                        const distToCursor=Math.sqrt(Math.pow(cellX-mouseX,2)+Math.pow(cellY-mouseY,2));
                        let cursorVanishMultiplier = 1.0;
                        if(distToCursor < config.cursorInteractionRadius){
                            const proximityFactor=Math.max(0,1-(distToCursor/config.cursorInteractionRadius));
                            const vanishAmount=Math.pow(proximityFactor,config.cursorVanishFalloff)*config.cursorVanishStrength;
                            cursorVanishMultiplier = (1 - vanishAmount);
                        }
                        finalTargetAlpha *= cursorVanishMultiplier;
                    }
                    this.targetAlpha = finalTargetAlpha;
                    this.currentAlpha+=(this.targetAlpha-this.currentAlpha)*config.fadeSpeed;
                    if(Math.abs(this.currentAlpha-this.targetAlpha)<0.01)this.currentAlpha=this.targetAlpha;
                }
                draw() {
                    if (this.currentAlpha > 0.001) { 
                         if(this.isBorderTextRect && isHomepage) { ctx.fillStyle = this.colorTemplate; } 
                         else { ctx.fillStyle = this.colorTemplate.replace('VAL', this.currentAlpha.toFixed(2)); }
                        ctx.fillText(this.char, this.col*config.backgroundFontSize + config.backgroundFontSize*0.5, this.row*config.backgroundFontSize + config.backgroundFontSize*0.7);
                    }
                }
            }

            // --- Homepage Specific Functions (only called if isHomepage is true) ---
            function renderAndPixelateCurrentPhrase(targetDataStore) { /* ... unchanged ... */
                if(!isHomepage) return; const phraseObj=phrases[currentPhraseIndex];const textToRender=phraseObj.text;
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
                if(!isHomepage || !transitionDisplayPixelData.data.length || transitionDisplayPixelData.width === 0) return;
                const totalPixelatedWidth = transitionDisplayPixelData.width * config.textPixelSize;
                const totalPixelatedHeight = transitionDisplayPixelData.height * config.textPixelSize;
                const contentRenderWidth = textDisplayArea.width - 2 * textDisplayArea.padding;
                const contentRenderHeight = textDisplayArea.height - 2 * textDisplayArea.padding;
                const startDrawX = textDisplayArea.x + textDisplayArea.padding + Math.floor((contentRenderWidth - totalPixelatedWidth) / 2);
                const startDrawY = textDisplayArea.y + textDisplayArea.padding + Math.floor((contentRenderHeight - totalPixelatedHeight) / 2);
                ctx.fillStyle = config.textPixelOnColor;
                for(let r=0;r<transitionDisplayPixelData.height;r++){for(let c=0;c<transitionDisplayPixelData.width;c++){if(transitionDisplayPixelData.data[r*transitionDisplayPixelData.width+c]===1){ctx.fillRect(startDrawX+c*config.textPixelSize,startDrawY+r*config.textPixelSize,config.textPixelSize,config.textPixelSize);}}}
            }
            function computeTransitionFrame() { /* ... unchanged ... */ 
                if(!isHomepage || !currentPixelatedTextData.data.length || !outgoingPixelatedTextData || !outgoingPixelatedTextData.data.length){transitionDisplayPixelData=clonePixelatedData(currentPixelatedTextData);return;}
                if(transitionDisplayPixelData.width!==currentPixelatedTextData.width||transitionDisplayPixelData.height!==currentPixelatedTextData.height){transitionDisplayPixelData.width=currentPixelatedTextData.width;transitionDisplayPixelData.height=currentPixelatedTextData.height;transitionDisplayPixelData.data=new Array(currentPixelatedTextData.width*currentPixelatedTextData.height).fill(0);}
                const totalPixels=transitionDisplayPixelData.width*transitionDisplayPixelData.height;
                for(let i=0;i<totalPixels;i++){const oldOn=outgoingPixelatedTextData.data[i]===1;const newOn=currentPixelatedTextData.data[i]===1;let shouldBeOn=0;
                if(oldOn&&!newOn){shouldBeOn=(Math.random()>textTransitionProgress)?1:0;}else if(!oldOn&&newOn){shouldBeOn=(Math.random()<textTransitionProgress)?1:0;}else if(newOn){shouldBeOn=1;}else{shouldBeOn=0;}transitionDisplayPixelData.data[i]=shouldBeOn;}
            }
            // --- End Homepage Specific Functions ---

            function getRandomChar() { return config.charSet.charAt(Math.floor(Math.random()*config.charSet.length)); }
            function clonePixelatedData(dataToClone) { if(!dataToClone||!dataToClone.data)return{width:0,height:0,data:[]}; return{width:dataToClone.width,height:dataToClone.height,data:dataToClone.data.slice()};}

            function setupAndRun() {
                if(animationFrameId)cancelAnimationFrame(animationFrameId);SimplexNoise.shufflePermutations();canvas.width=window.innerWidth;canvas.height=window.innerHeight;
                numCols=Math.floor(canvas.width/config.backgroundFontSize);numRows=Math.floor(canvas.height/config.backgroundFontSize);
                
                if (isHomepage) { // Setup for homepage text box
                    textDisplayArea.width=Math.floor(canvas.width*config.textAreaWidthRatio);textDisplayArea.height=Math.floor(canvas.height*config.textAreaHeightRatio);
                    textDisplayArea.x=Math.floor((canvas.width-textDisplayArea.width)/2);textDisplayArea.y=Math.floor((canvas.height-textDisplayArea.height)/2);
                    textDisplayArea.padding=Math.floor(Math.min(textDisplayArea.width,textDisplayArea.height)*config.textPaddingRatio);
                    borderRectCells.startCol=Math.max(0,Math.floor(textDisplayArea.x/config.backgroundFontSize)-1);borderRectCells.endCol=Math.min(numCols,Math.ceil((textDisplayArea.x+textDisplayArea.width)/config.backgroundFontSize)+1);
                    borderRectCells.startRow=Math.max(0,Math.floor(textDisplayArea.y/config.backgroundFontSize)-1);borderRectCells.endRow=Math.min(numRows,Math.ceil((textDisplayArea.y+textDisplayArea.height)/config.backgroundFontSize)+1);
                    renderAndPixelateCurrentPhrase(currentPixelatedTextData); 
                    transitionDisplayPixelData = clonePixelatedData(currentPixelatedTextData);
                    lastPhraseChangeTime=performance.now(); isTextTransitioning=false; textTransitionProgress=0; outgoingPixelatedTextData=null;
                }
                
                grid=[];for(let r=0;r<numRows;r++){let rowCells=[];for(let c=0;c<numCols;c++){rowCells.push(new GridCell(c,r));}grid.push(rowCells);}
                ctx.font=`${config.backgroundFontSize}px monospace`;ctx.textAlign='center';ctx.textBaseline='alphabetic';time=Math.random()*1000;animate();
            }
            
            let lastFrameDrawnTime = performance.now(); 
            const targetFPS = 30; const frameInterval = 1000 / targetFPS;

            function animate() {
                animationFrameId = requestAnimationFrame(animate);
                const now = performance.now(); const elapsed = now - lastFrameDrawnTime;

                if (elapsed >= frameInterval) {
                    lastFrameDrawnTime = now - (elapsed % frameInterval); time += config.timeScale * 0.1 * (elapsed / frameInterval);

                    if (isHomepage) { // Homepage text transition logic
                        if (isTextTransitioning) {
                            textTransitionProgress += (elapsed / config.textTransitionDuration); computeTransitionFrame();
                            if (textTransitionProgress >= 1) { isTextTransitioning = false; textTransitionProgress = 0; outgoingPixelatedTextData = null; transitionDisplayPixelData = clonePixelatedData(currentPixelatedTextData); lastPhraseChangeTime = now; }
                        } else if (now - lastPhraseChangeTime > config.phraseStableDisplayDuration) {
                            isTextTransitioning = true; textTransitionProgress = 0; outgoingPixelatedTextData = clonePixelatedData(currentPixelatedTextData);
                            currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length; renderAndPixelateCurrentPhrase(currentPixelatedTextData);
                        }
                    }

                    // Clear with transparency so page background shows through
                    ctx.clearRect(0, 0, canvas.width, canvas.height); 
                    // Or, if you want the ASCII background to have its own base color different from page bg:
                    // ctx.fillStyle = config.canvasClearColor; ctx.fillRect(0, 0, canvas.width, canvas.height);


                    ctx.font = `${config.backgroundFontSize}px monospace`; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
                    for(let r=0;r<numRows;r++){for(let c=0;c<numCols;c++){const noiseVal=(SimplexNoise.noise3D(c*config.noiseScale,r*config.noiseScale,time)+1)/2;grid[r][c].update(noiseVal);grid[r][c].draw();}}
                    
                    if (isHomepage) {
                        drawPixelatedTextScramble();
                    }
                }
            }
            
            canvas.addEventListener('mousemove', (event) => { const rect = canvas.getBoundingClientRect(); mouseX = event.clientX - rect.left; mouseY = event.clientY - rect.top; });
            canvas.addEventListener('mouseleave', () => { mouseX = -10000; mouseY = -10000; });
            
            // Only proceed with animation if the container div exists on the current page
            if (backgroundContainer) {
                setupAndRun();
            }

            let resizeTimeout; window.addEventListener('resize', () => {
                if (backgroundContainer) { // Only resize if animation is active
                    clearTimeout(resizeTimeout); resizeTimeout = setTimeout(setupAndRun, 300);
                }
            });
            console.log('ASCII animation script setup complete. Homepage features active: ' + isHomepage);
        } catch (error) { 
            console.error('Animation initialization failed:', error);
            const errorElement = document.createElement('div');
            Object.assign(errorElement.style, {position:'fixed',top:'10px',left:'10px',background:'rgba(255,0,0,0.8)',color:'white',padding:'15px',zIndex:'10000',border:'1px solid white',borderRadius:'5px',maxWidth:'calc(100% - 20px)',fontSize:'12px'});
            errorElement.innerHTML = `<strong>Animation Error:</strong><br>${error.message}<br><small>Check console (F12).</small>`;
            if(document.body)document.body.appendChild(errorElement);else document.addEventListener('DOMContentLoaded',()=>document.body.appendChild(errorElement));
        }
    }
    ready(initAnimation);
    window.addEventListener('load', () => { 
        const bgC=document.querySelector('.background-animation');
        if(bgC&&!bgC.querySelector('canvas')){ 
            console.log("Canvas not found on window.load, attempting initAnimation again if container exists.");
            initAnimation(); // initAnimation itself checks for backgroundContainer
        }
    });
})();