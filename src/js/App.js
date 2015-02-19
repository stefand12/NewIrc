angular.module("NewIrc", ["ngRoute"]).config(function ($routeProvider) {
	$routeProvider
	.when("/home", {
		templateUrl: "src/views/home.html",
		controller: "HomeController"
	})
	.when("/about", {
		templateUrl: "src/views/about.html",
		controller: "AboutController"
	})
	.when("/room/:user/:room/", {
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
.service("sharedVariables", function () {
	var userInfo = '';
	
	var setUser = function (user) {
		userInfo = user;
	}

	var getUser = function (){
		return userInfo;
	}

	var roomInfo = '';
	
	var setRoom = function (room) {
		roomInfo = room;
	}

	var getRoom = function (){
		return roomInfo;
	}

	var tmpArray = [];
	var setArray = function (objects) {
		tmpArray.push(objects);
	}

	var getArray = function (){
		return tmpArray;
	}

	return {
		setUser: setUser,
		getUser: getUser,
		setRoom: setRoom,
		getRoom: getRoom,
		setArray: setArray,
		getArray: getArray
	};

});
