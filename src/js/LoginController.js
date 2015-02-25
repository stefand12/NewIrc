/* LoginController */

/*
	LoginController sér um að logga user in.
	tekur inn socket og sharedVariables til að 
	uppfæra notenda fyrir aðra controllera
*/
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

		/*
			Function sem sér um að logga þig inn
			emittar adduser eventi á server sem 
			síðan svara hvort það hafi tekist eða ekki.
			redirectar eftir því á roomcontroller eða ekki.
		*/
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
	}
]);