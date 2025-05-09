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

    // Clear any existing content first
    background.innerHTML = '';

    // More varied characters for a richer look
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789<>/\\{[]}+*=_-,.?:;!@#$%^&()~`"\'';
    
    // Create more columns for a denser effect
    const numColumns = Math.floor(window.innerWidth / 15); // More density
    const streamLength = 20; // Number of characters per stream

    function getRandomChar() {
        return characters[Math.floor(Math.random() * characters.length)];
    }

    function refreshCharacters(column) {
        // Periodically replace characters in the stream for more dynamic effect
        let charStream = '';
        for (let i = 0; i < streamLength; i++) {
            charStream += getRandomChar() + '<br>';
        }
        column.innerHTML = charStream;
    }

    function createColumn() {
        const column = document.createElement('div');
        column.classList.add('matrix-column');

        // Initialize with random characters
        refreshCharacters(column);

        // Random horizontal position
        column.style.left = `${Math.random() * 98}vw`; 
        
        // Randomize animation duration and delay
        const duration = Math.random() * 8 + 7; // Duration between 7s and 15s
        const delay = Math.random() * 5;        // Delay up to 5s
        
        // Random size variations for more organic feel
        const fontSize = Math.floor(Math.random() * 6) + 14; // 14px to 19px
        column.style.fontSize = `${fontSize}px`;

        // Slight color variations
        const hue = Math.random() * 30; // Subtle green variations
        column.style.color = `hsl(${120 + hue}, 100%, 50%)`;

        // Apply animation properties
        column.style.animationDuration = `${duration}s`;
        column.style.animationDelay = `${delay}s`;

        background.appendChild(column);

        // Reset animation when it ends to make it continuous
        column.addEventListener('animationend', () => {
            column.remove(); // Remove the old column
            createColumn(); // Create a new one to replace it for infinite effect
        });

        // Periodically refresh characters for more dynamism (optional)
        if (Math.random() > 0.7) { // 30% chance to have dynamic characters
            const refreshInterval = Math.random() * 1000 + 1000; // 1-2 seconds
            setInterval(() => refreshCharacters(column), refreshInterval);
        }
    }

    // Create initial columns
    for (let i = 0; i < numColumns; i++) {
        setTimeout(() => createColumn(), Math.random() * 3000); // Stagger creation for more natural feel
    }

    // Adjust on window resize
    window.addEventListener('resize', () => {
        // Remove columns that are out of bounds
        const columnsToRemove = document.querySelectorAll('.matrix-column');
        columnsToRemove.forEach(col => {
            if (Math.random() > 0.5) { // Only remove some to avoid flickering
                col.remove();
            }
        });
        
        // Calculate new density based on window width
        const newNumColumns = Math.floor(window.innerWidth / 15) - columnsToRemove.length;
        if (newNumColumns > 0) {
            for (let i = 0; i < newNumColumns; i++) {
                createColumn();
            }
        }
    });
});

