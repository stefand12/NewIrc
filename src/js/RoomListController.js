/* RoomListController */

/*
	RoomListController sér um að sýna og refresha lista yfir þær 
	rásir sem eru virkar í NewIrc hverju sinni, 	
*/
angular.module("NewIrc").controller("RoomListController", [
	'$scope',
	'$location',
	'$rootScope',
	'$routeParams',
	'socket',
	function ($scope, $location, $rootScope, $routeParams, socket) {
		if($routeParams.user === 'undefined') {
			$location.path('#/login/');
		}
		$scope.currentUser = $routeParams.user;
		$scope.roomName = '';
		$scope.errorMessage = '';

		/* emitted events */

		/*
			function sem kallar eftir roomlist frá server
		*/
		socket.emit('rooms');

		/*
			function sem hlustar 'eftir roomlist' event
			frá server og uppfærir rásalistann.
		*/
		socket.on('roomlist', function (data) {
			var rList = [];
			var bull = data;
			var rambo;
			for(rambo in data) {
				rList.push(rambo);
			}
			$scope.rooms = rList;
		});


		/*
			function sem býr til eða joinar rás sem
			sleginn er inn á síðunni.
		*/
		$scope.createRoom = function (password) {
			if($scope.roomName === '') {
				$scope.errorMessage = "Choose a name for your channel";
			} else {
				if($scope.password === undefined || $scope.password === '') {
					$location.path('/room/' + $scope.currentUser +'/'+ $scope.roomName );
				}
				else {
					$location.path('/room/' + $scope.currentUser +'/'+ $scope.roomName +'/'+ password);
				}
			}
		};
	}
]);