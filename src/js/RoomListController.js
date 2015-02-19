angular.module("NewIrc").controller("RoomListController", function ($scope, $location, $rootScope, $routeParams, socket) {
	//TODO GET ROOM LIST
	//
		$scope.currentUser = $routeParams.user;
		console.log("choo");
		socket.emit('rooms');
		socket.on('roomlist', function (data) {
			var test = [];
			var bull = data;
			var rambo;
			for(rambo in data) {
				console.log(rambo);
				test.push(rambo);
				console.log(data[rambo].users);

			}; 
			$scope.rooms = test;
		});
	//$scope.rooms = ['Room 1','Room 2','Room 3','Room 4','Room 5'];
	
})