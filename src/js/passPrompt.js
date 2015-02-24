/*jslint browser:true */
angular.module("NewIrc").service('passPrompt', function () {
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

	this.password_prompt = function (label_message, button_message, arg3, arg4, arg5) {
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
});