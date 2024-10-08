// Event listener for key presses
document.addEventListener('keydown', (event) => {
    const paragraph = document.getElementById('BasicText');
    switch (event.key) {
        case 'R':
            paragraph.style.color = 'red';
            break;
        case 'G':
            paragraph.style.color = 'green';
            break;
        case 'P':
            paragraph.style.color = 'purple';
            break;
        case 'O':
            paragraph.style.color = 'orange';
            break;
        case 'B':
            paragraph.style.color = 'black';
            break;
    }
});

// Event listener for mouse hover on heading
document.getElementById('Heading').addEventListener('mouseover', () => {
    document.getElementById('Heading').style.fontSize = '24px';
});

document.getElementById('Heading').addEventListener('mouseout', () => {
    document.getElementById('Heading').style.fontSize = '18px';
});

// Event listener for button clicks
document.getElementById('ColorButton').addEventListener('click', () => {
    document.body.style.backgroundColor = getRandomColor();
});

document.getElementById('NumberButton').addEventListener('click', () => {
    document.getElementById('NumberButton').textContent = getRandomNumber(1, 10);
});

// Helper function to generate a random color
function getRandomColor() {
    const colors = ['red', 'green', 'blue', 'yellow', 'purple'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Helper function to generate a random number
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}