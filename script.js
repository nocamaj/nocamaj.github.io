// Wrap in an IIFE to avoid global scope pollution
(function() {
    console.log('Swirling ASCII animation script loading...');

    function ready(callback) {
        if (document.readyState !== 'loading') {
            callback();
        } else {
            document.addEventListener('DOMContentLoaded', callback);
        }
    }

    function initAnimation() {
        try {
            console.log('Animation initialization started');
            
            const backgroundContainer = document.querySelector('.background-animation');
            if (!backgroundContainer) {
                throw new Error('Background container not found! (.background-animation)');
            }
            backgroundContainer.innerHTML = ''; // Clear previous canvas if any
            
            const canvas = document.createElement('canvas');
            // Styles for position, size are handled by CSS for .background-animation and .background-animation canvas
            backgroundContainer.appendChild(canvas);
            console.log('Canvas element created and appended');
            
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                throw new Error('Failed to get canvas 2D context');
            }

            let animationFrameId;
            let particles = [];
            let time = 0;

            // --- Configuration ---
            const config = {
                particleCount: calculateParticleCount(), // Adjust based on screen size
                baseCharSize: 12,
                charSizeVariance: 6,
                baseSpeed: 0.3,
                speedVariance: 0.2,
                colors: [
                    'rgba(180, 180, 220, 0.7)', // Light lavender
                    'rgba(200, 200, 220, 0.8)', // Lighter lavender
                    'rgba(150, 180, 230, 0.7)', // Light blue
                    'rgba(220, 220, 240, 0.9)', // Very light lavender/almost white
                    'rgba(190, 190, 190, 0.6)'  // Grey
                ],
                charSet: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-=_+[]{}|;:',./<>?`~ ",
                canvasClearColor: 'rgba(10, 10, 20, 1)', // Very dark blue, opaque
                noiseScale: 0.001, // For Perlin-like noise effect on movement
                swirlStrength: 0.5, // How much particles adhere to a swirl pattern
                depthEffect: 0.5 // How much z affects size and speed
            };

            function calculateParticleCount() {
                // Simple heuristic: more particles for larger screens
                return Math.floor((window.innerWidth * window.innerHeight) / 8000);
            }
            
            function getRandomChar() {
                return config.charSet.charAt(Math.floor(Math.random() * config.charSet.length));
            }

            class Particle {
                constructor() {
                    this.reset();
                }

                reset() {
                    this.x = Math.random() * canvas.width;
                    this.y = Math.random() * canvas.height;
                    // z represents depth: 0.5 (far) to 1.5 (near)
                    this.z = (Math.random() * 1.0) + 0.5; 
                    
                    this.char = getRandomChar();
                    this.color = config.colors[Math.floor(Math.random() * config.colors.length)];
                    
                    this.size = (config.baseCharSize + (Math.random() * config.charSizeVariance) - config.charSizeVariance / 2) * (1 + (this.z - 1) * config.depthEffect);
                    this.size = Math.max(5, this.size); // Minimum size

                    this.alpha = 0.1 + Math.random() * 0.8 * (1 + (this.z -1) * 0.3);


                    // Velocity components
                    this.vx = (Math.random() - 0.5) * (config.baseSpeed + Math.random() * config.speedVariance);
                    this.vy = (Math.random() - 0.5) * (config.baseSpeed + Math.random() * config.speedVariance);

                    // For more complex motion, store noise offsets
                    this.noiseOffsetX = Math.random() * 1000;
                    this.noiseOffsetY = Math.random() * 1000;
                    this.life = 100 + Math.random() * 200; // Frames before potential change
                }

                update() {
                    // Simple noise-based movement for a flowing effect
                    const angleX = simpleNoise(this.noiseOffsetX + time * 0.002, this.y * config.noiseScale) * Math.PI * 2;
                    const angleY = simpleNoise(this.noiseOffsetY + time * 0.002, this.x * config.noiseScale) * Math.PI * 2;

                    this.vx += (Math.cos(angleX) - this.vx) * 0.05 * this.z;
                    this.vy += (Math.sin(angleY) - this.vy) * 0.05 * this.z;
                    
                    // Swirl around center (optional, can be subtle)
                    const dx = canvas.width / 2 - this.x;
                    const dy = canvas.height / 2 - this.y;
                    const dist = Math.sqrt(dx*dx + dy*dy) + 1; // +1 to avoid div by zero
                    this.vx += (dy / dist) * config.swirlStrength * 0.01 * this.z;
                    this.vy -= (dx / dist) * config.swirlStrength * 0.01 * this.z;


                    // Max speed
                    const maxSpeed = (config.baseSpeed + config.speedVariance) * this.z;
                    const currentSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                    if (currentSpeed > maxSpeed) {
                        this.vx = (this.vx / currentSpeed) * maxSpeed;
                        this.vy = (this.vy / currentSpeed) * maxSpeed;
                    }

                    this.x += this.vx;
                    this.y += this.vy;

                    // Boundary check and reset
                    if (this.x < -this.size || this.x > canvas.width + this.size ||
                        this.y < -this.size || this.y > canvas.height + this.size) {
                        this.reset();
                        // Place on opposite edge for continuous flow
                        if (this.vx > 0 && this.x > canvas.width) this.x = -this.size;
                        else if (this.vx < 0 && this.x < 0) this.x = canvas.width + this.size;
                        if (this.vy > 0 && this.y > canvas.height) this.y = -this.size;
                        else if (this.vy < 0 && this.y < 0) this.y = canvas.height + this.size;
                    }

                    this.life--;
                    if (this.life <= 0 || Math.random() < 0.01) { // Occasionally change char or fully reset
                        this.char = getRandomChar();
                        if (Math.random() < 0.05) this.reset(); // Full reset less often
                        else this.life = 100 + Math.random() * 200;
                    }
                }

                draw() {
                    ctx.font = `bold ${Math.max(5, this.size)}px monospace`;
                    ctx.fillStyle = this.color.replace(/,\s*\d(\.\d+)?\)/, `, ${this.alpha})`); // Update alpha in rgba string
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(this.char, this.x, this.y);
                }
            }
            
            // Basic pseudo-random noise function (not true Perlin, but helps create variety)
            function simpleNoise(x, y = 0) {
                const RND_A = 134775813;
                const RND_M = 2147483647;
                const RND_C = 1;
                let seed = (Math.floor(x * 1000) + Math.floor(y * 1000)) % RND_M;
                seed = (seed * RND_A + RND_C) % RND_M;
                return (seed / RND_M);
            }


            function setupAndRunAnimation() {
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                }

                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                console.log(`Canvas size set to ${canvas.width}x${canvas.height}`);
                
                config.particleCount = calculateParticleCount();
                particles = [];
                for (let i = 0; i < config.particleCount; i++) {
                    particles.push(new Particle());
                }
                console.log(`Initialized ${particles.length} particles.`);

                time = 0;
                animate();
            }
            
            function animate() {
                time++;
                ctx.fillStyle = config.canvasClearColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                particles.forEach(particle => {
                    particle.update();
                    particle.draw();
                });
                
                animationFrameId = requestAnimationFrame(animate);
            }
            
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
            Object.assign(errorElement.style, {
                position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                background: 'red', color: 'white', padding: '20px', zIndex: '9999',
                border: '2px solid white', borderRadius: '5px', textAlign: 'center'
            });
            errorElement.innerHTML = `<strong>Animation Error:</strong><br>${error.message}<br><small>Please check the console (F12) for more details.</small>`;
            document.body.appendChild(errorElement);
        }
    }
    
    ready(initAnimation);
    
    // Fallback for window.load if DOMContentLoaded didn't catch it or canvas isn't there
    window.addEventListener('load', function() {
        const backgroundContainer = document.querySelector('.background-animation');
        if (backgroundContainer && !backgroundContainer.querySelector('canvas')) {
            console.log('No canvas found on window.load, attempting to initialize animation.');
            initAnimation();
        }
    });

})();