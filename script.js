document.addEventListener('DOMContentLoaded', () => {
    // Clear any potential unwanted content from main
    const mainElement = document.querySelector('main');
    if (mainElement) {
        mainElement.innerHTML = '';
    }

    const backgroundContainer = document.querySelector('.background-animation');
    if (!backgroundContainer) return;

    // Clear any existing content
    backgroundContainer.innerHTML = '';

    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1'; // Ensure it's behind other content but visible
    canvas.style.pointerEvents = 'none';
    backgroundContainer.appendChild(canvas);

    // Set canvas size to match window
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const ctx = canvas.getContext('2d');
    
    // Swirling text settings
    const textPool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789<>/{[]}+*_-.?:;!@#$%^&()~`"\'⋆⟡⚡☆ⓃⓄⒶⒽoNo∀H★☽☾♡♥';
    const characters = [];
    const totalCharacters = 300; // Even more characters
    const baseRotationSpeed = 0.4; // Faster rotation
    
    // Much brighter color palette with high contrast against dark background
    const colors = [
        'rgba(200, 150, 255, 0.9)', // Bright purple
        'rgba(150, 100, 255, 0.9)', // Bright indigo
        'rgba(255, 120, 220, 0.9)', // Bright pink
        'rgba(220, 180, 255, 0.9)', // Lavender
        'rgba(130, 255, 200, 0.9)', // Bright teal
        'rgba(80, 200, 255, 0.9)',  // Bright blue
        'rgba(255, 255, 130, 0.9)', // Bright yellow
        'rgba(255, 150, 50, 0.9)',  // Bright orange
        'rgba(255, 255, 255, 0.9)'  // White
    ];

    // Log to console to debug
    console.log('Animation script running');
    console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);

    // Initialize characters
    function createCharacters() {
        characters.length = 0; // Clear array
        console.log('Creating', totalCharacters, 'characters');
        
        for (let i = 0; i < totalCharacters; i++) {
            // Create spiral/swirl pattern
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * Math.min(canvas.width, canvas.height) * 0.45;
            
            // Calculate position
            const x = canvas.width / 2 + Math.cos(angle) * radius;
            const y = canvas.height / 2 + Math.sin(angle) * radius;
            
            // Random character from pool
            const char = textPool[Math.floor(Math.random() * textPool.length)];
            
            // Random font size based on distance from center for depth effect - LARGER
            const distanceRatio = radius / (Math.min(canvas.width, canvas.height) * 0.45);
            const minSize = 18;  // Bigger minimum size
            const maxSize = 36;  // Bigger maximum size
            const fontSize = Math.floor(minSize + (maxSize - minSize) * (1 - distanceRatio * 0.8));
            
            // Random rotation and animation parameters
            const rotationSpeed = (0.5 + Math.random() * 0.5) * baseRotationSpeed * (Math.random() > 0.5 ? 1 : -1);
            const orbitSpeed = (0.2 + Math.random() * 0.8) * baseRotationSpeed * (Math.random() > 0.5 ? 1 : -1);
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            characters.push({
                char: char,
                x: x,
                y: y,
                fontSize: fontSize,
                angle: angle,
                radius: radius,
                rotationSpeed: rotationSpeed,
                orbitSpeed: orbitSpeed,
                rotation: Math.random() * Math.PI * 2,
                color: color,
                alpha: 0.5 + Math.random() * 0.5, // Higher minimum alpha (0.5-1.0)
                distanceRatio: distanceRatio
            });
        }
    }

    // Animation variables
    let time = 0;
    let animationId;

    // Animation loop
    function animate() {
        // Clear canvas with fully opaque black background
        ctx.fillStyle = 'rgba(18, 18, 18, 1.0)'; // Slightly darker than before
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Center point for swirling
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        // Update and draw characters
        characters.forEach(char => {
            // Update orbit position
            char.angle += char.orbitSpeed * 0.03; // Even more movement
            char.rotation += char.rotationSpeed * 0.04; // Even more rotation
            
            // Calculate new position based on orbit
            char.x = centerX + Math.cos(char.angle) * char.radius;
            char.y = centerY + Math.sin(char.angle) * char.radius;
            
            // Draw character with glow effect
            ctx.save();
            ctx.translate(char.x, char.y);
            ctx.rotate(char.rotation);
            
            // Set font and color
            ctx.font = `bold ${char.fontSize}px "Courier New", monospace`;
            ctx.fillStyle = char.color;
            ctx.globalAlpha = char.alpha;
            
            // Add strong glow effect
            ctx.shadowColor = char.color;
            ctx.shadowBlur = 15; // Increased blur for more visible glow
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            
            // Draw text centered on its position
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(char.char, 0, 0);
            
            ctx.restore();
        });
        
        time += 0.01;
        animationId = requestAnimationFrame(animate);
    }

    // Debug function - Draw a test pattern to verify canvas is working
    function drawTestPattern() {
        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, 100, 100);
        ctx.fillStyle = 'green';
        ctx.fillRect(canvas.width - 100, 0, 100, 100);
        ctx.fillStyle = 'blue';
        ctx.fillRect(0, canvas.height - 100, 100, 100);
        ctx.fillStyle = 'yellow';
        ctx.fillRect(canvas.width - 100, canvas.height - 100, 100, 100);
        
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('TEST PATTERN', canvas.width/2, canvas.height/2);
        
        console.log('Test pattern drawn');
    }
    
    // Draw test pattern first to verify canvas is working
    drawTestPattern();
    
    // After a short delay, start the actual animation
    setTimeout(() => {
        // Initial setup
        createCharacters();
        animate();
        console.log('Animation started');
    }, 500);

    // Handle window resize
    window.addEventListener('resize', () => {
        // Cancel current animation
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        
        console.log('Window resized to', window.innerWidth, 'x', window.innerHeight);
        
        // Resize canvas and recreate characters
        resizeCanvas();
        createCharacters();
        
        // Restart animation
        animate();
    });
});

