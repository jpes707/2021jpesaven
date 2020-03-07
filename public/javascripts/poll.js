$(document).ready(() => {
	var ajax_params = {
		'url': "https://user.tjhsst.edu/2021jpesaven/voting_worker",
		'type': "get",
		'success': onServerResponse
	}
	$.ajax(ajax_params)
});

let onServerResponse = (responseText) => {
	document.getElementById('p-main').innerHTML = 'Frank Murkowski: ' + responseText[0] + '<br>' + sarah + ': ' + responseText[1] + '<br>Sean Parnell: ' + responseText[2];
}

let fetchFromServer = () => {
	var radioValue = document.querySelector("input[name='choice']:checked").value;
	var ajax_params = {
		'url': "https://user.tjhsst.edu/2021jpesaven/voting_worker",
		'type': "get",
		'data': {
			'choice': radioValue
		},
		'success': onServerResponse
	}
	$.ajax(ajax_params)
}

let sarah = document.currentScript.getAttribute('id');