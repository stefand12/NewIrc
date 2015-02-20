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


		$scope.createRoom = function() {
			var newRoom = {
				room: $scope.roomName,
				pass: undefined
			};

			if($scope.roomName === '') {
				$scope.errorMessage = "Choose a name for your channel";
			} else {
				socket.emit('joinroom', newRoom, function (succsess, reason) {
					if(!succsess) {
						$scope.errorMessage = reason;
					} else {
						console.log("Joined room: " + newRoom.room);
						$location.path('/room/' + $scope.currentUser +'/'+ newRoom.room);
					}
				});
			}
		};
	//$scope.rooms = ['Room 1','Room 2','Room 3','Room 4','Room 5'];
});