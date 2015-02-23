
angular.module("NewIrc").controller("HomeController", function ($scope, $location, $rootScope, $routeParams, socket, sharedVariables) {
	$scope.privateMessages = [];
	$scope.newMessage = false;
	$scope.currentUser = sharedVariables.getUser();
	$scope.message = "Hello from home: " + $scope.currentUser;

	socket.on('recv_privatemsg', function (userName, message) {
		var privateMsg = {
			from: userName,
			msg: message
		};
		$scope.privateMessages.push(privateMsg);
		$scope.newMessage = true;
	});

	sharedVariables.observeUser().then(null, null, function (user) {
		console.log("er að kalla í functionið." + user);
    	$scope.currentUser = user;
    	$scope.message = $scope.currentUser;
	});

	$scope.logoff = function () {
		console.log($routeParams.user + " disconnected");
		socket.emit('disc', $routeParams.user);
		sharedVariables.setUser('');
		$location.path('/login/');
	};
});