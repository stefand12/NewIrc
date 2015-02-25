angular.module("NewIrc").controller("LoginController", [
	'$scope',
	 '$location',
	  '$rootScope',
	   '$routeParams',
	    'socket',
	     'sharedVariables',
	      'privateMessage',
	       function ($scope, $location, $rootScope, $routeParams, socket, sharedVariables) {
	$scope.errorMessage = '';
	$scope.nickname = '';
	$scope.login = function() {
		if ($scope.nickname === '') {
			$scope.errorMessage = 'Please choose a nick-name before continuing!';
		} else {
			socket.emit('adduser', $scope.nickname, function (available) {
				if (available) {
					sharedVariables.setUser($scope.nickname);
					$location.path('/rooms/' + $scope.nickname);
				} else {
					$scope.errorMessage = 'This nick-name is unavailable!';
				}
			});			
		}
	};
}]);