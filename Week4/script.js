// Create a Player 'object'
function Player(name) 
{
    this.name = name;
    this.score = 0;
}

// initialize
const player1 = new Player("Player 1");
const player2 = new Player("Player 2");

// TIME FOR DOM ELEMENTS 
//why  DO I NEED TO LINK EVERY ONE OF THEM AAAAAAAAA
const diceCountInput = document.getElementById("diceCount");
const rollButton = document.getElementById("rollButton");
const resetButton = document.getElementById("resetButton");
const player1ScoreElement = document.getElementById("player1Score");
const player2ScoreElement = document.getElementById("player2Score");

const player1RollResultElement = document.getElementById("player1RollResult");
const player2RollResultElement = document.getElementById("player2RollResult");
const currentPlayerElement = document.getElementById("currentPlayer");

// current player
let currentPlayer = player1;

// Roll dice function
function rollDice() 
{
    const diceCount = parseInt(diceCountInput.value);
    //confirm we got numbers
    if (isNaN(diceCount) || diceCount < 1 || diceCount > 5) 
    {
        alert("Invalid input! Please enter a number between 1 and 5.");
        return;
    }

    let rollResult = 0;
    let onesCount = 0;

    for (let i = 0; i < diceCount; i++) 
    {
        const roll = Math.floor(Math.random() * 6) + 1;
        if (roll === 1) 
        {
            onesCount++;
        }
        rollResult += roll;
    }

    //check for values time to ensure the plkayer dont lose
    if (onesCount === 0) 
    {
        currentPlayer.score += rollResult;
    } 
    else if (onesCount === 1) 
    {
        currentPlayer.score = 0;
    } 
    else if (onesCount === 2) 
    {
        currentPlayer.score = Math.floor(currentPlayer.score / 2); // ensure integer score
    }

    // update UI
    updateScore();
    displayRollResult(currentPlayer, rollResult);
    checkWinner(); // check for winner after updating the score

    // switch players
    currentPlayer = currentPlayer === player1 ? player2 : player1;
    displayCurrentPlayer(); // update the display for current player
}

// update score display
function updateScore() 
{
    player1ScoreElement.textContent = player1.score;
    player2ScoreElement.textContent = player2.score;
}

// display roll result
function displayRollResult(player, result) 
{
    const rollResultElement = player === player1 ? player1RollResultElement : player2RollResultElement;
    rollResultElement.textContent = `Rolled: ${result}`;
}

// display the current player's turn
function displayCurrentPlayer() 
{
    currentPlayerElement.textContent = `It's ${currentPlayer.name}'s turn!`;
}

// check for winner
function checkWinner() 
{
    //since win condition is 100+, simple if statement should work
    if (player1.score >= 100 || player2.score >= 100) 
    {
        const winner = player1.score > player2.score ? player1 : player2; //ternairy go brrt
        alert(`${winner.name} wins!`);
        rollButton.disabled = true;  // disable the roll button after the game ends
    }
}

// Reset game functionality
resetButton.addEventListener("click", () => //another anon function
{
    //set scores and text content to default value of zero
    player1.score = 0;
    player2.score = 0;
    updateScore();
    player1RollResultElement.textContent = '';
    player2RollResultElement.textContent = '';
    currentPlayer = player1;
    rollButton.disabled = false; // rte-enable the roll button for new game
    displayCurrentPlayer(); // reset current player display
});

// event listener for roll button
rollButton.addEventListener("click", rollDice);

// initialize the score display on page load
updateScore();