function doAjax(cAns, count) {
	var ajax_params = {
		'url': "https://europemapgame.sites.tjhsst.edu/map_worker",
		'type': "get",
		'data': {
			'choice': cAns
		},
		'success': (response) => {
			leaderString = '';
			response[2].forEach((name) => {
				leaderString += '<li>' + name + '</li><br>';
			});

			document.getElementById('question').innerHTML = response[0];
			document.getElementById('score').innerHTML = 'Your score: ' + response[1];
			document.getElementById('leaderboard').innerHTML = leaderString;
			if (count < 1000) {
				console.log(response[3][0])
				doAjax(response[3][0], count + 1);
			}

		}
	}
	$.ajax(ajax_params);

}
doAjax('firstCountryCode', 0);