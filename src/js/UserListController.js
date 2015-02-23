angular.module("NewIrc").controller("UserListController", 
	function ($scope, $location, $rootScope, $routeParams, socket, sharedVariables, privateMessage) {
	
	$scope.currentUser = $routeParams.users;
	
	socket.emit('users');
		
	socket.on('userlist', function (data) {
		var listtest = [];
		for(var x in data){
		listtest.push(data[x]);
		}
		$scope.users = listtest;
	});

	$scope.sendPriv = function (user) {
		privateMessage.send(user, socket);
	};

});