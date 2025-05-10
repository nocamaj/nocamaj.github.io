document.addEventListener('DOMContentLoaded', () => {
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
    const totalCharacters = 200; // Increased density for more visible effect
    const baseRotationSpeed = 0.3; // Increased speed for more noticeable movement
    
    // Custom color palette with more vibrant colors
    const colors = [
        'rgba(150, 130, 255, 0.8)', // Brighter purple
        'rgba(100, 30, 180, 0.8)',  // Brighter indigo
        'rgba(130, 110, 230, 0.8)', // Brighter slate blue
        'rgba(160, 60, 255, 0.8)',  // Brighter blue violet
        'rgba(180, 70, 230, 0.8)',  // Brighter dark orchid
        'rgba(200, 180, 255, 0.8)', // Brighter medium purple
        'rgba(100, 90, 180, 0.8)',  // Brighter dark slate blue
        'rgba(50, 50, 160, 0.8)',   // Brighter midnight blue
        'rgba(40, 80, 230, 0.8)'    // Brighter dark blue
    ];

    // Initialize characters
    function createCharacters() {
        characters.length = 0; // Clear array
        
        for (let i = 0; i < totalCharacters; i++) {
            // Create spiral/swirl pattern
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * Math.min(canvas.width, canvas.height) * 0.45;
            
            // Calculate position
            const x = canvas.width / 2 + Math.cos(angle) * radius;
            const y = canvas.height / 2 + Math.sin(angle) * radius;
            
            // Random character from pool
            const char = textPool[Math.floor(Math.random() * textPool.length)];
            
            // Random font size based on distance from center for depth effect
            const distanceRatio = radius / (Math.min(canvas.width, canvas.height) * 0.45);
            const minSize = 14;  // Increased minimum size
            const maxSize = 28;  // Increased maximum size
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
                alpha: 0.3 + Math.random() * 0.7, // Increased minimum alpha for better visibility
                distanceRatio: distanceRatio
            });
        }
    }

    // Animation variables
    let time = 0;
    let animationId;

    // Animation loop
    function animate() {
        // Clear canvas with fully opaque background to prevent trail effect
        ctx.fillStyle = 'rgba(26, 26, 26, 1.0)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Center point for swirling
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        // Update and draw characters
        characters.forEach(char => {
            // Update orbit position
            char.angle += char.orbitSpeed * 0.02; // Doubled for more movement
            char.rotation += char.rotationSpeed * 0.03; // Increased for more movement
            
            // Calculate new position based on orbit
            char.x = centerX + Math.cos(char.angle) * char.radius;
            char.y = centerY + Math.sin(char.angle) * char.radius;
            
            // Draw character
            ctx.save();
            ctx.translate(char.x, char.y);
            ctx.rotate(char.rotation);
            
            // Set font and color
            ctx.font = `${char.fontSize}px "Courier New", monospace`;
            ctx.fillStyle = char.color;
            ctx.globalAlpha = char.alpha;
            
            // Draw text centered on its position
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(char.char, 0, 0);
            
            // Optional: Add glow effect for better visibility
            ctx.shadowColor = char.color;
            ctx.shadowBlur = 5;
            ctx.fillText(char.char, 0, 0);
            
            ctx.restore();
        });
        
        time += 0.01;
        animationId = requestAnimationFrame(animate);
    }

    // Initial setup
    createCharacters();
    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        // Cancel current animation
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        
        // Resize canvas and recreate characters
        resizeCanvas();
        createCharacters();
        
        // Restart animation
        animate();
    });
});

