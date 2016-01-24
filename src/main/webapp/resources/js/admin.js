var baseUrl = "http://journowatchapi-sjw.rhcloud.com";

var fieldsInList = { uuid:"uuid", email:"email", firstname:"firstname", lastname:"lastname" };

var firstModule = angular.module('admin', [ 'ngRoute' ])
.config(function($routeProvider, $httpProvider) {
	$routeProvider.when('/', {
		templateUrl:'resources/views/admin-home.html',
		controller:'home'
	}).when('/user', {
		templateUrl:'resources/views/admin-user-form.html',
		controller:'navigation'
	}).when('/journo', {
		templateUrl:'resources/views/admin-journo-form.html',
		controller:'navigation'
	}).when('/venue', {
		templateUrl:'resources/views/admin-venue-form.html',
		controller:'navigation'
	}).otherwise('/');
	
	$httpProvider.defaults.headers.common["X-Requested-With"]='XMLHttpRequest';
	
}).controller('navigation', 
		function($rootScope, $scope, $http, $location) {

		var authenticate = function(credentials, callback) {

		var headers = credentials ? {authorization : "Basic "
	        + btoa(credentials.username + ":" + credentials.password)
	    } : {};
	    
	    // [-me]
	    console.log("navigation headers: ", headers);

	    // This reads JSON data from the provided URL
	    
	    // XXX
	    // TODO: is this even correct?  no idea what i'm doing here
	    // XXX
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

		// TODO: Junk we don't need in the admin.js
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
	  $scope.getUser = function() {
		  var username = document.getElementById("username").value;
		  
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
							document.getElementById("error-thing").textContent = "Could not find user.";
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
	  // TODO: createUser() and deleteUser()
	  $scope.updateUser = function() {
		  var username = document.getElementById("username").value;
		  // TODO: Should we use UUID here?
		  console.log("updateUser() hit!");
		  ajaxStuff({
			  type:"PUT",
			  url:baseUrl + "/user/" + username,
			  callback: function(data) {
				  
			  }
		  });
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

function ajaxStuff(config) {
	return $.ajax({
		type:config.type,
		url:config.url,
		success: function(data) {
			if(typeof config.callback == "function") config.callback(data);
			console.log("ajaxStuff callback: ", data);
		}
	});
}