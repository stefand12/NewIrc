/* UserListController */
/*
	UserListController er notaður til að kalla upp
	alla notendur sem eru logged in á servernum og byrta þá 
	í userlist. hægt er að senda öllum notendum private message
	úr listanum.
*/
angular.module("NewIrc").controller("UserListController", [
	'$scope',
	'$location',
	'$rootScope',
	'$routeParams',
	'socket',
	'sharedVariables',
	'privateMessage',
	function ($scope, $location, $rootScope, $routeParams, socket, sharedVariables, privateMessage) {
		$scope.currentUser = $routeParams.users;
		$scope.users = [];

		/* emitted events */
		/*
			sendir 'users' boð á server
			til að kalla eftir userlist.
			emittað á 10sec fresti.
		*/
		socket.emit('users');
		var refreshUsers = setInterval( function () {
			socket.emit('users');
		}, 10000);
		
		/*
			hlustar efitr userlist event frá server
			og update'ar userlistann.
		*/
		socket.on('userlist', function (data) {
			var listtest = [];
			for(var x in data){
			listtest.push(data[x]);
			}
			$scope.users = listtest;
		});
		/*
			kallar í privateMessge service
		*/
		$scope.sendPriv = function (user) {
			privateMessage.send(user, socket);
		};
	}
]);