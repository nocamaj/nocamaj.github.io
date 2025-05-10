// Wrap in an IIFE
(function() {
    console.log('Grid-based swirling ASCII animation with central text loading...');

    const SimplexNoise = (() => { // ... (Simplex Noise code from previous response - remains unchanged)
        const F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
        const G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
        const F3 = 1.0 / 3.0;
        const G3 = 1.0 / 6.0;

        const grad3 = new Float32Array([
            1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0,
            1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, -1,
            0, 1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1,
        ]);

        const p = new Uint8Array(256);
        for (let i = 0; i < 256; i++) p[i] = i;

        let perm = new Uint8Array(512);
        let permMod12 = new Uint8Array(512);

        shufflePermutations();

        function shufflePermutations() {
            for (let i = 255; i > 0; i--) {
                const r = Math.floor(Math.random() * (i + 1));
                const temp = p[i];
                p[i] = p[r];
                p[r] = temp;
            }
            for (let i = 0; i < 512; i++) {
                perm[i] = p[i & 255];
                permMod12[i] = perm[i] % 12;
            }
        }
        
        shufflePermutations();


        function noise3D(xin, yin, zin) {
            let n0, n1, n2, n3; 
            const s = (xin + yin + zin) * F3; 
            const i = Math.floor(xin + s);
            const j = Math.floor(yin + s);
            const k = Math.floor(zin + s);
            const t = (i + j + k) * G3;
            const X0 = i - t; 
            const Y0 = j - t;
            const Z0 = k - t;
            const x0 = xin - X0; 
            const y0 = yin - Y0;
            const z0 = zin - Z0;

            let i1, j1, k1; 
            let i2, j2, k2; 

            if (x0 >= y0) {
                if (y0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0; } 
                else if (x0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1; } 
                else { i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1; } 
            } else { 
                if (y0 < z0) { i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1; } 
                else if (x0 < z0) { i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1; } 
                else { i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0; } 
            }

            const x1 = x0 - i1 + G3; 
            const y1 = y0 - j1 + G3;
            const z1 = z0 - k1 + G3;
            const x2 = x0 - i2 + 2.0 * G3; 
            const y2 = y0 - j2 + 2.0 * G3;
            const z2 = z0 - k2 + 2.0 * G3;
            const x3 = x0 - 1.0 + 3.0 * G3; 
            const y3 = y0 - 1.0 + 3.0 * G3;
            const z3 = z0 - 1.0 + 3.0 * G3;

            const ii = i & 255;
            const jj = j & 255;
            const kk = k & 255;

            const gi0 = permMod12[ii + perm[jj + perm[kk]]];
            const gi1 = permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]];
            const gi2 = permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]];
            const gi3 = permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]];

            let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
            if (t0 < 0) n0 = 0.0;
            else {
                t0 *= t0;
                n0 = t0 * t0 * dot(grad3, gi0 * 3, x0, y0, z0);
            }
            let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
            if (t1 < 0) n1 = 0.0;
            else {
                t1 *= t1;
                n1 = t1 * t1 * dot(grad3, gi1 * 3, x1, y1, z1);
            }
            let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
            if (t2 < 0) n2 = 0.0;
            else {
                t2 *= t2;
                n2 = t2 * t2 * dot(grad3, gi2 * 3, x2, y2, z2);
            }
            let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
            if (t3 < 0) n3 = 0.0;
            else {
                t3 *= t3;
                n3 = t3 * t3 * dot(grad3, gi3 * 3, x3, y3, z3);
            }
            return 32.0 * (n0 + n1 + n2 + n3);
        }
        
        function dot(g, gIdx, x, y, z) { return g[gIdx] * x + g[gIdx + 1] * y + g[gIdx + 2] * z; }
        
        return { noise3D, shufflePermutations };
    })();

    // --- Minimal 5x7 Dot Matrix Font Definition ---
    // 1 = on, 0 = off. Each array is a row. Height 7, Width 5.
    const dotMatrixFont = {
        'A': [[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1]],
        'B': [[1,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,0]],
        'C': [[0,1,1,1,1],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[0,1,1,1,1]],
        'D': [[1,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,0]],
        'E': [[1,1,1,1,1],[1,0,0,0,0],[1,0,0,0,0],[1,1,1,1,0],[1,0,0,0,0],[1,0,0,0,0],[1,1,1,1,1]],
        'F': [[1,1,1,1,1],[1,0,0,0,0],[1,0,0,0,0],[1,1,1,1,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0]],
        'G': [[0,1,1,1,1],[1,0,0,0,0],[1,0,0,0,0],[1,0,1,1,1],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,1]],
        'H': [[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1]],
        'I': [[1,1,1,1,1],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[1,1,1,1,1]],
        'J': [[0,0,1,1,1],[0,0,0,1,0],[0,0,0,1,0],[0,0,0,1,0],[1,0,0,1,0],[1,0,0,1,0],[0,1,1,0,0]],
        'K': [[1,0,0,1,0],[1,0,1,0,0],[1,1,0,0,0],[1,1,0,0,0],[1,0,1,0,0],[1,0,0,1,0],[1,0,0,1,0]], // Simplified K
        'L': [[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,1,1,1,1]],
        'M': [[1,0,0,0,1],[1,1,0,1,1],[1,0,1,0,1],[1,0,1,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1]],
        'N': [[1,0,0,0,1],[1,1,0,0,1],[1,0,1,0,1],[1,0,0,1,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1]],
        'O': [[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
        'P': [[1,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0]],
        'Q': [[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,1,0,1],[1,0,0,1,0],[0,1,1,1,0]], // Simplified Q
        'R': [[1,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,0],[1,0,1,0,0],[1,0,0,1,0],[1,0,0,0,1]],
        'S': [[0,1,1,1,1],[1,0,0,0,0],[1,0,0,0,0],[0,1,1,1,0],[0,0,0,0,1],[0,0,0,0,1],[1,1,1,1,0]],
        'T': [[1,1,1,1,1],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0]],
        'U': [[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
        'V': [[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[0,1,0,1,0],[0,1,0,1,0],[0,0,1,0,0],[0,0,1,0,0]],
        'W': [[1,0,0,0,1],[1,0,0,0,1],[1,0,1,0,1],[1,0,1,0,1],[1,1,0,1,1],[1,1,0,1,1],[1,0,0,0,1]],
        'X': [[1,0,0,0,1],[0,1,0,1,0],[0,0,1,0,0],[0,0,1,0,0],[0,1,0,1,0],[1,0,0,0,1],[0,0,0,0,0]], // Simplified X
        'Y': [[1,0,0,0,1],[0,1,0,1,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0]],
        'Z': [[1,1,1,1,1],[0,0,0,1,0],[0,0,1,0,0],[0,1,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,1,1,1,1]],
        '0': [[0,1,1,1,0],[1,0,0,1,1],[1,0,1,0,1],[1,1,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
        '1': [[0,0,1,0,0],[0,1,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,1,1,1,0]],
        '2': [[0,1,1,1,0],[1,0,0,0,1],[0,0,0,0,1],[0,0,0,1,0],[0,0,1,0,0],[0,1,0,0,0],[1,1,1,1,1]],
        '3': [[0,1,1,1,0],[1,0,0,0,1],[0,0,0,0,1],[0,0,1,1,0],[0,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
        '4': [[0,0,0,1,0],[0,0,1,1,0],[0,1,0,1,0],[1,0,0,1,0],[1,1,1,1,1],[0,0,0,1,0],[0,0,0,1,0]],
        '5': [[1,1,1,1,1],[1,0,0,0,0],[1,1,1,1,0],[0,0,0,0,1],[0,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
        '6': [[0,1,1,1,0],[1,0,0,0,0],[1,0,0,0,0],[1,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
        '7': [[1,1,1,1,1],[0,0,0,0,1],[0,0,0,1,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0]],
        '8': [[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
        '9': [[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,1],[0,0,0,0,1],[0,0,0,0,1],[0,1,1,1,0]],
        ' ': [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]],
        "'": [[0,0,1,0,0],[0,0,1,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]],
        ',': [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,1,0,0],[0,0,1,0,0]], // Lowered comma
        '.': [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,1,0,0]],
        '!': [[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,0,0,0],[0,0,1,0,0]],
        // Add more characters if needed
    };
    const FONT_CHAR_WIDTH = 5;
    const FONT_CHAR_HEIGHT = 7;
    const FONT_CHAR_SPACING = 1; // Cells between characters

    const phrases = [
        { lang: "English", text: "HELLO I'M NOAH" },
        { lang: "Chinese (Pinyin)", text: "NI HAO WO SHI NOAH" },
        { lang: "Russian (Transl.)", text: "PRIVET YA NOA" },
        { lang: "Hindi (Transl.)", text: "NAMASTE MAIN NOA HUN" },
        { lang: "Japanese (Romaji)", text: "KONNICHIWA NOA DESU" },
        { lang: "Arabic (Transl.)", text: "MARHABAN ANA NUH" },
        { lang: "Spanish", text: "HOLA SOY NOAH" },
        { lang: "French", text: "BONJOUR JE SUIS NOAH" },
        { lang: "German", text: "HALLO ICH BIN NOAH" }
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
            backgroundContainer.appendChild(canvas);
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Failed to get 2D context');

            let animationFrameId;
            let grid = [];
            let numCols, numRows;
            let time = Math.random() * 1000;

            const config = {
                fontSize: 10, // Further reduced by ~15% from 12
                charSet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$()*&%#@!?<>[]{}|/\\-_+=^~`:;\",.'",
                baseColor: 'rgba(180, 200, 255, VAL)', 
                highlightColor: 'rgba(230, 240, 255, VAL)',
                textCellChar: '*', // Character to use for active text cells
                textColorTemplate: 'rgba(255, 255, 255, VAL)', // Brighter for text
                canvasClearColor: 'rgba(10, 10, 25, 1)', 
                noiseScale: 0.07, // Adjusted slightly for new font size
                timeScale: 0.08,        
                activationThreshold: 0.25, 
                highlightThreshold: 0.6, 
                fadeSpeed: 0.15,         
                charChangeProbability: 0.02,
                textRectHeightCells: FONT_CHAR_HEIGHT, // Height of text area based on font
                textRectPaddingCells: 2, // Padding around text area
                phraseChangeInterval: 5000, // 5 seconds in ms
            };
            
            let currentPhraseIndex = 0;
            let lastPhraseChangeTime = 0;
            let textGridPattern = []; // 2D array [row][col] of 0 or 1 for text pixels

            // Text Rectangle dimensions - will be calculated in setupGridAndRun
            let textRectStartCol, textRectEndCol, textRectStartRow, textRectEndRow;
            let textRectCols, textRectRows;


            class GridCell {
                constructor(col, row) {
                    this.col = col;
                    this.row = row;
                    this.char = getRandomChar();
                    this.currentAlpha = 0;
                    this.targetAlpha = 0;
                    this.colorTemplate = config.baseColor;
                    this.isTextPixel = false; // Is this cell part of an active text character pixel
                    this.isTextRectCell = false; // Is this cell within the text rectangle bounds
                }

                update(noiseValue) {
                    this.isTextRectCell = (this.col >= textRectStartCol && this.col < textRectEndCol && 
                                           this.row >= textRectStartRow && this.row < textRectEndRow);
                    
                    let relativeCol = this.col - textRectStartCol;
                    let relativeRow = this.row - textRectStartRow;
                    this.isTextPixel = false;

                    if (this.isTextRectCell && 
                        textGridPattern[relativeRow] && 
                        textGridPattern[relativeRow][relativeCol] === 1) {
                        this.isTextPixel = true;
                    }

                    if (this.isTextPixel) {
                        this.targetAlpha = 0.9 + Math.random() * 0.1; // Bright and slightly shimmering
                        this.char = config.textCellChar; 
                        this.colorTemplate = config.textColorTemplate;
                    } else if (this.isTextRectCell) { // Inside text rect, but not an active pixel for text
                        this.targetAlpha = noiseValue * 0.1; // Much dimmer background within text rect
                        this.char = getRandomChar();
                        this.colorTemplate = config.baseColor;
                    } else { // Regular background cell
                        if (noiseValue > config.activationThreshold) {
                            this.targetAlpha = Math.min(1, (noiseValue - config.activationThreshold) / (1 - config.activationThreshold) * 1.5); 
                            if (this.currentAlpha < 0.1 || Math.random() < config.charChangeProbability) {
                                this.char = getRandomChar();
                            }
                            this.colorTemplate = (noiseValue > config.highlightThreshold) ? config.highlightColor : config.baseColor;
                        } else {
                            this.targetAlpha = 0;
                        }
                    }

                    if (Math.abs(this.currentAlpha - this.targetAlpha) < 0.01) {
                        this.currentAlpha = this.targetAlpha;
                    } else {
                        this.currentAlpha += (this.targetAlpha - this.currentAlpha) * config.fadeSpeed;
                    }
                }

                draw() {
                    if (this.currentAlpha > 0.01) {
                        ctx.fillStyle = this.colorTemplate.replace('VAL', this.currentAlpha.toFixed(2));
                        ctx.fillText(
                            this.char,
                            this.col * config.fontSize + config.fontSize * 0.5, 
                            this.row * config.fontSize + config.fontSize * 0.7 
                        );
                    }
                }
            }

            function getRandomChar() {
                return config.charSet.charAt(Math.floor(Math.random() * config.charSet.length));
            }

            function generateTextGrid(phraseStr) {
                const phrase = phraseStr.toUpperCase();
                let patternWidth = 0;
                for (let i = 0; i < phrase.length; i++) {
                    patternWidth += FONT_CHAR_WIDTH;
                    if (i < phrase.length - 1) patternWidth += FONT_CHAR_SPACING;
                }

                const outputGrid = Array(FONT_CHAR_HEIGHT).fill(null).map(() => Array(patternWidth).fill(0));
                let currentX = 0;

                for (const char of phrase) {
                    const fontChar = dotMatrixFont[char] || dotMatrixFont[' ']; // Default to space if char not found
                    for (let r = 0; r < FONT_CHAR_HEIGHT; r++) {
                        for (let c = 0; c < FONT_CHAR_WIDTH; c++) {
                            if (fontChar[r] && fontChar[r][c] === 1) {
                                if (outputGrid[r]) outputGrid[r][currentX + c] = 1;
                            }
                        }
                    }
                    currentX += FONT_CHAR_WIDTH + FONT_CHAR_SPACING;
                }
                return outputGrid;
            }
            
            function updateActiveTextPattern() {
                const currentFullPhrase = phrases[currentPhraseIndex];
                const generatedPattern = generateTextGrid(currentFullPhrase.text);
                
                // Center the generated pattern within the textRectCols, textRectRows
                textGridPattern = Array(textRectRows).fill(null).map(() => Array(textRectCols).fill(0));

                const patternActualWidth = generatedPattern[0] ? generatedPattern[0].length : 0;
                const patternActualHeight = generatedPattern.length;

                const startXOffset = Math.floor((textRectCols - patternActualWidth) / 2);
                const startYOffset = Math.floor((textRectRows - patternActualHeight) / 2);

                for (let r = 0; r < patternActualHeight; r++) {
                    for (let c = 0; c < patternActualWidth; c++) {
                        if (generatedPattern[r][c] === 1) {
                            const targetR = startYOffset + r;
                            const targetC = startXOffset + c;
                            if (targetR >= 0 && targetR < textRectRows && targetC >= 0 && targetC < textRectCols) {
                                textGridPattern[targetR][targetC] = 1;
                            }
                        }
                    }
                }
                 console.log("Updated text pattern for:", currentFullPhrase.text);
            }


            function setupGridAndRun() {
                if (animationFrameId) cancelAnimationFrame(animationFrameId);
                
                SimplexNoise.shufflePermutations();

                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                
                numCols = Math.floor(canvas.width / config.fontSize);
                numRows = Math.floor(canvas.height / config.fontSize);

                // Define text rectangle based on total grid cells
                textRectRows = config.textRectHeightCells + 2 * config.textRectPaddingCells; // e.g., 7 + 2*2 = 11 cells high
                // Attempt to make text rect about 60-70% of screen width in cells
                textRectCols = Math.floor(numCols * 0.7); 

                textRectStartRow = Math.floor((numRows - textRectRows) / 2);
                textRectEndRow = textRectStartRow + textRectRows;
                textRectStartCol = Math.floor((numCols - textRectCols) / 2);
                textRectEndCol = textRectStartCol + textRectCols;
                
                grid = [];
                for (let r = 0; r < numRows; r++) {
                    let rowCells = [];
                    for (let c = 0; c < numCols; c++) {
                        rowCells.push(new GridCell(c, r));
                    }
                    grid.push(rowCells);
                }
                console.log(`Grid: ${numCols}x${numRows}, Font: ${config.fontSize}px`);
                console.log(`TextRect: cols ${textRectCols} (from ${textRectStartCol} to ${textRectEndCol-1}), rows ${textRectRows} (from ${textRectStartRow} to ${textRectEndRow-1})`);
                
                updateActiveTextPattern(); // Initial text pattern
                lastPhraseChangeTime = performance.now();


                ctx.font = `${config.fontSize}px monospace`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'alphabetic'; 

                time = Math.random() * 1000; 
                animate();
            }
            
            let lastFrameTime = performance.now();
            const targetFPS = 30; 
            const frameInterval = 1000 / targetFPS;

            function animate() {
                animationFrameId = requestAnimationFrame(animate);
                
                const now = performance.now();
                const elapsed = now - lastFrameTime;

                if (elapsed > frameInterval) {
                    lastFrameTime = now - (elapsed % frameInterval);
                    time += config.timeScale * 0.1; 

                    // Check for phrase change
                    if (now - lastPhraseChangeTime > config.phraseChangeInterval) {
                        currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
                        updateActiveTextPattern();
                        lastPhraseChangeTime = now;
                    }

                    ctx.fillStyle = config.canvasClearColor;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    for (let r = 0; r < numRows; r++) {
                        for (let c = 0; c < numCols; c++) {
                            const noiseVal = (SimplexNoise.noise3D(c * config.noiseScale, r * config.noiseScale, time) + 1) / 2; 
                            grid[r][c].update(noiseVal);
                            grid[r][c].draw();
                        }
                    }
                }
            }
            
            setupGridAndRun();
            
            let resizeTimeout;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(setupGridAndRun, 250);
            });
            
            console.log('Grid animation with text setup complete');

        } catch (error) {
            console.error('Animation initialization failed:', error);
            const errorElement = document.createElement('div');
            Object.assign(errorElement.style, {
                position: 'fixed', top: '10px', left: '10px', background: 'rgba(255,0,0,0.8)', 
                color: 'white', padding: '15px', zIndex: '10000', border: '1px solid white',
                borderRadius: '5px', maxWidth: 'calc(100% - 20px)', fontSize: '12px'
            });
            errorElement.innerHTML = `<strong>Animation Error:</strong><br>${error.message}<br><small>Check console (F12).</small>`;
            if (document.body) document.body.appendChild(errorElement);
            else document.addEventListener('DOMContentLoaded', () => document.body.appendChild(errorElement));
        }
    }
    
    ready(initAnimation);
    
    window.addEventListener('load', () => {
        const bgContainer = document.querySelector('.background-animation');
        if (bgContainer && !bgContainer.querySelector('canvas')) {
            console.log('Canvas not found on window.load, trying initAnimation again.');
            initAnimation();
        }
    });

})();