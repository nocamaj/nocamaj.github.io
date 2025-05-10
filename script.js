function updateAge() {
    const birthDate = new Date('2001-04-22T00:00:00');
    const now = new Date();
    const ageInMilliseconds = now - birthDate;
    const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);
    const ageWithDecimal = ageInYears.toFixed(10);

    const ageTimerElement = document.getElementById('ageTimer');
    if (ageTimerElement) {
        ageTimerElement.textContent = ageWithDecimal;
    }
}

// Update the timer every 10 milliseconds
setInterval(updateAge, 10);

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
    const totalCharacters = 150; // Adjust for desired density
    const baseRotationSpeed = 0.2;
    
    // Custom color palette with subtle blues and purples
    const colors = [
        'rgba(123, 104, 238, 0.7)', // Light purple
        'rgba(75, 0, 130, 0.7)',    // Indigo
        'rgba(106, 90, 205, 0.7)',  // Slate blue
        'rgba(138, 43, 226, 0.7)',  // Blue violet
        'rgba(153, 50, 204, 0.7)',  // Dark orchid
        'rgba(147, 112, 219, 0.7)', // Medium purple
        'rgba(72, 61, 139, 0.7)',   // Dark slate blue
        'rgba(25, 25, 112, 0.7)',   // Midnight blue
        'rgba(0, 0, 139, 0.7)'      // Dark blue
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
            const minSize = 12;
            const maxSize = 22;
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
                alpha: 0.1 + Math.random() * 0.9,
                distanceRatio: distanceRatio
            });
        }
    }

    // Animation variables
    let time = 0;
    let animationId;

    // Animation loop
    function animate() {
        // Clear canvas with semi-transparent background for trail effect
        ctx.fillStyle = 'rgba(26, 26, 26, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Center point for swirling
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        // Update and draw characters
        characters.forEach(char => {
            // Update orbit position
            char.angle += char.orbitSpeed * 0.01;
            char.rotation += char.rotationSpeed * 0.02;
            
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

