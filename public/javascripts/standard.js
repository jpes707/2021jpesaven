var ajax_params = {
	'url': "https://user.tjhsst.edu/2021jpesaven/username",
	'type': "get",
	'success': (responseText) => {
		document.getElementById('username').innerHTML = responseText;
		if (responseText == 'Guest user') {
			document.getElementById('logout').innerHTML = '<a href="./?choice=2">Log in</a>';
		}
	}
}

$.ajax(ajax_params)

document.getElementById('navbar').innerHTML = '<ul class="topnav" style="width:' + window.innerWidth + ';"><li><a id="welcome" href="./">Wilkommen</a></li><li><a id="weather" href="./weather">Weather</a></li> <li><a id="identity" href="./identity">Deutscher Identitätsgenerator</a></li> <li><a id="poll" href="./poll">Favorite poll</a></li> <li><a id="europe" href="./europe">Europe quiz</a></li> <li><a id="gallery" href="./gallery">Image gallery</a></li> <li><a id="profile" href="./profile">Profile</a></li><li><a id="scores" href="./scores">IBET scores</a></li><li><a id="final" href="https://www.amazon.com/mazeboy77-Europe-Quiz/dp/B0845ZYVJV/">Final project</a></li><li style="float: right;" id="logout"><a href="./logout">Log out</a></li> <li style="padding: 14px 16px; color:#A17917; float: right;" id="username"></li> </ul>';
document.getElementById(document.currentScript.getAttribute('id')).className = 'active';