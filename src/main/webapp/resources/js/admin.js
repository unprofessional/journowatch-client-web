var baseUrl = "http://journowatchapi-sjw.rhcloud.com";

var fieldsInList = { uuid:"uuid", email:"email", firstname:"firstname", lastname:"lastname", role:"role" };

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
		  //var uuid = document.getElementById("uuid").value;
		  var email = document.getElementById("email").value;
		  var firstname = document.getElementById("firstname").value;
		  var lastname = document.getElementById("lastname").value;
		  var role = document.getElementById("role").value; // Maybe pass int
		  var password1 = document.getElementById("password1").value;
		  var password2 = document.getElementById("password2").value;
		  
		  if(password1 === password2) {
			  console.log("Passwords match!");
			  $scope.error = false;
			  var formData = {
					  username:username,
					  //uuid:uuid,
					  email:email,
					  firstname:firstname,
					  lastname:lastname,
					  role:role, // Default is ROLE_USER
					  password:password1
			  };
			  
			  ajaxStuff({
				  
				// !!! TODO: Need to go back to the API side and implement checkUserExists() !!!
				  
				  type:"POST",
				  url:baseUrl + "/user/",
				  dataType:"json",
				  data:formData
			  });
		  } else {
			  console.log("Passwords do not match!");
			  $scope.error = true;
			  
		  }
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
							//console.log("AJAX $scope.error: ", $scope.error);
						} else {
							setHidden();
							console.log("uuid is null! Set the error div!");
							errorThingMsg.textContent = "Could not find user.";
							errorThingLink.style.visibility = "visible";
							// We need to use $scope.$apply() in order to maintain scope within AJAX
							$scope.$apply(function(){
								$scope.error = true;
							});
							//console.log("AJAX $scope.error: ", $scope.error);
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
		  
		  // TODO: Get the confirm modal working
//		  $(".confirm").confirm({
//			  text: "Are you sure you want to delete that comment?",
//			  title: "Confirmation required",
//			  confirm: function(button) {
//				  console.log("BOOYAHASJKAJSK");
//			  },
//			  cancel: function(button) {
//				  // do nothing
//			  },
//			  confirmButton: "Yes",
//			  cancelButton: "No"
//		  });
		  
		  var choice = confirm("Are you sure you want to delete this user?");
		  if(choice === true) {
			  console.log("yes");
			  ajaxStuff({
				  type:"DELETE",
				  url:baseUrl + "/user/" + username
				  // This should be all we need...
			  });
		  } else{
			  console.log("no");
		  }
	  };
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
}

function clearFields() {
	for(var k in fieldsInList) {
		document.getElementById(fieldsInList[k]).value = "";
	}
}

// TODO: This needs to be in the angular module's $scope later
function addUser() {
	console.log("addUser() button clicked!")
	  // TODO: Show form
	  // TODO: Show password field (with confirmation)
	  setVisible();
	  clearFields();
	  
	  document.getElementById("deleteUserBtn").style.visibility = "hidden";
	  document.getElementById("userSubmitBtn").textContent = "Create User";
	  
	  /*
	   * TODO:
	   * 1) Create new HTML form entirely, leveraging Angular's SPA
	   * 2) Wrest control back to Angular by giving the new HTML form its own controller
	   * 3) Keep things in $scope
	   */
	  
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