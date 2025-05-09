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
    const background = document.querySelector('.background-animation');
    if (!background) return;

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/{[]}+*_-.?:;!@#$%^&()';
    const numColumns = Math.floor(window.innerWidth / 20); // Adjust density by changing 20
    const streamLength = 30; // Number of characters per stream

    function getRandomChar() {
        return characters[Math.floor(Math.random() * characters.length)];
    }

    function createColumn() {
        const column = document.createElement('div');
        column.classList.add('matrix-column');

        let charStream = '';
        for (let i = 0; i < streamLength; i++) {
            charStream += getRandomChar() + '<br>'; // Use <br> for vertical stacking in CSS
        }
        column.innerHTML = charStream;

        column.style.left = `${Math.random() * 98}vw`; // Random horizontal position
        
        // Randomize animation duration and delay
        const duration = Math.random() * 5 + 5; // Duration between 5s and 10s
        const delay = Math.random() * 5;      // Delay up to 5s

        column.style.animationDuration = `${duration}s`;
        column.style.animationDelay = `${delay}s`;
        // Initial opacity to allow fade-in if desired, or controlled by animation
        column.style.opacity = '0'; 

        background.appendChild(column);

        // Reset animation when it ends to make it continuous
        column.addEventListener('animationend', () => {
            // Reset properties for re-animation
            column.remove(); // Remove the old column
            createColumn(); // Create a new one to replace it for infinite effect
        });
    }

    for (let i = 0; i < numColumns; i++) {
        createColumn();
    }

    // Optional: Adjust columns on window resize
    window.addEventListener('resize', () => {
        // Basic handling: clear and recreate. Could be optimized.
        background.innerHTML = ''; 
        const newNumColumns = Math.floor(window.innerWidth / 20);
        for (let i = 0; i < newNumColumns; i++) {
            createColumn();
        }
    });
});

