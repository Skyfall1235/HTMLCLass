//by setting these to const, we can refernce them anywherw without needing to grab it on the fly. good for mem management
const numButtonsInput = document.getElementById('numButtons');
const numParagraphsInput = document.getElementById('numParagraphs');
const submitButton = document.getElementById('submitButton');
const contentDiv = document.getElementById('content');

//event listener for the button
submitButton.addEventListener('click', () => 
    {
    //parse incoming data fro mthe fields
    const numButtons = parseInt(numButtonsInput.value);
    const numParagraphs = parseInt(numParagraphsInput.value);
    
    //check to see if the parsed nums are in the correct accepted range
    if (numButtons < 1 || numButtons > 5) 
        {
        alert('Please enter a number of buttons between 1 and 5.');
        return;
    }
    if (numParagraphs < 1 || numParagraphs > 3) 
        {
        alert('Please enter a number of paragraphs between 1 and 3.');
        return;
    }

    //set the content div to nothing for now so we can fill it with children later
    contentDiv.innerHTML = '';

    //loop through num of paragraphs and buttons, and place them appropriately
    for (let i = 1; i <= numButtons; i++) 
    {
        const button = document.createElement('button');
        button.textContent = `Button ${i}`;
        button.style.backgroundColor = getRandomColor();
        button.addEventListener('click', () => 
        {
            console.log(`Button ${i} clicked`);
            //when button click, button go poof to show it got clicked :)
            button.remove();
        });
        contentDiv.appendChild(button);
    }

    for (let i = 1; i <= numParagraphs; i++) 
        {
        const paragraph = document.createElement('p');
        paragraph.textContent = `Paragraph ${i}`;
        paragraph.style.color = getRandomColor();
        contentDiv.appendChild(paragraph);
    }
});

//hexadecimal rlly is just that easy? for a random color i suppose yes
function getRandomColor() 
{
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}