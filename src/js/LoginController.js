angular.module("NewIrc").controller("LoginController", function ($scope, $location, $rootScope, $routeParams, socket) {
	$scope.errorMessage = '';
	$scope.nickname = '';
//<input class="login-button btn-block" type="submit" ng-click="login()" value="Login »">
	$scope.login = function() {			
		if ($scope.nickname === '') {
			$scope.errorMessage = 'Please choose a nick-name before continuing!';
		} else {
			socket.emit('adduser', $scope.nickname, function (available) {
				if (available) {
					console.log("logged in as " + $scope.nickname);
					$location.path('/rooms/' + $scope.nickname);
				} else {
					console.log("nei ekki hægt ");
					$scope.errorMessage = 'This nick-name is already taken!';
				}
			});			
		}
	};
//<input class="login-button btn-block" type="submit" ng-click="logoff()" value="LogOff »">

});