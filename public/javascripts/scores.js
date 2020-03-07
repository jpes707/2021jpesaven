var ajaxScores = [];
var displayString = '<h2 style="font-size: 42px;">';
var isSwitched = false;

window.onload = function () {

	var ajax_params = {
		'url': "https://user.tjhsst.edu/2021jpesaven/scoresWorker",
		'type': "get",
		'success': (responseText) => {
			ajaxScores = responseText;

			createChart();

			ajaxScores.reverse().forEach((item) => {
				displayString += item.label + ': ' + item.y + '<br>';
			});
			displayString += '</h2>'
		}
	}

	$.ajax(ajax_params);

}


let doSwitch = () => {
	if (isSwitched) {
		document.getElementById('switchButton').innerHTML = 'Switch to list mode';
		document.getElementById('chartContainer').innerHTML = '';
		createChart();
	} else {
		document.getElementById('switchButton').innerHTML = 'Switch to graph mode';
		document.getElementById('chartContainer').innerHTML = displayString;
	}
	isSwitched = !isSwitched;
}

let createChart = () => {
	var chart = new CanvasJS.Chart("chartContainer", {
		animationEnabled: true,

		title: {
			text: "IBET scores"
		},
		axisX: {
			interval: 1
		},
		axisY2: {
			interlacedColor: "rgba(121,2,1,.2)",
			gridColor: "rgba(121,2,1,.1)"
		},
		data: [{
			type: "bar",
			name: "companies",
			axisYType: "secondary",
			color: "#790201",
			dataPoints: ajaxScores
		}]
	});
	chart.render();
}