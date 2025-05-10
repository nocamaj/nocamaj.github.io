// Wrap in an IIFE to avoid global scope pollution
(function() {
    console.log('Grid-based swirling ASCII animation script loading...');

    /**
     * A standalone Simplex Noise implementation.
     * Based on the public domain implementation by Stefan Gustavson and Peter Eastman.
     * And further adapted from Jonas Wagner's JavaScript version.
     */
    const SimplexNoise = (() => {
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
        
        // Call shuffle an extra time on init to ensure better randomness at start
        shufflePermutations();


        function noise3D(xin, yin, zin) {
            let n0, n1, n2, n3; // Noise contributions from the four corners
            // Skew the input space to determine which simplex cell we're in
            const s = (xin + yin + zin) * F3; // Very nice and simple skew factor for 3D
            const i = Math.floor(xin + s);
            const j = Math.floor(yin + s);
            const k = Math.floor(zin + s);
            const t = (i + j + k) * G3;
            const X0 = i - t; // Unskew the cell origin back to (x,y,z) space
            const Y0 = j - t;
            const Z0 = k - t;
            const x0 = xin - X0; // The x,y,z distances from the cell origin
            const y0 = yin - Y0;
            const z0 = zin - Z0;

            // For the 3D case, the simplex shape is a slightly irregular tetrahedron.
            // Determine which simplex we are in.
            let i1, j1, k1; // Offsets for second corner of simplex in (i,j,k) coords
            let i2, j2, k2; // Offsets for third corner of simplex in (i,j,k) coords

            if (x0 >= y0) {
                if (y0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0; } // X Y Z order
                else if (x0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1; } // X Z Y order
                else { i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1; } // Z X Y order
            } else { // x0 < y0
                if (y0 < z0) { i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1; } // Z Y X order
                else if (x0 < z0) { i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1; } // Y Z X order
                else { i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0; } // Y X Z order
            }

            // A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z),
            // a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and
            // a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where
            // c = 1/6.
            const x1 = x0 - i1 + G3; // Offsets for second corner in (x,y,z) coords
            const y1 = y0 - j1 + G3;
            const z1 = z0 - k1 + G3;
            const x2 = x0 - i2 + 2.0 * G3; // Offsets for third corner in (x,y,z) coords
            const y2 = y0 - j2 + 2.0 * G3;
            const z2 = z0 - k2 + 2.0 * G3;
            const x3 = x0 - 1.0 + 3.0 * G3; // Offsets for last corner in (x,y,z) coords
            const y3 = y0 - 1.0 + 3.0 * G3;
            const z3 = z0 - 1.0 + 3.0 * G3;

            // Work out the hashed gradient indices of the four simplex corners
            const ii = i & 255;
            const jj = j & 255;
            const kk = k & 255;

            const gi0 = permMod12[ii + perm[jj + perm[kk]]];
            const gi1 = permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]];
            const gi2 = permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]];
            const gi3 = permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]];

            // Calculate the contribution from the four corners
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
            // Add contributions from each corner to get the final noise value.
            // The result is scaled to stay just inside [-1,1]
            return 32.0 * (n0 + n1 + n2 + n3);
        }
        
        function dot(g, gIdx, x, y, z) { return g[gIdx] * x + g[gIdx + 1] * y + g[gIdx + 2] * z; }
        
        return { noise3D, shufflePermutations };
    })();


    function ready(callback) {
        if (document.readyState !== 'loading') {
            callback();
        } else {
            document.addEventListener('DOMContentLoaded', callback);
        }
    }

    function initAnimation() {
        try {
            console.log('Grid animation initialization started');
            
            const backgroundContainer = document.querySelector('.background-animation');
            if (!backgroundContainer) throw new Error('Background container .background-animation not found!');
            backgroundContainer.innerHTML = ''; 
            
            const canvas = document.createElement('canvas');
            backgroundContainer.appendChild(canvas);
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Failed to get canvas 2D context');

            let animationFrameId;
            let grid = [];
            let numCols, numRows;
            let time = Math.random() * 1000; // Start time at a random offset

            const config = {
                fontSize: 14, // Fixed size for all characters
                // Katakana, Alphanumeric, common symbols, and some Midjourney-esque words/fragments
                charSet: "アァカサタナハマヤラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズヅブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$()*&%#@!?<>[]{}|/\\-_+=imagine prompt art ai stable diffusion render",
                baseColor: 'rgba(180, 200, 255, VAL)', // VAL will be replaced by alpha
                highlightColor: 'rgba(230, 240, 255, VAL)', 
                canvasClearColor: 'rgba(10, 10, 25, 1)', // Very dark, slightly blue
                noiseScale: 0.06,       // How "zoomed in" the noise pattern is
                timeScale: 0.08,        // How fast the animation evolves
                activationThreshold: 0.25, // Noise value above which cells activate
                highlightThreshold: 0.6, // Noise value above which cells get highlightColor
                fadeSpeed: 0.15,         // How quickly characters fade in/out
                charChangeProbability: 0.02 // Chance to change character while active
            };
            
            class GridCell {
                constructor(col, row) {
                    this.col = col;
                    this.row = row;
                    this.char = getRandomChar();
                    this.currentAlpha = 0;
                    this.targetAlpha = 0;
                    this.colorTemplate = config.baseColor;
                }

                update(noiseValue) {
                    if (noiseValue > config.activationThreshold) {
                        // Use the noise value to determine target brightness, scaled
                        this.targetAlpha = Math.min(1, (noiseValue - config.activationThreshold) / (1 - config.activationThreshold) * 1.5); 
                        
                        if (this.currentAlpha < 0.1 || Math.random() < config.charChangeProbability) {
                            this.char = getRandomChar();
                        }
                        this.colorTemplate = (noiseValue > config.highlightThreshold) ? config.highlightColor : config.baseColor;

                    } else {
                        this.targetAlpha = 0;
                    }

                    // Smoothly transition alpha
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
                            this.col * config.fontSize + config.fontSize * 0.5, // Center char in cell
                            this.row * config.fontSize + config.fontSize * 0.7 // Adjust vertical alignment
                        );
                    }
                }
            }

            function getRandomChar() {
                return config.charSet.charAt(Math.floor(Math.random() * config.charSet.length));
            }

            function setupGridAndRun() {
                if (animationFrameId) cancelAnimationFrame(animationFrameId);
                
                SimplexNoise.shufflePermutations(); // Re-shuffle noise on resize for variety

                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                console.log(`Canvas size: ${canvas.width}x${canvas.height}`);

                numCols = Math.floor(canvas.width / config.fontSize);
                numRows = Math.floor(canvas.height / config.fontSize);
                
                grid = [];
                for (let r = 0; r < numRows; r++) {
                    let rowCells = [];
                    for (let c = 0; c < numCols; c++) {
                        rowCells.push(new GridCell(c, r));
                    }
                    grid.push(rowCells);
                }
                console.log(`Grid initialized: ${numCols}x${numRows} cells`);

                // Set font properties once
                ctx.font = `${config.fontSize}px monospace`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'alphabetic'; // 'middle' or 'alphabetic' can be tweaked

                time = Math.random() * 1000; // Reset time slightly on resize for visual change
                animate();
            }
            
            let lastFrameTime = performance.now();
            const targetFPS = 30; // Target FPS
            const frameInterval = 1000 / targetFPS;

            function animate() {
                animationFrameId = requestAnimationFrame(animate);
                
                const now = performance.now();
                const elapsed = now - lastFrameTime;

                if (elapsed > frameInterval) {
                    lastFrameTime = now - (elapsed % frameInterval);

                    time += config.timeScale * 0.1; // Adjust time increment for desired evolution speed

                    ctx.fillStyle = config.canvasClearColor;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    for (let r = 0; r < numRows; r++) {
                        for (let c = 0; c < numCols; c++) {
                            // SimplexNoise.noise3D returns values roughly in [-1, 1]
                            const noiseVal = (SimplexNoise.noise3D(c * config.noiseScale, r * config.noiseScale, time) + 1) / 2; // Normalize to [0, 1]
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
            
            console.log('Grid animation setup complete');

        } catch (error) {
            console.error('Animation initialization failed:', error);
            const errorElement = document.createElement('div');
            Object.assign(errorElement.style, {
                position: 'fixed', top: '10px', left: '10px', background: 'rgba(255,0,0,0.8)', 
                color: 'white', padding: '15px', zIndex: '10000', border: '1px solid white',
                borderRadius: '5px', maxWidth: 'calc(100% - 20px)'
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