var app = {};

app.util = (function (app) {
	function getUrlParameter(name) {
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
		var results = regex.exec(location.search);
		return results === null
			? ""
			: decodeURIComponent(results[1].replace(/\+/g, " "));
	}

	function actionMessage(message, $target, type, callback) {
		message = message || "";
		$target = $target.closest("div.iot-card").find(".actionMessage");
		type = type || "info";
		callback = callback || function () {};

		if ($target.html() === message) return;

		if ($target.html()) {
			$target.slideUp("fast", function () {
				$target.html("");
				$target.removeClass(function (index, className) {
					return (className.match(/(^|\s)bg-\S+/g) || []).join(" ");
				});
				if (message) return actionMessage(message, $target, type, callback);
				$target.hide();
			});
		} else {
			if (type) $target.addClass("bg-" + type);
			$target.html(message).slideDown("fast");
		}
		setTimeout(callback, 10);
	}

	$.fn.serializeObject = function () {
		var arr = $(this).serializeArray(),
			obj = {};

		for (var i = 0; i < arr.length; i++) {
			if (obj[arr[i].name] === undefined) {
				obj[arr[i].name] = arr[i].value;
			} else {
				if (!(obj[arr[i].name] instanceof Array)) {
					obj[arr[i].name] = [obj[arr[i].name]];
				}
				obj[arr[i].name].push(arr[i].value);
			}
		}
		return obj;
	};

	return {
		getUrlParameter: getUrlParameter,
		actionMessage: actionMessage,
	};
})(app);

app.api = (function (app) {
	var baseURL = "/api/v0/";

	function post(url, data, callback) {
		$.ajax({
			type: "POST",
			url: baseURL + url,
			headers: {
				//register will getr undefined token
				//login will get valid token
				"auth-token": app.auth.getToken(),
			},
			data: JSON.stringify(data),
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			complete: function (res, text) {
				callback(
					text !== "success" ? res.statusText : null,
					JSON.parse(res.responseText),
					res.status
				);
			},
		});
	}

	function put(url, data, callback) {
		$.ajax({
			type: "PUT",
			url: baseURL + url,
			headers: {
				"auth-token": app.auth.getToken(),
			},
			data: JSON.stringify(data),
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			complete: function (res, text) {
				callback(
					text !== "success" ? res.statusText : null,
					JSON.parse(res.responseText),
					res.status
				);
			},
		});
	}

	function remove(url, callback, callback2) {
		if (!$.isFunction(callback)) callback = callback2;
		$.ajax({
			type: "delete",
			url: baseURL + url,
			headers: {
				"auth-token": app.auth.getToken(),
			},
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			complete: function (res, text) {
				callback(
					text !== "success" ? res.statusText : null,
					JSON.parse(res.responseText),
					res.status
				);
			},
		});
	}

	function get(url, callback) {
		$.ajax({
			type: "GET",
			url: baseURL + url,
			headers: {
				"auth-token": app.auth.getToken(),
			},
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			complete: function (res, text) {
				callback(
					text !== "success" ? res.statusText : null,
					JSON.parse(res.responseText),
					res.status
				);
			},
		});
	}

	return { post: post, get: get, put: put, delete: remove };
})(app);

app.auth = (function (app) {
	var user = {};
	function setToken(token) {
		localStorage.setItem("APIToken", token);
	}

	function setUserId(userid) {
		console.log("userid", userid);
		localStorage.setItem("userid", userid);
	}

	function setUsername(username) {
		localStorage.setItem("username", username);
	}

	function getToken() {
		return localStorage.getItem("APIToken");
	}

	function isLoggedIn(callback) {
		if (getToken()) {
			return app.api.get("user/me", function (error, data) {
				if (!error) app.auth.user = data;
				return callback(error, data);
			});
		} else {
			callback(null, false);
		}
	}
	/*
	function logIn(args, callback) {
		app.api.post("auth/login", args, function (error, data) {
			if (data.login) {
				setToken(data.token);
			}
			callback(error, !!data.token);
		});
	}
	*/

	function logOut(callback) {
		//call logout route
		$.ajax({
			type: "DELETE",
			url: "/api/v0/user/logout",
			headers: {
				"auth-token": app.auth.getToken(),
			},
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			complete: function (res, text) {
				callback(
					text !== "success" ? res.statusText : null,
					JSON.parse(res.responseText),
					res.status
				);
			},
		});

		localStorage.removeItem("APIToken");
		localStorage.removeItem("userid");
		localStorage.removeItem("username");
		callback();
	}

	function forceLogin() {
        app.auth.isLoggedIn(function (error, isLoggedIn) {
            if (error || !isLoggedIn) {
                app.auth.logOut(function () {
                    location.replace(`/login`);
                });
            }
        });
    }

	function logInRedirect() {
		window.location.href =
			//window.location.href = location.href.replace(location.origin+'/login', '') || '/'
			location.href.replace(location.replace(`/login`)) || "/";
	}

	function homeRedirect() {
		window.location.href = location.href.replace(location.replace(`/`)) || "/";
	}

	//if isLoggedin is true, redirect user away from login / register page
	function redirectIfLoggedIn() {
		$.holdReady(true);
		app.auth.isLoggedIn(function (error, isLoggedIn) {
			if (error || isLoggedIn) {
				location.replace(`/`);
			} else {
				$.holdReady(false);
			}
		});
	}

	return {
		getToken: getToken,
		setToken: setToken,
		setUserId: setUserId,
		setUsername: setUsername,
		isLoggedIn: isLoggedIn,
		//logIn: logIn,
		logOut: logOut,
		forceLogin,
		logInRedirect,
		homeRedirect,
		redirectIfLoggedIn,
	};
})(app);

//ajax form submit
function formAJAX(btn, del) {
	event.preventDefault(); // avoid to execute the actual submit of the form.
	var $form = $(btn).closest("[action]"); // gets the 'form' parent
	var formData = $form.find("[name]").serializeObject(); // builds query formDataing
	var method = $form.attr("method") || "post";

	// if( !$form.validate()) {
	//     app.util.actionMessage('Please fix the form errors.', $form, 'danger')
	//     return false;
	// }

	app.util.actionMessage("Loading...", $form, "info");

	//console.log('Data being sent to', $form.attr('action'), formData)

	app.api[method]($form.attr("action"), formData, function (error, data) {
		//console.log('Data back from the server', error, data)
		app.util.actionMessage(data.message, $form, error ? "danger" : "success"); //re-populate table
		if (!error) {
			$form.trigger("reset");
			eval($form.attr("evalAJAX")); //gets JS to run after completion
		}
	});
}
