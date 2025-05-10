document.addEventListener('DOMContentLoaded', () => {
    console.log('Script loaded - animation initializing');

    // Clear any potential unwanted content from main
    const mainElement = document.querySelector('main');
    if (mainElement) {
        mainElement.innerHTML = '';
    }

    // Get the background container
    const backgroundContainer = document.querySelector('.background-animation');
    if (!backgroundContainer) {
        console.error('Background container not found!');
        return;
    }

    // Clear any existing content
    backgroundContainer.innerHTML = '';
    console.log('Background container found and cleared');

    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '1'; // Ensure proper z-index - make it visible!
    canvas.style.pointerEvents = 'none';
    canvas.style.display = 'block'; // Ensure the canvas is displayed
    backgroundContainer.appendChild(canvas);
    console.log('Canvas created and appended to container');

    // Set canvas size to match window
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        console.log(`Canvas resized to ${canvas.width}x${canvas.height}`);
        // Recreate grid when canvas resizes
        createGrid();
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Could not get canvas context!');
        return;
    }
    
    // Animation configuration
    const CHAR_WIDTH = 14; // Width of each character in pixels
    const CHAR_HEIGHT = 20; // Height of each character
    const ROTATION_SPEED = 0.008; // Speed of rotation in radians per frame
    
    // Character pool - select characters that look good in a grid
    const CHAR_POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789<>/{[]}+*_-=.,:;!?@#$%^&()~`"\'';
    
    // Colors for the text - using vibrant colors that stand out against dark background
    const COLORS = [
        'rgba(200, 150, 255, 1.0)', // Bright purple
        'rgba(150, 100, 255, 1.0)', // Bright indigo
        'rgba(255, 120, 220, 1.0)', // Bright pink
        'rgba(220, 180, 255, 1.0)', // Lavender
        'rgba(130, 255, 200, 1.0)', // Bright teal
        'rgba(80, 200, 255, 1.0)',  // Bright blue
        'rgba(255, 255, 130, 1.0)', // Bright yellow
        'rgba(255, 150, 50, 1.0)',  // Bright orange
        'rgba(255, 255, 255, 1.0)'  // White
    ];

    // 2D arrays for grid system
    let textGrid = []; // 2D array of characters
    let maskGrid = []; // 2D array of booleans for visibility
    let colorGrid = []; // 2D array of colors
    let rows = 0;
    let cols = 0;
    let centerRow = 0;
    let centerCol = 0;
    let currentAngle = 0;

    // Create a 2D grid of text and masks
    function createGrid() {
        console.log('Creating animation grid');
        // Calculate grid dimensions based on canvas size and character dimensions
        rows = Math.ceil(canvas.height / CHAR_HEIGHT) + 2; // Add extra rows for rotation
        cols = Math.ceil(canvas.width / CHAR_WIDTH) + 2;   // Add extra columns for rotation
        
        centerRow = Math.floor(rows / 2);
        centerCol = Math.floor(cols / 2);
        
        // Initialize grids
        textGrid = new Array(rows);
        maskGrid = new Array(rows);
        colorGrid = new Array(rows);
        
        // Fill the grid with random characters and initialize masks to false
        for (let row = 0; row < rows; row++) {
            textGrid[row] = new Array(cols);
            maskGrid[row] = new Array(cols).fill(false);
            colorGrid[row] = new Array(cols);
            
            for (let col = 0; col < cols; col++) {
                // Random character from pool
                textGrid[row][col] = CHAR_POOL.charAt(Math.floor(Math.random() * CHAR_POOL.length));
                
                // Random color from palette
                colorGrid[row][col] = COLORS[Math.floor(Math.random() * COLORS.length)];
            }
        }
        
        // Create initial mask pattern (a star/circular shape)
        createStarMask();
        console.log('Grid created successfully');
    }

    // Create a star or circular shape in the mask
    function createStarMask() {
        console.log('Creating star mask pattern');
        // Clear existing mask
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                maskGrid[row][col] = false;
            }
        }
        
        // Define the star/circular pattern
        const maxRadius = Math.min(rows, cols) * 0.4; // 40% of grid size
        const spikes = 5; // Number of spikes in the star
        
        // Draw a star shape
        for (let angle = 0; angle < Math.PI * 2; angle += 0.02) {
            // Vary radius to create star effect
            const radius = maxRadius * (0.5 + 0.5 * Math.cos(angle * spikes));
            
            // Convert polar to Cartesian coordinates
            const row = centerRow + Math.round(Math.sin(angle) * radius);
            const col = centerCol + Math.round(Math.cos(angle) * radius);
            
            // Set mask to true if within grid bounds
            if (row >= 0 && row < rows && col >= 0 && col < cols) {
                maskGrid[row][col] = true;
            }
        }
        
        // Fill some areas inside the star
        floodFill(centerRow, centerCol);
    }

    // Simple flood fill algorithm to fill the inside of the star
    function floodFill(startRow, startCol) {
        if (startRow < 0 || startRow >= rows || startCol < 0 || startCol >= cols) return;
        if (maskGrid[startRow][startCol]) return; // Already filled
        
        // Mark this cell as filled
        maskGrid[startRow][startCol] = true;
        
        // Stack-based flood fill for efficiency (avoid recursion)
        const stack = [[startRow, startCol]];
        
        while (stack.length > 0) {
            const [row, col] = stack.pop();
            
            // Check neighbors (4-way connectivity)
            const neighbors = [
                [row-1, col], // up
                [row+1, col], // down
                [row, col-1], // left
                [row, col+1]  // right
            ];
            
            for (const [r, c] of neighbors) {
                if (r >= 0 && r < rows && c >= 0 && c < cols && !maskGrid[r][c]) {
                    maskGrid[r][c] = true;
                    stack.push([r, c]);
                }
            }
        }
    }

    // Rotate the mask and update text positions
    function rotateMask() {
        // Create new temporary mask grid
        const newMask = new Array(rows);
        for (let row = 0; row < rows; row++) {
            newMask[row] = new Array(cols).fill(false);
        }
        
        // Apply rotation to each mask cell
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (maskGrid[row][col]) {
                    // Get centered coordinates
                    const y = row - centerRow;
                    const x = col - centerCol;
                    
                    // Apply rotation transform
                    const newX = x * Math.cos(ROTATION_SPEED) - y * Math.sin(ROTATION_SPEED);
                    const newY = x * Math.sin(ROTATION_SPEED) + y * Math.cos(ROTATION_SPEED);
                    
                    // Convert back to grid coordinates
                    const newRow = Math.round(newY + centerRow);
                    const newCol = Math.round(newX + centerCol);
                    
                    // Set new mask if within bounds
                    if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                        newMask[newRow][newCol] = true;
                    }
                }
            }
        }
        
        // Update the current mask
        maskGrid = newMask;
        
        // Rotate the characters in the same way
        rotateText();
    }

    // Rotate the text grid to match mask rotation
    function rotateText() {
        // Create a new text grid
        const newText = new Array(rows);
        const newColor = new Array(rows);
        
        for (let row = 0; row < rows; row++) {
            newText[row] = new Array(cols);
            newColor[row] = new Array(cols);
            
            // Fill with random characters (will be overwritten where mask is true)
            for (let col = 0; col < cols; col++) {
                newText[row][col] = CHAR_POOL.charAt(Math.floor(Math.random() * CHAR_POOL.length));
                newColor[row][col] = COLORS[Math.floor(Math.random() * COLORS.length)];
            }
        }
        
        // Transfer existing text with rotation
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                // Get centered coordinates
                const y = row - centerRow;
                const x = col - centerCol;
                
                // Apply rotation transform
                const newX = x * Math.cos(ROTATION_SPEED) - y * Math.sin(ROTATION_SPEED);
                const newY = x * Math.sin(ROTATION_SPEED) + y * Math.cos(ROTATION_SPEED);
                
                // Convert back to grid coordinates
                const newRow = Math.round(newY + centerRow);
                const newCol = Math.round(newX + centerCol);
                
                // Transfer character if within bounds
                if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                    newText[newRow][newCol] = textGrid[row][col];
                    newColor[newRow][newCol] = colorGrid[row][col];
                }
            }
        }
        
        // Update the grids
        textGrid = newText;
        colorGrid = newColor;
        
        // Update angle for tracking
        currentAngle += ROTATION_SPEED;
    }

    // Draw the grid to canvas
    function drawGrid() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Center the grid on canvas
        const offsetX = (canvas.width - cols * CHAR_WIDTH) / 2;
        const offsetY = (canvas.height - rows * CHAR_HEIGHT) / 2;
        
        // Set common text properties
        ctx.font = `${CHAR_HEIGHT}px "Courier New", monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Count drawn characters for debugging
        let drawnCount = 0;
        
        // Draw each character where mask is true
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (maskGrid[row][col]) {
                    const x = offsetX + col * CHAR_WIDTH + CHAR_WIDTH / 2;
                    const y = offsetY + row * CHAR_HEIGHT + CHAR_HEIGHT / 2;
                    
                    // Add glow effect
                    ctx.shadowColor = colorGrid[row][col];
                    ctx.shadowBlur = 10;
                    ctx.fillStyle = colorGrid[row][col];
                    
                    // Draw the character
                    ctx.fillText(textGrid[row][col], x, y);
                    drawnCount++;
                }
            }
        }
        
        if (drawnCount === 0) {
            console.warn('No characters drawn! Check mask generation.');
        } else if (drawnCount < 100) {
            console.warn(`Only ${drawnCount} characters drawn. This might be too few to be visible.`);
        }
    }

    // Animation loop
    function animate() {
        // Rotate the mask and text
        rotateMask();
        
        // Draw the grid
        drawGrid();
        
        // Request next frame
        requestAnimationFrame(animate);
    }

    console.log('Starting animation...');
    // Initialize and start animation
    createGrid();
    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        resizeCanvas();
    });
});

