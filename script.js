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

let mainTimer;
let categoryTimers = {};
let elapsedTimes = {
    working: 0,
    learning: 0,
    building: 0,
    training: 0,
    socializing: 0,
    maintaining: 0,
    inTransit: 0,
    slacking: 0,
    resting: 0
};

let currentCategory = null;

function startTimer(category) {
    if (mainTimer === undefined) {
        startMainTimer();
    }

    if (currentCategory && currentCategory !== category) {
        clearInterval(categoryTimers[currentCategory]);
    }

    currentCategory = category;

    if (!categoryTimers[category]) {
        categoryTimers[category] = setInterval(() => {
            elapsedTimes[category] += 1;
            updateTable();
        }, 1000);
    }
}

function startMainTimer() {
    let startTime = new Date().setHours(0, 0, 0, 0); // Midnight

    mainTimer = setInterval(() => {
        let now = new Date();
        let elapsed = now - startTime;
        
        let hours = Math.floor((elapsed / (1000 * 60 * 60)) % 24);
        let minutes = Math.floor((elapsed / (1000 * 60)) % 60);
        let seconds = Math.floor((elapsed / 1000) % 60);

        document.getElementById('mainTimer').textContent = 
            `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

        if (hours === 0 && minutes === 0 && seconds === 0) {
            endOfDay();
            startTime = new Date().setHours(0, 0, 0, 0); // Reset start time for next day
        }
    }, 1000);
}

function pad(value) {
    return value < 10 ? '0' + value : value;
}

function updateTable() {
    let tbody = document.getElementById('timeTable').getElementsByTagName('tbody')[0];
    if (tbody.rows.length === 0) {
        addRowToTable();
    }

    let currentRow = tbody.rows[tbody.rows.length - 1];

    for (let category in elapsedTimes) {
        let index = Object.keys(elapsedTimes).indexOf(category) + 1; // +1 because the date is in the first cell
        currentRow.cells[index].textContent = (elapsedTimes[category] / 3600).toFixed(2); // Convert seconds to hours
    }
}

function addRowToTable() {
    const table = document.getElementById('timeTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    const dateCell = newRow.insertCell(0);
    dateCell.textContent = new Date().toLocaleDateString();

    for (let category in elapsedTimes) {
        const cell = newRow.insertCell();
        cell.textContent = "0.00";
    }
}

function endOfDay() {
    clearInterval(mainTimer);
    for (let category in categoryTimers) {
        clearInterval(categoryTimers[category]);
    }

    // Add row for the next day
    addRowToTable();

    // Reset elapsed times
    for (let category in elapsedTimes) {
        elapsedTimes[category] = 0;
    }
    categoryTimers = {};
    currentCategory = null;

    startMainTimer(); // Restart main timer for the new day
}
