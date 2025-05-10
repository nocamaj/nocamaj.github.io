// Wrap in an IIFE to avoid global scope pollution
(function() {
    // Log that script has started loading
    console.log('Midjourney-style animation script loading...');

    // Function to check if DOM is ready
    function ready(callback) {
        if (document.readyState !== 'loading') {
            console.log('Document already ready');
            callback();
        } else {
            console.log('Adding DOMContentLoaded listener');
            document.addEventListener('DOMContentLoaded', function() {
                console.log('DOMContentLoaded fired');
                callback();
            });
        }
    }

    // Main initialization function
    function initAnimation() {
        try {
            console.log('Animation initialization started');
            
            const backgroundContainer = document.querySelector('.background-animation');
            if (!backgroundContainer) {
                throw new Error('Background container not found! (.background-animation)');
            }
            console.log('Found background container:', backgroundContainer);

            backgroundContainer.innerHTML = ''; // Clear existing content
            
            const canvas = document.createElement('canvas');
            // CSS will handle position, top, left, width, height, display.
            // Pointer events are also handled by CSS.
            // No inline zIndex for canvas here, it will be managed by parent's z-index.
            Object.assign(canvas.style, {
                position: 'absolute', // Ensures it adheres to parent's flow if parent is relative/absolute/fixed
                top: '0',
                left: '0',
                width: '100%', 
                height: '100%',
                display: 'block',
                pointerEvents: 'none' // Reinforce, though CSS should handle it
            });
            backgroundContainer.appendChild(canvas);
            console.log('Canvas element created and appended');
            
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                throw new Error('Failed to get canvas 2D context');
            }

            let animationFrameId; // To control stopping/starting animation

            const setupAndRunAnimation = () => {
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                }

                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                console.log(`Canvas size set to ${canvas.width}x${canvas.height}`);

                const fontSize = 14; // Adjust for character size and density
                const columns = Math.floor(canvas.width / fontSize);
                
                const katakana = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズヅブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン";
                const latin = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                const symbols = "$()*&%#@!?<>[]{}| stably"; // Added some keywords for Midjourney feel
                const characters = (katakana + latin + symbols).split('');

                const drops = [];
                for (let i = 0; i < columns; i++) {
                    drops[i] = 1 + Math.floor(Math.random() * (canvas.height / fontSize));
                }

                const trailColor = 'rgba(18, 18, 18, 0.08)'; // For fading effect, matches body bg
                const primaryCharColor = '#00CF4D'; // Vibrant green
                const highlightCharColor = '#E0FFE0'; // Very light green / whitish

                let frameCount = 0;

                function draw() {
                    frameCount++;
                
                    ctx.fillStyle = trailColor;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                    ctx.font = `bold ${fontSize}px monospace`; // Added bold for better visibility
                
                    for (let i = 0; i < columns; i++) {
                        const text = characters[Math.floor(Math.random() * characters.length)];
                        const x = i * fontSize;
                        const y = drops[i] * fontSize;

                        // The character at the "bottom" of the drop (most recent) is often brightest
                        // Or, randomly highlight a character in the stream
                        if (Math.random() > 0.985) { // Small chance for a character to be a highlight
                            ctx.fillStyle = highlightCharColor;
                            ctx.shadowColor = highlightCharColor;
                            ctx.shadowBlur = 8;
                        } else {
                            ctx.fillStyle = primaryCharColor;
                            ctx.shadowColor = primaryCharColor;
                            ctx.shadowBlur = 5; 
                        }
                        
                        ctx.fillText(text, x, y);

                        // Reset shadow for next char if not all have shadows or different settings
                        ctx.shadowBlur = 0; 
                
                        if (y > canvas.height && Math.random() > 0.975) {
                            drops[i] = 0;
                        }
                        drops[i]++;
                    }
                
                    if (frameCount % 600 === 0) { // Log less frequently
                        console.log(`Animation running - frame ${frameCount}`);
                    }
                
                    animationFrameId = requestAnimationFrame(draw);
                }
                console.log('Starting animation loop');
                draw();
            };
            
            setupAndRunAnimation();
            
            let resizeTimeout;
            window.addEventListener('resize', function() {
                console.log('Window resized');
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    console.log('Re-initializing animation after resize');
                    setupAndRunAnimation();
                }, 250); 
            });
            
            console.log('Animation setup complete');
        } catch (error) {
            console.error('Animation initialization failed:', error);
            const errorElement = document.createElement('div');
            errorElement.style.position = 'fixed';
            errorElement.style.top = '50%';
            errorElement.style.left = '50%';
            errorElement.style.transform = 'translate(-50%, -50%)';
            errorElement.style.background = 'red';
            errorElement.style.color = 'white';
            errorElement.style.padding = '20px';
            errorElement.style.zIndex = '9999'; // Ensure error is visible
            errorElement.textContent = `Animation Error: ${error.message}. Please check console.`;
            document.body.appendChild(errorElement);
        }
    }
    
    ready(initAnimation);
    
    window.addEventListener('load', function() {
        console.log('Window load event fired');
        const backgroundContainer = document.querySelector('.background-animation');
        if (backgroundContainer && !backgroundContainer.hasChildNodes()) {
            console.log('No canvas found on load, trying to initialize animation again as a fallback.');
            // Check if already initialized to prevent double animation if ready() also worked
            if (!document.querySelector('.background-animation canvas')) {
                 initAnimation();
            }
        }
    });
})();