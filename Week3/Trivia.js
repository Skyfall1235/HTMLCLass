//Wyatt murray, SGD html class with ven lewis
function startCountdown() 
{
    //thank god we can save these, i had to check but this does work
    var inputValue = document.getElementById("countdownInput").value;
    var countdownDisplay = document.getElementById("countdownDisplay");

    //error check for non numbers
    if (isNaN(inputValue) || inputValue <= 0) 
    {
        countdownDisplay.textContent = "Please enter a positive number";
    } 
    else 
    {
        //parse inputs and display
        var count = parseInt(inputValue);
        countdownDisplay.textContent = count;

        var intervalId = setInterval( function()  //local function brrrt
        //i wish linq existed so i could do anon functions instead of whatever this is
        {
            if (count > 0) 
            {
                count--;
                countdownDisplay.textContent = count;
            } 
            else 
            {
                //countdown complete, end and say so
                clearInterval(intervalId);
                countdownDisplay.textContent = "Countdown complete!";
            }
        }, 1000); //updates every second cause miliseconds exist
    }
}

function checkPalindrome() 
{
    var inputText = document.getElementById("palindromeInput").value;
    var cleanedText = inputText.toLowerCase().replace(/\s/g, ''); //I ripped this line from stack overflow i wont even deny. it removes spaces from text

    var reversedText = cleanedText.split('').reverse().join(''); //split, reverse, join. easy enough

    if(reversedText.length === 0)
    {
        document.getElementById("palindromeResult").textContent = "There is nothing in the text box.";
        return;
    }
    
    if (cleanedText === reversedText) 
    {
        //why cant i save this location as a varaible i wish to cry
        document.getElementById("palindromeResult").textContent = "Its a palindrome!";
    } 
    else 
    {
        document.getElementById("palindromeResult").textContent = "Its not a palindrome.";   

    }
}