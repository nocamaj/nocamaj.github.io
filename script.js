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

function startTimer(category) {
    if (mainTimer === undefined) {
        startMainTimer();
    }

    if (categoryTimers[category]) {
        clearInterval(categoryTimers[category]);
    }

    categoryTimers[category] = setInterval(() => {
        elapsedTimes[category] += 1;
    }, 1000);
}

function startMainTimer() {
    mainTimer = setInterval(() => {
        let now = new Date();
        if (now.getHours() === 0 && now.getMinutes() === 0 && now.getSeconds() === 0) {
            endOfDay();
        }
    }, 1000);
}

function endOfDay() {
    clearInterval(mainTimer);
    for (let category in categoryTimers) {
        clearInterval(categoryTimers[category]);
    }

    addRowToTable();
    resetTimers();
    startMainTimer();
}

function addRowToTable() {
    const table = document.getElementById('timeTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    const dateCell = newRow.insertCell(0);
    dateCell.textContent = new Date().toLocaleDateString();

    for (let category in elapsedTimes) {
        const cell = newRow.insertCell();
        cell.textContent = (elapsedTimes[category] / 3600).toFixed(2); // Convert seconds to hours
    }
}

function resetTimers() {
    for (let category in elapsedTimes) {
        elapsedTimes[category] = 0;
    }
    categoryTimers = {};
}
