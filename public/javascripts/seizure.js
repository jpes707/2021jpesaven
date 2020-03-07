var ctx = null;
var x_icon = 0;
var y_icon = 0;
var stepX = 3;
var stepY = 3;
var size_x = 23;
var size_y = 22;
var canvas_size_x = 5;
var canvas_size_y = 5;
var anim_img = null;

function init() {
	var canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	anim_img = new Image(size_x, size_y);
	anim_img.onload = function () {
		fakeAnim();
	}
	anim_img.src = 'media/welcome.jpg';
}

function fakeAnim() {
	ctx.clearRect(0, 0, canvas_size_x, canvas_size_y);
	ctx.drawImage(anim_img, x_icon, y_icon);
}

function seizure() {
	var canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	anim_img = new Image(size_x, size_y);
	anim_img.onload = function () {
		setInterval('myAnimation()', 5);
	}
	anim_img.src = 'media/welcome.jpg';
}

function myAnimation() {
	ctx.clearRect(0, 0, canvas_size_x, canvas_size_y);
	if (x_icon < 0 || x_icon > canvas_size_x - size_x) {
		stepX = -stepX;
	}
	if (y_icon < 0 || y_icon > canvas_size_y - size_y) {
		stepY = -stepY;
	}
	x_icon += stepX;
	y_icon += stepY;
	ctx.drawImage(anim_img, x_icon, y_icon);
	if (document.body.style.backgroundColor == "black") {
		document.body.style.backgroundColor = "white";
	} else {
		document.body.style.backgroundColor = "black";
	}
}


