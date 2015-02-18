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
		.when("/room", {
		templateUrl: "src/views/room.html",
		controller: "RoomController"
	})
			.when("/login", {
		templateUrl: "src/views/login.html",
		controller: "LoginController"
	})
				.when("/rooms", {
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
		redirectTo: "/home/index"
	});
});
