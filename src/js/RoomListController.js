angular.module("NewIrc").controller("RoomListController", function ($scope, $location, $rootScope, $routeParams, socket) {
	//TODO GET ROOM LIST
	//
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

	$scope.logoff = function() {
		console.log($routeParams.user + " disconnected");
		socket.emit('disc', $routeParams.user);
		$location.path('/login/');
	}
	//$scope.rooms = ['Room 1','Room 2','Room 3','Room 4','Room 5'];
});