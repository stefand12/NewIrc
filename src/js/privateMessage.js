/*jslint browser:true */
angular.module("NewIrc").service('privateMessage', [
	function () {
	this.send = function (user, socket) {
		var message = window.prompt("type in message");
		var msgObj = {
			nick: user,
			message: message
		};
		socket.emit('privatemsg', msgObj, function (success) {
			if(!success) {
				console.log("Failed to send message to " + user + ".");
			}
		});
	};
}]);