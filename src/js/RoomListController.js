angular.module("NewIrc").controller("RoomListController", function ($scope, $location, $rootScope, $routeParams, socket) {
	//TODO GET ROOM LIST
	//
		$scope.currentUser = $routeParams.user;
		console.log("choo");
		socket.emit('rooms');
		socket.on('roomlist', function (data) {
			var test = [];
			for(var x in data) {
				if(x === null){console.log("smurt rassgat !");}
				test.push(x);
			}; 
			$scope.rooms = test;
		});
	//$scope.rooms = ['Room 1','Room 2','Room 3','Room 4','Room 5'];
	
})