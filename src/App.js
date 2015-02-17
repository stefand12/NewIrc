angular.module("NewIrc", ["ngRoute"]).config(function ($routeProvider) {
	$routeProvider
	.when("/home", {
		templateUrl: "src/home.html",
		controller: "HomeController"
	})
	.when("/about", {
		templateUrl: "src/about.html",
		controller: "AboutController"
	})
	.otherwise({
		redirectTo: "/home/index"
	});
});

angular.module("NewIrc").controller("HomeController", function ($scope) {
	$scope.message = "Hello from home";
});

angular.module("NewIrc").controller("AboutController", function ($scope) {
	$scope.message = "Hello from about";
});