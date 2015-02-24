angular.module("NewIrc").controller("RoomListController", [
	'$scope',
	 '$location',
	  '$rootScope',
	   '$routeParams',
	    'socket',
	       function ($scope, $location, $rootScope, $routeParams, socket) {
	//TODO GET ROOM LIST
	//	
		if($routeParams.user === 'undefined') {
			$location.path('#/login/');
		}
		$scope.currentUser = $routeParams.user;
		socket.emit('rooms');
		socket.on('roomlist', function (data) {
			var test = [];
			var bull = data;
			var rambo;
			for(rambo in data) {
				console.log("room: " + rambo);
				test.push(rambo);
			}
			$scope.rooms = test;
		});

		$scope.roomName = '';
		$scope.errorMessage = '';


		$scope.createRoom = function (password) {
			var psWd = '';
			if($scope.roomName === '') {
				$scope.errorMessage = "Choose a name for your channel";
			} else {
				if($scope.password === undefined) {
					console.log("psWd undefined");
					$location.path('/room/' + $scope.currentUser +'/'+ $scope.roomName );
				}
				else {
					console.log("psWd else " + psWd);
					$location.path('/room/' + $scope.currentUser +'/'+ $scope.roomName +'/'+ password);
				}
			}
		};
}]);