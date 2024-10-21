var canvas = document.getElementById('game');
var ctx = canvas.getContext('2d');


function drawCircle(x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

//text is easy, place next to the wolf cause space is small above
ctx.font = '40px Arial';
ctx.fillStyle = 'black';
ctx.textAlign = 'center';
//text is left of image
ctx.fillText('Wolf!', 50,  canvas.width / 2); 


ctx.beginPath();
ctx.moveTo(100, 250);
ctx.quadraticCurveTo(200, 50, 300, 250); 
ctx.lineTo(300, 350); // right side of chin
ctx.lineTo(250, 300); // right jaw
ctx.lineTo(150, 300); // left jaw
ctx.lineTo(100, 350); // lft side of chin
ctx.closePath();
ctx.fillStyle = '#ccc'; // gray color for fur
ctx.fill();

// raw the eyes
drawCircle(160, 230, 15, 'black'); // left eye
drawCircle(240, 230, 15, 'black'); // right eye

// draw the wolf's nose
drawCircle(200, 280, 10, 'black'); // nose tip
ctx.beginPath();
ctx.moveTo(190, 280); // left side of the nose
ctx.lineTo(210, 280); // right side of the nose
ctx.lineTo(200, 290); // bottom of the nose
ctx.closePath();
ctx.fillStyle = 'black';
ctx.fill();

// draw the wolf's ears
ctx.beginPath();
ctx.moveTo(120, 150); // Left ear base
ctx.lineTo(160, 50); // Left ear tip
ctx.lineTo(180, 150); // Left ear base
ctx.closePath();
ctx.fillStyle = '#999'; // Darker shade for ears
ctx.fill();

ctx.beginPath();
ctx.moveTo(280, 150); // right ear base
ctx.lineTo(240, 50); // right ear tip
ctx.lineTo(220, 150); // right ear base
ctx.closePath();
ctx.fillStyle = '#999';
ctx.fill();

// draw the mouth
ctx.beginPath();
ctx.moveTo(190, 290); // Start from the left side 
ctx.quadraticCurveTo(200, 310, 210, 290); // Curve down and up
ctx.strokeStyle = 'black';
ctx.stroke();

// Draw the collar
ctx.beginPath();
ctx.moveTo(100, 350); // Left side of the neck
ctx.lineTo(300, 350); // Right side of the neck
ctx.lineTo(290, 370); // Bottom right of the collar
ctx.lineTo(110, 370); // Bottom left of the collar
ctx.closePath();
ctx.fillStyle = 'red'; // Collar color
ctx.fill();

// Add a collar tag (circle)
drawCircle(200, 380, 10, 'gold'); // Collar tag in the center