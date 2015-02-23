/*jslint browser:true */

angular.module("NewIrc", ["ngRoute", "luegg.directives"]).config(function ($routeProvider) {
	$routeProvider
	.when("/home", {
		templateUrl: "src/views/home.html",
		controller: "HomeController"
	})
	.when("/about", {
		templateUrl: "src/views/about.html",
		controller: "AboutController"
	})
	.when("/room/:user/:room/:pass", {
		templateUrl: "src/views/room.html",
		controller: "RoomController"
	})
	.when("/room/:user/:room", {
		templateUrl: "src/views/room.html",
		controller: "RoomController"
	})
	.when("/login", {
		templateUrl: "src/views/login.html",
		controller: "LoginController"
	})
	.when("/rooms/:user/", {
		templateUrl: "src/views/roomlist.html",
		controller: "RoomListController"
	})
	.when("/users", {
		templateUrl: "src/views/userlist.html",
		controller: "UserListController"
	})
	.when("/chat", {
		templateUrl: "src/views/chat.html",
		controller: "ChatController"
	})
	.otherwise({
		redirectTo: "/login"
	});
})
.service('sharedVariables', function ($q) {

	var self = this, 
		defer = $q.defer();

	/* */
	this.user = '';

	this.observeUser = function () {
		return defer.promise;
	};

	this.setUser = function (user) {
		console.log("Sv setting user " + user);
		self.user = user;
		defer.notify(self);
		
	};

	this.getUser = function () {
		return this.user;
	};

	/* */
	this.observeRoom = function () {
		return defer.promise;
	};
	
	this.room = "";	

	this.setRoom = function (room) {
		self.room = room;
		defer.notify(self);
	};

	this.getRoom = function () {
		return this.room;
	};

	/* */
	this.observeTmpArray = function () {
		return defer.promise;
	};

	this.tmpArray = [];

	this.setArray = function (objects) {
		self.tmpArray.push(objects);
		defer.notify(self);
	};

	this.getArray = function () {
		return this.tmpArray;
	};
})
.service('privateMessage', function () {

	this.send = function (user, socket) {
		var message = window.prompt("type in message");
		console.log("message to user" + user);
		console.log(message);
		var msgObj = {
			nick: user,
			message: message
		};
		socket.emit('privatemsg', msgObj, function (success) {
			if(!success) {
				console.log("msg failed");
			}
		});
	};
});

