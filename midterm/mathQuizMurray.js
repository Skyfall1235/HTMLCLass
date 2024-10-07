//refs
//buttons
const addbutton = document.getElementById("add");
const subtractbutton = document.getElementById("subtract");
const multiplybutton = document.getElementById("multiply");
const dividebutton = document.getElementById("divide");
//input & submission
const inputBox = document.getElementById("input");
const submitbutton = document.getElementById("submit"); //also called solve for the images
//reponse text
const responseText = document.getElementById("responses");

//internal stuff
let answerToCheckAgainst = 0;
var currentStreak = 0;


function checkInput()
{
    var input = document.getElementById("input").value;
    var parsedinfo = parseFloat(input);
    if(isNaN(input))
    {
        //change the text here
        responseText.innerHTML = "thats not a number. please try again.";
        return;
    }
    compareAnswer(parsedinfo);
}

//is pressed when the solve button is hit
function compareAnswer(checkedInput)
{
    enableMathButtons();
    if(parseFloat(checkedInput) == parseFloat(answerToCheckAgainst))
    {
        currentStreak ++;
        responseText.innerHTML = "Correct! that is " + currentStreak + " correct.";
    }
    else
    {
        responseText.innerHTML = "Wrong! the answer was " + answerToCheckAgainst + " you put " + checkedInput;
        currentStreak = 0;
    }
    
}

//i didnt want to spend the time tryinng to condense this into 1-2 methods using an enum
function generateAddition()
{
    diableMathButtons();
    //detemine which type of question to generate
    //randomly choose 2 numbers for the math problem
    var firstNumber = Math.floor(Math.random() * 100);
    var secondNumber = Math.floor(Math.random() * 100);
    var answer = firstNumber + secondNumber;
    responseText.innerHTML = firstNumber + " + " + secondNumber + " = ? "
    answerToCheckAgainst = answer;
}

function generateSubtraction()
{
    diableMathButtons();
    //detemine which type of question to generate
    //randomly choose 2 numbers for the math problem
    var firstNumber = Math.floor(Math.random() * 100);
    var secondNumber = Math.floor(Math.random() * 100);
    var answer = firstNumber - secondNumber;
    responseText.innerHTML = firstNumber + " - " + secondNumber + " = ? "
    answerToCheckAgainst = answer;
}

function generateMultiply()
{
    diableMathButtons();
    //detemine which type of question to generate
    //randomly choose 2 numbers for the math problem
    var firstNumber = Math.floor(Math.random() * 100);
    var secondNumber = Math.floor(Math.random() * 100);
    var answer = firstNumber * secondNumber;
    responseText.innerHTML = firstNumber + " X " + secondNumber + " = ? "
    answerToCheckAgainst = answer;
}

function generateDivision()
{
    diableMathButtons();
    //detemine which type of question to generate
    //randomly choose 2 numbers for the math problem
    var firstNumber = Math.floor(Math.random() * 100);
    var secondNumber = Math.floor(Math.random() * 100);
    var answer = firstNumber / secondNumber;
    responseText.innerHTML = firstNumber + " / " + secondNumber + " = ? please round to the nearest hundredth"
    answerToCheckAgainst = answer.toFixed(2);
}


function diableMathButtons()
{
    addbutton.disabled = true;
    subtractbutton.disabled = true;
    multiplybutton.disabled = true;
    dividebutton.disabled = true;
    submitbutton.disabled = false;
}
function enableMathButtons()
{
    addbutton.disabled = false;
    subtractbutton.disabled = false;
    multiplybutton.disabled = false;
    dividebutton.disabled = false;
    submitbutton.disabled = true;
}