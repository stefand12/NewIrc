angular.module("NewIrc").controller("HomeController", function ($scope, $scope, $location, $rootScope, $routeParams, socket) {
	$scope.message = "Hello from home";

	$scope.logoff = function() {
		console.log($routeParams.user + " disconnected");
		socket.emit('disc', $routeParams.user);
		$location.path('/login/');
	}

	$scope.home = function () {
		console.log("home pushed");
		$location.path('#/rooms/:' + $routeParams.user);
	}


});