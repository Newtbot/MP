var app = {};

/*
app.api = (function(app){
	var baseURL = '/api/v0/'

	function post(url, data, callback){
		$.ajax({
			type: 'POST',
			url: baseURL+url,
			headers:{
				'auth-token': app.auth.getToken()
			},
			data: JSON.stringify(data),
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			complete: function(res, text){
				callback(
					text !== 'success' ? res.statusText : null,
					JSON.parse(res.responseText),
					res.status
				)
			}
		});
	}

	function put(url, data, callback){
		$.ajax({
			type: 'PUT',
			url: baseURL+url,
			headers:{
				'auth-token': app.auth.getToken()
			},
			data: JSON.stringify(data),
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			complete: function(res, text){
				callback(
					text !== 'success' ? res.statusText : null,
					JSON.parse(res.responseText),
					res.status
				)
			}
		});
	}

	function remove(url, callback, callback2){
		if(!$.isFunction(callback)) callback = callback2;
		$.ajax({
			type: 'delete',
			url: baseURL+url,
			headers:{
				'auth-token': app.auth.getToken()
			},
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			complete: function(res, text){
				callback(
					text !== 'success' ? res.statusText : null,
					JSON.parse(res.responseText),
					res.status
				)
			}
		});
	}

	function get(url, callback){
		$.ajax({
			type: 'GET',
			url: baseURL+url,
			headers:{
				'auth-token': app.auth.getToken()
			},
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			complete: function(res, text){
				callback(
					text !== 'success' ? res.statusText : null,
					JSON.parse(res.responseText),
					res.status
				)
			}
		});
	}

	return {post: post, get: get, put: put, delete: remove}
})(app)
*/

app.auth = (function(app) {
	var user = {}
	function setToken(token){
		localStorage.setItem('APIToken', token);
	}

	function getToken(){
		return localStorage.getItem('APIToken');
	}

	function isLoggedIn(callback){
		if(getToken()){
			return app.api.get('user/me', function(error, data){
				if(!error) app.auth.user = data;
				return callback(error, data);
			});
		}else{
			callback(null, false);
		}
	}

	function logIn(args, callback){
		app.api.post('auth/login', args, function(error, data){
			if(data.login){
				setToken(data.token);
			}
			callback(error, !!data.token);
		});
	}

	function logOut(callback){
		localStorage.removeItem('APIToken');
		callback();
	}

	function forceLogin(){
		$.holdReady( true );
		app.auth.isLoggedIn(function(error, isLoggedIn){
			if(error || !isLoggedIn){
				app.auth.logOut(function(){})
				location.replace(`/login${location.href.replace(location.origin, '')}`);
			}else{
				$.holdReady( false );
			}
		});
	}

	function logInRedirect(){
		window.location.href = location.href.replace(location.origin+'/login', '') || '/'
	}

	return {
		getToken: getToken,
		setToken: setToken,
		isLoggedIn: isLoggedIn,
		logIn: logIn,
		logOut: logOut,
		forceLogin,
		logInRedirect,
	}

})(app);

//ajax form submit
function formAJAX( btn, del ) {
	event.preventDefault(); // avoid to execute the actual submit of the form.
	var $form = $(btn).closest( '[action]' ); // gets the 'form' parent
	var formData = $form.find( '[name]' ).serializeObject(); // builds query formDataing
	var method = $form.attr('method') || 'post';

	// if( !$form.validate()) {
	// 	app.util.actionMessage('Please fix the form errors.', $form, 'danger')
	// 	return false;
	// }
	
	app.util.actionMessage( 
		'<div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div>',
		$form,
		'info'
	);

	app.api[method]($form.attr('action'), formData, function(error, data){
		app.util.actionMessage(data.message, $form, error ? 'danger' : 'success'); //re-populate table
		if(!error){
			$form.trigger("reset");
			eval($form.attr('evalAJAX')); //gets JS to run after completion
		}
	});

}