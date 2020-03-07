const simpleoauth2 = require('simple-oauth2');
const request = require('request');
const fs = require('fs');

const cookies = require('./cookies.js');
const index = require('./index.js');
const europequiz = require('./europequiz.js');
const houses = require('./houses.js');

const ion_client_id = '5V2iLSoSzngy2wtbhDMaeOg2xIlvhtKBrRpfRNzR';
const ion_client_secret = 'PlIR2m8mPlVBCviERdUcExgvbT7gtFPCPs3Cf9jLScqVEPywhhPiKhipyczSgyYQbkLlrOLiXMyfwKquTpPbgV2bGZWvbrHefqkeDnXKm31NfWQcFFP21A4AHjFAAx24';
const ion_redirect_uri = 'https://user.tjhsst.edu/2021jpesaven/';

const oauth = simpleoauth2.create({
	client: {
		id: ion_client_id,
		secret: ion_client_secret
	},
	auth: {
		tokenHost: 'https://ion.tjhsst.edu/oauth/',
		authorizePath: 'https://ion.tjhsst.edu/oauth/authorize',
		tokenPath: 'https://ion.tjhsst.edu/oauth/token/'
	}
});

const login_url = oauth.authorizationCode.authorizeURL({
	scope: "read", // remove scope: read if you also want write access
	redirect_uri: ion_redirect_uri
});

module.exports.set = (app) => {
	app.get('/', (req, res) => {
		if (cookies.getCookie('2021jpesaven-auth', req.headers.cookie) && (cookies.getCookie('2021jpesaven-auth', req.headers.cookie) in cookies.cookiesToUser) && !cookies.cookiesToUser[cookies.getCookie('2021jpesaven-auth', req.headers.cookie)].guest) {
			res.render('index');
		} else if (req.query.code) {

			var code = req.query.code; // GET parameter
			oauth.authorizationCode.getToken({
				code: code,
				redirect_uri: ion_redirect_uri
			}).then((result) => {
				var token = oauth.accessToken.create(result);

				var refresh_token = token.token.refresh_token;
				var access_token = token.token.access_token;
				var expires_in = token.token.expires_in;

				request.get({
					url: 'https://ion.tjhsst.edu/api/profile?format=json',
					method: 'GET',
					headers: {
						'Authorization': 'Bearer ' + access_token
					}
				}, (error, response, body) => {
					info = JSON.parse(body);
					if (info.ion_username in cookies.userToCookies) {
						res.cookie('2021jpesaven-auth', cookies.userToCookies[info.ion_username]);
					} else {
						user = {
							id: info.id,
							username: info.ion_username,
							name: info.display_name,
							vote: null,
							currentQuestionId: Math.floor(Math.random() * europequiz.questions.length),
							score: 0,
							guest: false,
							guestPageCount: 0,
							counselor: info.counselor,
							absences: info.absences,
							firstName: info.first_name,
							middleName: info.middle_name,
							lastName: info.last_name
						}
						if (user.counselor) {
						    user.counselor = info.counselor.full_name
						} else {
						    user.counselor = ['Kerry Hamblin', 'Kacey McAleer', 'Sean Burke', 'Andrea Smith', 'Susan Martinez', 'Christina Ketchem'][parseInt(Math.floor(Math.random() * 6), 10)]
						}
                    houses.createUser(user.username, user.counselor);
                    request.get({
    					url: info.picture,
    					method: 'GET',
    					encoding: null,
    					headers: {
    						'Authorization': 'Bearer ' + access_token
    					}
    				}, (error, response, body) => {
    				    console.log(body);
    			        fs.writeFile('public/profile_pictures/' + info.ion_username + '.jpg', body, (err) => {
                            if (err) throw err;
                        });
    				});
                        
						cookies.cookiesToUser[access_token] = user;
						cookies.userToCookies[user.username.toString()] = access_token;
						res.cookie('2021jpesaven-auth', access_token);
					}

					index.logData();
					res.redirect('https://user.tjhsst.edu/2021jpesaven/');
				});
			});
		} else {
			cookie = cookies.getCookie('2021jpesaven-auth', req.headers.cookie);
			user = cookies.cookiesToUser[cookie];

			if (!req.query.choice && !cookie) {
				res.render('achtung');
			} else if (req.query.choice == 2) {
				res.redirect(login_url);
			} else if (req.query.choice == 1) {
				cookies.createGuestCookie(req, res);
				res.redirect('https://user.tjhsst.edu/2021jpesaven/');
			} else if (user && user.guest && user.guestPageCount > 5) {
				res.render('forcelogin');
			} else if (user && user.guest) {
				user.guestPageCount++;
				res.render('index');
			} else {
				res.render('achtung');
			}
		}
	});

	app.get('/logout', (req, res) => {
		cookie = cookies.getCookie('2021jpesaven-auth', req.headers.cookie);
		user = cookies.cookiesToUser[cookie];

		if (cookie && cookies.cookiesToUser[cookie] && cookies.cookiesToUser[cookie].guest) {
			res.render('nice_try');
			return;
		}

		res.clearCookie('2021jpesaven-auth');
		res.render('goodbye');
	});
}