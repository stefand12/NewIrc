angular.module("NewIrc").controller("LoginController", function ($scope, $location, $rootScope, $routeParams, socket) {
	$scope.errorMessage = '';
	$scope.nickname = '';

	$scope.login = function() {			
		if ($scope.nickname === '') {
			$scope.errorMessage = 'Please choose a nick-name before continuing!';
		} else {
			socket.emit('adduser', $scope.nickname, function (available) {
				if (available) {
					console.log("logged in as " + $scope.nickname);
					//$location.path('/chat' + $scope.nickname);
				} else {
					console.log("ertu endaþarms blóðmörskeppur ? ");
					$scope.errorMessage = 'This nick-name is already taken!';
				}
			});			
		}
	};
})