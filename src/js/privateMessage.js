/*jslint browser:true */

/* privateMessage */

/*
	privateMessage er service sem höndlar það
	að senda message á milli notenda á NewIrc
	service'ið er gert til að einfalda notkun í 
	mörgum controllerum.
*/
angular.module("NewIrc").service('privateMessage', [
	function () {
		
		/*
			Sendir message notar promt glugga til að taka inn skilaboð.
			og emittar síðan private message objecti á serverinn.
		*/
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
	}
]);