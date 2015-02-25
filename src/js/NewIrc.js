/*jslint browser:true */
/* NewIrc + routeProvider config*/

/*
	Hér er declerationið af NewIrc
	Einnig eru hér skigreind route'in sem við notum 
	í NewIrc til að beina á controllera.
*/
angular.module("NewIrc", ['ngRoute', 'luegg.directives']).config(['$routeProvider',
	function ($routeProvider) {
		$routeProvider
		.when("/home", {
			templateUrl: "src/views/home.html",
			controller: "HomeController"
		})
		.when("/about/:user", {
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
	}
]);


