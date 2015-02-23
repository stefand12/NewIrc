angular.module("NewIrc").controller("RoomListController", function ($scope, $location, $rootScope, $routeParams, socket) {
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
			if($scope.roomName === '') {
				$scope.errorMessage = "Choose a name for your channel";
			} else {
				console.log("joining room: " + $scope.roomName);
				$location.path('/room/' + $scope.currentUser +'/'+ $scope.roomName +'/'+ password);
			}
		};
});