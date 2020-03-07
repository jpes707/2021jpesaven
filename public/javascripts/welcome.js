var ajax_params1 = {
    'headers': {
        "x-requested-with": "https://ion.tjhsst.edu",
        "Access-Control-Allow-Origin": '*'
    },
	'url': 'https://cors-escape.herokuapp.com/' + 'https://ion.tjhsst.edu/api/profile?format=json',
	'type': 'get',
	'success': (responseText1) => {
	    let info = JSON.parse(responseText1);
		var ajax_params2 = {
			'url': 'https://cors-anywhere.herokuapp.com/' + info.picture,
			'type': 'get',
			'encoding': null,
			'success': (responseText2) => {
				var ajax_params3 = {
					'url': 'https://user.tjhsst.edu/2021jpesaven/initPic',
					'type': 'post',
					'data': responseText3,
					'username': info.ion_username,
					'success': (responseText3) => {
					    console.log('Posted image ' + responseText2 + ' from URL ' + info.picture);
					}
				}
				$.ajax(ajax_params3)
			}
		}
	$.ajax(ajax_params2)
	}
}
$.ajax(ajax_params1)