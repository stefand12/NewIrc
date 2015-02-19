angular.module("NewIrc").controller("ChatController", function ($scope, $location, $rootScope, $routeParams, socket) {
	$scope.message = "Hello from chat";
	$scope.messageText = "";
	$scope.currentUser = $routeParams.users;
	$scope.currentRoom = $routeParams.room;

	$scope.login = function() {
		var messageObj = {
				nick : socket.username,
				timestamp :  new Date(),
				message : messageText.substring(0, 200)
			};
			rooms[$scope.currentRoom].addMessage(messageObj);
	};
})