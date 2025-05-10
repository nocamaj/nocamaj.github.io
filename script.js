// Wrap in an IIFE to avoid global scope pollution
(function() {
    // Log that script has started loading
    console.log('Animation script loading...');

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
            
            // Get the background container
            const backgroundContainer = document.querySelector('.background-animation');
            if (!backgroundContainer) {
                throw new Error('Background container not found! (.background-animation)');
            }
            console.log('Found background container:', backgroundContainer);

            // Clear existing content
            backgroundContainer.innerHTML = '';
            
            // Create and append canvas with inline styles
            const canvas = document.createElement('canvas');
            Object.assign(canvas.style, {
                position: 'absolute',
                top: '0',
                left: '0',
                width: '100vw',
                height: '100vh',
                zIndex: '5',
                display: 'block',
                pointerEvents: 'none'
            });
            backgroundContainer.appendChild(canvas);
            console.log('Canvas element created and appended');
            
            // Set canvas dimensions
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            console.log(`Canvas size set to ${canvas.width}x${canvas.height}`);
            
            // Get 2D context
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                throw new Error('Failed to get canvas 2D context');
            }
            
            // Animation configuration
            const config = {
                particleCount: 100,
                particleSize: 20,
                rotationSpeed: 0.01,
                colors: [
                    '#FF00FF', // Magenta
                    '#00FFFF', // Cyan
                    '#FFFF00', // Yellow
                    '#FFFFFF'  // White
                ]
            };
            
            // Create particles
            const particles = [];
            for (let i = 0; i < config.particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: config.particleSize,
                    color: config.colors[Math.floor(Math.random() * config.colors.length)],
                    char: getRandomChar(),
                    angle: Math.random() * Math.PI * 2,
                    speed: 0.2 + Math.random() * 0.5
                });
            }
            
            // Function to get random character
            function getRandomChar() {
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789<>[]{}=+-*/%$#@!?';
                return chars.charAt(Math.floor(Math.random() * chars.length));
            }
            
            // Main animation loop
            let frameCount = 0;
            function animate() {
                frameCount++;
                
                // Clear canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // Draw every particle
                particles.forEach(particle => {
                    // Update position (circular motion)
                    particle.angle += particle.speed * 0.01;
                    
                    // Calculate position in a star-like pattern
                    const distanceFromCenter = Math.min(canvas.width, canvas.height) * 0.3;
                    const centerX = canvas.width / 2;
                    const centerY = canvas.height / 2;
                    
                    particle.x = centerX + Math.cos(particle.angle) * distanceFromCenter;
                    particle.y = centerY + Math.sin(particle.angle) * distanceFromCenter;
                    
                    // Draw particle
                    ctx.save();
                    ctx.fillStyle = particle.color;
                    ctx.shadowColor = particle.color;
                    ctx.shadowBlur = 15;
                    ctx.font = `${particle.size}px monospace`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(particle.char, particle.x, particle.y);
                    ctx.restore();
                    
                    // Occasionally change character
                    if (Math.random() < 0.05) {
                        particle.char = getRandomChar();
                    }
                });
                
                // Log every 100 frames for debugging
                if (frameCount % 100 === 0) {
                    console.log(`Animation running - frame ${frameCount}`);
                }
                
                // Request next frame
                requestAnimationFrame(animate);
            }
            
            // Start animation
            console.log('Starting animation loop');
            animate();
            
            // Handle resize
            window.addEventListener('resize', function() {
                console.log('Window resized');
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                console.log(`Canvas resized to ${canvas.width}x${canvas.height}`);
            });
            
            console.log('Animation setup complete');
        } catch (error) {
            console.error('Animation initialization failed:', error);
            // Try to display a visible error message on the page
            const errorElement = document.createElement('div');
            errorElement.style.position = 'fixed';
            errorElement.style.top = '50%';
            errorElement.style.left = '50%';
            errorElement.style.transform = 'translate(-50%, -50%)';
            errorElement.style.background = 'red';
            errorElement.style.color = 'white';
            errorElement.style.padding = '20px';
            errorElement.style.zIndex = '9999';
            errorElement.textContent = `Animation Error: ${error.message}`;
            document.body.appendChild(errorElement);
        }
    }
    
    // Initialize animation when DOM is ready
    ready(initAnimation);
    
    // Also add a fallback
    window.addEventListener('load', function() {
        console.log('Window load event fired');
        const backgroundContainer = document.querySelector('.background-animation');
        if (backgroundContainer && !backgroundContainer.hasChildNodes()) {
            console.log('No canvas found on load, trying again');
            initAnimation();
        }
    });
})();

