function updateAge() {
    const birthDate = new Date('2001-04-22T00:00:00');
    const now = new Date();
    const ageInMilliseconds = now - birthDate;
    const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);
    const ageWithDecimal = ageInYears.toFixed(10);

    document.getElementById('ageTimer').textContent = ageWithDecimal;
}

// Update the timer every 10 milliseconds
setInterval(updateAge, 10);

document.addEventListener('DOMContentLoaded', () => {
    // Set up animated background
    const backgroundAnimation = document.querySelector('.background-animation');
    if (!backgroundAnimation) return;
    
    // Create a gradient background
    backgroundAnimation.style.background = 'linear-gradient(300deg, #00356B, #1a1a1a, #502274)';
    backgroundAnimation.style.backgroundSize = '300% 300%';
    backgroundAnimation.style.animation = 'gradient-animation 15s ease infinite';
    
    // Add the SVG noise effect to simulate the swirling text look
    const svgFilter = `
    <svg style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; opacity: 0.2;" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <filter id="noise">
                <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
                <feDisplacementMap in="SourceGraphic" scale="10"/>
            </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#noise)"/>
    </svg>`;
    
    backgroundAnimation.innerHTML = svgFilter;
    
    // Add keyframes for the gradient animation if not already in the stylesheet
    if (!document.querySelector('#gradient-animation-style')) {
        const style = document.createElement('style');
        style.id = 'gradient-animation-style';
        style.textContent = `
            @keyframes gradient-animation {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Create a simple canvas animation for the swirling text effect
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.opacity = '0.3';
    canvas.style.pointerEvents = 'none';
    backgroundAnimation.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789<>/?[]{}|=+-_)(*&^%$#@!~';
    
    // Create an array of character objects
    const textParticles = [];
    const numParticles = 100; // Adjust based on performance
    
    for (let i = 0; i < numParticles; i++) {
        textParticles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: 50 + Math.random() * 100,
            angle: Math.random() * Math.PI * 2,
            speed: 0.005 + Math.random() * 0.01,
            character: characters.charAt(Math.floor(Math.random() * characters.length)),
            size: 8 + Math.floor(Math.random() * 14)
        });
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.font = 'bold 14px monospace';
        
        textParticles.forEach(particle => {
            // Update position
            particle.angle += particle.speed;
            particle.x = canvas.width / 2 + Math.cos(particle.angle) * particle.radius;
            particle.y = canvas.height / 2 + Math.sin(particle.angle) * particle.radius;
            
            // Draw character
            ctx.font = `${particle.size}px monospace`;
            ctx.fillText(particle.character, particle.x, particle.y);
            
            // Occasionally change character
            if (Math.random() < 0.01) {
                particle.character = characters.charAt(Math.floor(Math.random() * characters.length));
            }
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
});

