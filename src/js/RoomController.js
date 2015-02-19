angular.module("NewIrc").controller("RoomController", function ($scope, $location, $rootScope, $routeParams, socket) {
	$scope.currentUser = $routeParams.user;
	$scope.currentRoom = $routeParams.room;
	$scope.currentUsers = [];
	$scope.errorMessage = ''
	$scope.channelTopic = ''

	var test = {
		room:$routeParams.room,
		pass:''
	};
	if(test){console.log("room "+ test);}
		socket.emit('joinroom', test, function (success, reason) {
			console.log("emit called with room name: " + $routeParams.room);
		if (!success) {
				$scope.errorMessage = reason;
			}
		});
	/* emitted events */
	//socket.on('updateusers', function (roomName, users, ops) {
	//
	//	$scope.currentUsers = users;
	//});
	//socket.on('updatetopic', function () {});
	//socket.on('servermessage', function () {});
	//socket.on('updatechat', function () {});
	/*  */	
})