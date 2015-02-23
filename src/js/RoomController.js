/*jslint browser:true */

/*
JavaScript Password Prompt by Luc (luc@ltdinteractive.com)
Originaly posted to http://stackoverflow.com/questions/9554987/how-can-i-hide-the-password-entered-via-a-javascript-dialog-prompt
This code is Public Domain :)

Syntax:
password_prompt(label_message, button_message, callback);
password_prompt(label_message, button_message, width, height, callback);

Example usage:
password_prompt("Please enter your password:", "Submit", function(password) {
    alert("Your password is: " + password);
});
*/

var password_prompt = function (label_message, button_message, arg3, arg4, arg5) {
	var callback;
	var width;
	var height;
    if (typeof label_message !== "string") { 
    	label_message = "Password:"; 
    }
    if (typeof button_message !== "string") { 
    	button_message = "Submit"; 
    }
    if (typeof arg3 === "function") {
        callback = arg3;
    }
    else if (typeof arg3 === "number" && typeof arg4 === "number" && typeof arg5 === "function") {
        width = arg3;
        height = arg4;
        callback = arg5;
    }
    if (typeof width !== "number") {
    	width = 200;
    }
    if (typeof height !== "number") {
    	height = 100;
    }
    if (typeof callback !== "function") {
    	callback = function (password) {};
    }

    var submit = function () {
        callback(input.value);
        document.body.removeChild(div);
        window.removeEventListener("resize", resize, false);
    };
    var resize = function () {
        div.style.left = ((window.innerWidth / 2) - (width / 2)) + "px";
        div.style.top = ((window.innerHeight / 2) - (height / 2)) + "px";
    };

    var div = document.createElement("div");
    div.id = "password_prompt";
    div.style.background = "white";
    div.style.color = "black";
    div.style.border = "1px solid black";
    div.style.width = width + "px";
    div.style.height = height + "px";
    div.style.padding = "16px";
    div.style.position = "fixed";
    div.style.left = ((window.innerWidth / 2) - (width / 2)) + "px";
    div.style.top = ((window.innerHeight / 2) - (height / 2)) + "px";

    var label = document.createElement("label");
    label.id = "password_prompt_label";
    label.innerHTML = label_message;
    label.for = "password_prompt_input";
    div.appendChild(label);

    div.appendChild(document.createElement("br"));

    var input = document.createElement("input");
    input.id = "password_prompt_input";
    input.type = "password";
    input.addEventListener("keyup", function (e) {
        if (e.keyCode == 13) { 
        	submit();
        }
    }, false);
    div.appendChild(input);

    div.appendChild(document.createElement("br"));
    div.appendChild(document.createElement("br"));

    var button = document.createElement("button");
    button.innerHTML = button_message;
    button.addEventListener("click", submit, false);
    div.appendChild(button);

    document.body.appendChild(div);
    window.addEventListener("resize", resize, false);
};


/* Chat room controller */

angular.module("NewIrc").controller("RoomController", 
	function ($scope, $location, $rootScope, $routeParams, socket, sharedVariables, privateMessage) {
	$scope.currentUser = $routeParams.user;
	$scope.currentRoom = $routeParams.room;
	console.log("booboo "+ $routeParams.user);
	sharedVariables.setRoom($routeParams.room);
	$scope.pass = $routeParams.pass;
	$scope.currentUsers = [];
	$scope.errorMessage = '';
	$scope.channelTopic = '';
	$scope.bubbar = [];
	$scope.messages = []; 
	$scope.glued = true;
	$scope.banned = [];
	/*
	* .nick
	* .timestamp
	* .message
	*/

	var test = {
		room:$routeParams.room,
		pass:$routeParams.pass /*mögulega skoða einhvert annað form*/
	};
	
	socket.emit('joinroom', test, function (success, reason) {
		console.log("joinroom emitted with room pass: " + $routeParams.pass);
		console.log("joinroom emitted with room name: " + $routeParams.room);
	if (!success) {
		if(reason === "wrong password") {
			password_prompt("Please enter your password:", "Submit", function (passWrd) {
				$rootScope.$apply(function () {

					$location.path('/room/' + $scope.currentUser +'/'+ $scope.currentRoom +'/'+ passWrd);
				});
			});
		}
			$location.path('/rooms/' + $scope.currentUser);
		}
	});

	/* emitted events */
	socket.on('updateusers', function (roomName, users, ops) {
		if(roomName === $scope.currentRoom) {
			$scope.bubbar = _.toArray(ops);
			console.log($scope.bubbar);
			$scope.currentUsers = _.toArray(users);
			console.log($scope.currentUsers);
			$scope.currentUsers = _.difference($scope.currentUsers, $scope.bubbar);
			console.log($scope.currentUsers);
		}
	});

	/* listen for events */
	socket.on('updatechat', function (roomName, messageHistory) {
		if(roomName === $scope.currentRoom) {
			for(var mH in messageHistory) {
				console.log(messageHistory[mH].message);
			}
			$scope.messages = messageHistory;
		}
	});

	socket.on('updatetopic', function (roomName, roomTopic, user) {
		console.log(roomTopic);
		if(roomName === $scope.currentRoom) {
			$scope.channelTopic = roomTopic;
			console.log(user + " changed the topic to: " + roomTopic);
			$scope.newTopic = '';
		}
	});

	socket.on('servermessage', function (tag, roomName, user) {
		if(roomName === $scope.currentRoom){
			console.log(user + " " + tag + "ed " + roomName);
		}
		/* skoða hvað við viljum gera við þetta message */
	});

	socket.on('bannedlist', function (userName ,channel, bannedlist) {
		console.log("caught bannedlist");
		if(channel === $scope.currentRoom) {
			console.log("currentRoom");
			console.log($scope.currentUser);
			if(userName === $scope.currentUser) {
				console.log("user is op");
				$scope.banned = _.toArray(bannedlist);
				
			} else {
				console.log("user isn't op");
			}
		} else {
			console.log("not Mine");
		}
	});

	$scope.doOp = function (looser) {
		var tmpObj = {
			user: looser,
			room: $scope.currentRoom
		};
		socket.emit('op', tmpObj, function (success) {
			if(!success) {
				console.log("You're not an (/'.')/ you can't op peepz");
			}
		});		
	};

	$scope.doDeop = function (looser) {
		var tmpObj = {
			user: looser,
			room: $scope.currentRoom
		};
		socket.emit('deop', tmpObj, function (success) {
			if(!success) {
				console.log("You're not an (/'.')/ you can't deop peepz");
			}
		});
	};

	$scope.ban = function (user) {
		var tmpObj = {
			user: user,
			room: $scope.currentRoom
		};
		socket.emit('ban', tmpObj, function (success) {
			if(!success){
				console.log("You're not an (/'.')/ you can't ban peepz");
			}
		});	
	};

	$scope.unBan = function (user) {
		console.log("unban called");
		console.log(user);
		var tmpObj = {
			user: user,
			room: $scope.currentRoom
		};
		socket.emit('unban', tmpObj, function (success) {
			if(!success){
				console.log("You're not an (/'.')/ you can't unban peepz");
			}
		});
	};

	$scope.kick = function (user) {
		var tmpObj = {
			user: user,
			room: $scope.currentRoom
		};
		socket.emit('kick', tmpObj, function (success) {
			if(!success){
				console.log("You're not an (/'.')/ you can't kick peepz");
			}
		});
	};

	$scope.leaveRoom = function () {
		sharedVariables.setRoom('');
		socket.emit("partroom", $scope.currentRoom);
		$location.path('/rooms/' + $scope.currentUser);
	};

	$scope.changeTopic = function () {
		var tmpObj = {
			topic: $scope.newTopic,
			room: $scope.currentRoom
		};
		console.log("topic topic: " + tmpObj.topic);
		console.log("topic room: " + tmpObj.room);
		socket.emit('settopic', tmpObj, function (success) {
			if(!success) {
				console.log("Really you non (/'.')/ you can't set topiczes !");
			}
		});
	};

	$scope.getBanned = function () {
		socket.emit('getBanned', $scope.currentRoom, function (success) {
			if(!success) {
				console.log("Really you non (/'.')/ you can't know who's banned !");
			} else {
				console.log("listen for bannedList");
			}
		});
	};

	$scope.sendPriv = function (user) {
		privateMessage.send(user, socket);
	};

	/*  */	
});



