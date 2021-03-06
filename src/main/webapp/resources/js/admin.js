var baseUrl = "http://journowatchapi-sjw.rhcloud.com";

var fieldsInList = { uuid:"uuid", email:"email", firstname:"firstname", lastname:"lastname", role:"role"};
	//, roledropdown:"role" };

var firstModule = angular.module('admin', [ 'ngRoute' ])
.config(function($routeProvider, $httpProvider) {
	$routeProvider.when('/', {
		templateUrl:'resources/views/admin-home.html',
		controller:'home'
	}).when('/user', {
		templateUrl:'resources/views/admin-user-form.html',
		controller:'navigation'
	}).when('/adduser', {
		templateUrl: 'resources/views/admin-user-add-form.html',
		controller: 'navigation'
	}).when('/journo', {
		templateUrl:'resources/views/admin-journo-form.html',
		controller:'navigation'
	}).when('/venue', {
		templateUrl:'resources/views/admin-venue-form.html',
		controller:'navigation'
	}).otherwise('/');
	
	// CORS stuff: only if using angular's built-in $http (see notes below on $http)
	//$httpProvider.defaults.useXDomain = true;
	//delete $httpProvider.defaults.headers.common["X-Requested-With"];
	$httpProvider.defaults.headers.common["X-Requested-With"]='XMLHttpRequest';
	
}).controller('navigation', 
		function($rootScope, $scope, $http, $location) {

		var authenticate = function(credentials, callback) {

		var headers = credentials ? {authorization : "Basic "
	        + btoa(credentials.username + ":" + credentials.password)
	    } : {};
	    
	    console.log("navigation headers: ", headers);

	    // This reads JSON data from the provided URL
	    
	    /*
	     * $http is angular's way of doing ajax requests:
	     * $http.{$METHOD}($ajax params like url, headers, success, etc){}
	     */
	    $http.get('portal', {headers : headers}).success(function(data) {
	    	
	    	//console.log("navigation data: ", data)
	    	
	      if (data.name) {
	        $rootScope.authenticated = true;
	      } else {
	        $rootScope.authenticated = false;
	      }
	      callback && callback();
	    }).error(function() {
	      $rootScope.authenticated = false;
	      callback && callback();
	    });

	  }

		// TODO: Junk we don't need in the admin.js???
	  authenticate();
	  $scope.credentials = {};
	  $scope.login = function() {
	      authenticate($scope.credentials, function() {
	        if ($rootScope.authenticated) {
	          $location.path("/");
	          $scope.error = false;
	        } else {
	          $location.path("/login");
	          $scope.error = true;
	        }
	      });
	  };
	  $scope.createUser = function() {
		  
		  console.log("$scope.createUser hit!");
		  
		  var username = document.getElementById("username").value;
		  var email = document.getElementById("email").value;
		  var firstname = document.getElementById("firstname").value;
		  var lastname = document.getElementById("lastname").value;
		  var role = document.getElementById("role").value; // Maybe pass int
		  var password1 = document.getElementById("password1").value;
		  var password2 = document.getElementById("password2").value;
		  
		  var modalText = document.getElementById("modal-txt");
		  
		  console.log("(start) -> modalText.textContent: ", modalText.textContent);
		  
		  if(password1 === password2) {
			  console.log("Passwords match!");
			  $scope.error = false;
			  var formData = {
					  username:username,
					  email:email,
					  firstname:firstname,
					  lastname:lastname,
					  role:role, // Default is ROLE_USER
					  password:password1
			  };
			  
			  console.log("formData: ", formData);
			  
			  ajaxStuff({
				  
				// TODO: Need to go back to the API side and implement checkUserExists() !!!
				// XXX: In the meantime, made 'username' and 'email' UNIQUE constrained, so Postgres errors if duplicate creation attempted
				  
				  type:"POST",
				  url:baseUrl + "/user/",
				  dataType:"json",
				  data:formData,
				  callback: function(data) {
					  console.log("createUser() -> data: ", data);
					  
					  if(data == true) {
						  modalText.textContent = "User created!";
						  showModal();
						  console.log("User created.")
						  // TODO: OK button should take you to search/update
					  } else {
						  modalText.textContent = "Could not create user!";
						  showModal();
						  console.log("Could not create user. Doing nothing.")
					  }
					  console.log("(ajax) -> modalText.textContent: ", modalText.textContent);
				  }
			  });
		  } else {
			  console.log("Passwords do not match!");
			  $scope.error = true;
		  }
		  console.log("(end) -> modalText.textContent: ", modalText.textContent);
	  };
	  $scope.getUser = function() {
		  var username = document.getElementById("username").value;
		  var errorThingMsg = document.getElementById("error-thing-msg");
		  var errorThingLink = document.getElementById("error-thing-link");
		  var addUserBtn = "Cound not find user.";
		  
		  document.getElementById("userSubmitBtn").textContent = "Update User";
		  
		  if(username === "") {
			  $scope.error = true; // Shows the error div
			  document.getElementById("username").placeholder = "A username is REQUIRED!";
		  } else {
			  ajaxStuff({
				  type:"GET",
				  url:baseUrl + "/user/" + username,
				  callback: function(data) {
					  if(data.uuid !== null) {
							setVisible();
							setText(data);
							// We need to use $scope.$apply() in order to maintain scope within AJAX
							$scope.$apply(function(){
								$scope.error = false;
							});
						} else {
							setHidden();
							console.log("uuid is null! Set the error div!");
							errorThingMsg.textContent = "Could not find user.";
							errorThingLink.style.visibility = "visible";
							// We need to use $scope.$apply() in order to maintain scope within AJAX
							$scope.$apply(function(){
								$scope.error = true;
							});
						}
				  }
			  });
		  }
	  };
	  $scope.updateUser = function() {
		  console.log("updateUser() hit!");
		  
		  var username = document.getElementById("username").value;
		  var uuid = document.getElementById("uuid").value;
		  var email = document.getElementById("email").value;
		  var firstname = document.getElementById("firstname").value;
		  var lastname = document.getElementById("lastname").value;
		  var role = document.getElementById("role").value;; // Maybe pass int
		  
		  var formData = {
				  username:username,
				  uuid:uuid,
				  email:email,
				  firstname:firstname,
				  lastname:lastname,
				  role:role
		  };
		  
		  console.log("formData: ", formData);
		  
		  ajaxStuff({
			type:"PUT",
			url:baseUrl + "/user/" + username,
			dataType:"json",
		  	data:formData
		  });
	  };
	  $scope.deleteUser = function() {
		  console.log("$scope.deleteUser() hit!");
		  var username = document.getElementById("username").value;
		  /* XXX: I feel like we should be using the UUID here to remove ambiguity
		   * But delete requires the username as a urlParam, so we would either
		   * need to get the user first via username and return UUID or we implement
		   * a DELETE /user/{uuid} API endpoint
		   */ 

		  ajaxStuff({
			  type:"DELETE",
			  url:baseUrl + "/user/" + username,
			  // This should be all we need...
			  callback:function() {
				  closeModal();
				  clearFields();
				  setHidden();
				  // TODO: Maybe call a secondary modal that says "User deleted?"
			  }
		  });
	  };
	  $scope.roles = [{
		  	id: 1,
		  	label: "ROLE_ADMIN"
	  	},{
			id: 2,
			label: "ROLE_USER"
	  }];
});

/* 
 * TODO: This is what we should be doing, but since we still have no idea what we're doing
 * we're going to have to leave this empty for now  
 */
firstModule.directive("muhDirectives", function($compile){
	return {
		scope:true,
		link:function(scope,element,attrs){
			
		}
	};
});

function setPlaceholder(text) {
	document.getElementById("username").placeholder = text;
}

function setHidden() {
	document.getElementById("user-results").style.visibility = "hidden";
}

function setVisible() {
	document.getElementById("user-results").style.visibility = "visible";
}

function setText(respObj) {
	for(var k in fieldsInList) {
		document.getElementById(fieldsInList[k]).value = respObj[k];
	}
//	if(respObj.role == 2) {
//		document.getElementById("role-dropdown").value = "ROLE_USER";
//	} else if(respObj.role == 1) {
//		document.getElementById("role-dropdown").value = "ROLE_ADMIN";
//	}
}

function clearFields() {
	for(var k in fieldsInList) {
		document.getElementById(fieldsInList[k]).value = "";
	}
}

function ajaxStuff(config) {
	return $.ajax({
		type:config.type,
		url:config.url,
		dataType:config.dataType,
		data:JSON.stringify(config.data), // Will always be JSON, so setting this here is okay
		
		contentType: "application/json",

		success: function(data) {
			if(typeof config.callback == "function") config.callback(data);
			// Print response from server
			console.log("ajaxStuff callback: ", data);
		}
	});
}