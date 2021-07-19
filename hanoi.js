// runs when the window loads in
window.onload = function() {
	// set canvas dimensions
	var canvas = document.getElementById("sim");
	canvas.width = window.innerWidth * 0.95;
	canvas.height = window.innerHeight * 0.7;
	
	// add an eventlistener to the run button
	document.getElementById("solve").addEventListener("click", function(e) {
		// prevent page refresh on submit
		e.preventDefault();
		run();
	});
}

// prepare to run the solver
function run() {
	// get input
	var size = document.getElementById("size").value, errMsg = document.getElementById("error");
	
	// give error message if the input is not within the set range
	if (!(size <= 9 && size >= 1)) {
		errMsg.innerHTML = "Invalid number of layers: please enter a value between 1 and 9";
		console.log("Invalid Number of Layers");
		return 1;
	} else {
		errMsg.innerHTML = "";
	}
	
	var canvas = document.getElementById("sim");
	var c = canvas.getContext("2d");
	
	// clean slate: clear canvas and reset towers to initiated state, with an id in the first index
	c.clearRect(0, 0, canvas.width, canvas.height);
	var src = [1], dest = [2], aux = [3];
	
	// set the disk sizes
	var x = 5 + Math.floor(canvas.width / 60), w = 10 + Math.floor(canvas.width / 30), h = 10 + Math.floor(canvas.height / 50);
	
	// draw initial tower and fill starting array
	for (var layer = 0; layer < size; layer++) {
		src.push(size - layer);
		c.fillStyle = colour(size - layer);
		c.fillRect(Math.floor(canvas.width * 0.01 + x / 2 * layer), Math.floor(canvas.height - (layer + 1) * h), w + x * (size - layer), h);
	}
	
	// start the recursive function
	var towers = [src, dest, aux], rect = [x, w, h, size];
	hanoi(size, towers, rect);
}

// recursize solving algorithm
async function hanoi(disk, towers, rect, move) {
	// set the solving speed
	var delay = document.getElementById("speed").value;
	
	// base case or moving a disk
	if (disk == 1 || move) {
		// remove the disk from the top of the original tower, then add it to the top of the target tower
		towers[0].pop();
		towers[1].push(disk);
		
		// delay to draw each step
		await new Promise(r => setTimeout(r, 1000 / delay));
		
		// draw the disk movement
		draw(towers[0], towers[1], disk, rect);
	} else {
		// update the local towers with the changes from the recursion
		var updated = await hanoi(disk - 1, [towers[0], towers[2], towers[1]], rect);
		towers = [updated[0], updated[2], updated[1]];
		
		// move disk
		towers = await hanoi(disk, [towers[0], towers[1], towers[2]], rect, true);
		
		// update the local towers with the changes from the recursion
		updated = await hanoi(disk - 1, [towers[2], towers[1], towers[0]], rect);
		towers = [updated[2], updated[1], updated[0]];
	}
	// pass down new tower data
	return towers;
}

// draw the towers on the canvas
function draw(src, dest, size, rect) {
	var canvas = document.getElementById("sim");
	var c = canvas.getContext("2d");
	
	// declare coordinate variables and set the disk dimensions
	var x, y, w = rect[1] + rect[0] * size, h = rect[2];
	
	// print the move
	console.log("disk " + size + " from " + src[0] + " to " + dest[0]);
	
	// set the color according to the disk size
	c.fillStyle = colour(size);
	
	function position(tower) {
		if (tower == 1) {
			x = Math.floor(canvas.width * 0.01 + rect[0] / 2 * (rect[3] - size));
		} else if (tower == 2) {
			x = Math.floor((canvas.width - rect[0] * size) / 2);
		} else if (tower == 3) {
			x = Math.floor(canvas.width * 0.98 - (rect[0] * size + (rect[1] + rect[0] * rect[3])) / 2);
		}
	}
	
	// erase the disk at the source position
	position(src[0]);
	y = Math.floor(canvas.height - src.length * rect[2]);
	c.clearRect(x, y, w, h);
	
	// draw the disk at the destination position
	position(dest[0]);
	y = canvas.height - (dest.length - 1) * rect[2];
	c.fillRect(x, y, w, h);
}

// set the disk fillStyle colour depending on its size
function colour(size) {
	if (size == 1) {
		return "red";
	} else if (size == 2) {
		return "orange";
	} else if (size == 3) {
		return "yellow";
	} else if (size == 4) {
		return "lightgreen";
	} else if (size == 5) {
		return "green";
	} else if (size == 6) {
		return "lightblue";
	} else if (size == 7) {
		return "blue";
	} else if (size == 8) {
		return "purple";
	} else if (size == 9) {
		return "pink";
	}
}