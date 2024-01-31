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

//socket.io
//socket.io
app.socket = (function (app) {
	//need to replace with domain name of server when published
	var socket = io();
	socket.on("disconnect", () => {
		console.log("disconnected");
	});

	socket.on('connect', ()=>{
		console.info('WS connected');
	})

	socket.io.on("reconnect", () => {
		console.log("reconnected");
	});
	socket.io.on("connect_error", (err) => {
		console.log(err);
	});
	return socket;
})(app);

//sensor data
app.sensordata = (function (app) {


})(app);


app.auth = (function (app) {
	var user = {};
	function setToken(token) {
		localStorage.setItem("APIToken", token);
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
			callback(true);
		}
	}

	function logOut(callback) {
		console.log("Logging out");
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
		callback();
	}

	function forceLogin() {
		app.auth.isLoggedIn(function (error, isLoggedIn) {
			if (error || !isLoggedIn) {
				app.auth.logOut(function () {
					window.location.href = "/login";
				});
			}
		});
	}

	function logInRedirect() {
		window.location.href =
			//window.location.href = location.href.replace(location.origin+'/login', '') || '/'
			//location.href.replace(location.replace(`/login`)) || "/";
			window.location.href = "/login"
	}

	function homeRedirect() {
		//window.location.href = location.href.replace(location.replace(`/`)) || "/";
		// location.replace(`/`);
		window.location.href = "/"
	}

	function profileRedirect() {
		// location.replace(`/profile`);
		window.location.href = "/profile"
	}

	function checkEmailRedirect(){
		// location.replace(`/checkemail`);
		window.location.href = "/checkemail"
	}

	return {
		getToken: getToken,
		setToken: setToken,
		isLoggedIn: isLoggedIn,
		logOut: logOut,
		forceLogin,
		logInRedirect,
		homeRedirect,
		profileRedirect,
		checkEmailRedirect,
	};
})(app);

app.user = (function (app) {
	//delete profile
	function deleteProfile() {
		app.api.delete("user/delete", function (error, data) {
			if (error) {
				app.util.actionMessage(error.message, $("#deleteProfile"), "danger");
			} else {
				app.auth.logOut(function () {
					location.replace(`/login`);
				});
			}
		});
	}
	return {
		deleteProfile,
	};
})(app);

//ajax form submit and pass to api
function formAJAX(btn, del) {
	event.preventDefault(); // avoid to execute the actual submit of the form.
	var $form = $(btn).closest("[action]"); // gets the 'form' parent
	var formData = $form.find("[name]").serializeObject(); // builds query formDataing
	var method = $form.attr("method") || "post";
	console.log("Form data", formData);
	console.log("Form method", method);

	app.util.actionMessage("Loading...", $form, "info");

	//console.log('Data being sent to', $form.attr('action'), formData)

	app.api[method]($form.attr("action"), formData, function (error, data) {
		console.log('Data back from the server', error, data)
		app.util.actionMessage(data.message, $form, error ? "danger" : "success"); //re-populate table
		if (!error) {
			$form.trigger("reset");
			eval($form.attr("evalAJAX")); //gets JS to run after completion
		}
	});
}
