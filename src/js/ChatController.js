/* ChatController */
/*
	Controller sem sér um að senda skilaboð inn á rásir á server 
	sem eru síðan updated af RoomController, tekur inn socket og
	sharedVariables services, til að geta talað á milli controllera
*/
angular.module("NewIrc").controller("ChatController", [
	'$scope',
	'$location',
	'$rootScope',
	'$routeParams',
	'socket',
	'sharedVariables',
	function ($scope, $location, $rootScope, $routeParams, socket, sharedVariables) {
		$scope.message = "You are logged in as:";
		$scope.msgText = '';
		$scope.currentUser = sharedVariables.getUser();
		$scope.currentRoom = sharedVariables.getRoom();

		/*
			function sem hlustar 'eftir roomlist' event
			frá server og uppfærir rásalistann.
		*/
		$scope.sendMessage = function() {
			var messageObj = {
					roomName : $scope.currentRoom,
					msg : $scope.msgText
			};
			
			/* emitted events */
			socket.emit("sendmsg", messageObj);
			
			$scope.msgText = "";
		};
	}
]);

