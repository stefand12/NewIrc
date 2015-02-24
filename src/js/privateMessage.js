angular.module("NewIrc").service('privateMessage', function () {

	this.send = function (user, socket) {
		var message = window.prompt("type in message");
		console.log("message to user" + user);
		console.log(message);
		var msgObj = {
			nick: user,
			message: message
		};
		socket.emit('privatemsg', msgObj, function (success) {
			if(!success) {
				console.log("msg failed");
			}
		});
	};
});