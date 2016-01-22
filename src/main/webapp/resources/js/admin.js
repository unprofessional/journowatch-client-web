var baseUrl = "http://journowatchapi-sjw.rhcloud.com";

var fieldsInList = { email:"email", firstname:"firstname", lastname:"lastname" };

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
	  $scope.findUser = function() {
		  console.log("findUser()???");
		  
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

function getUser() {
	//console.log("getUser!");
	var username = document.getElementById("username").value;
	if(username === "") {
		//console.log("username is empty!");
		document.getElementById("username").placeholder = "A username is REQUIRED!";
	} else {
		//console.log("username: ", username);
		
		$.ajax({
			type:"GET",
			url:baseUrl + "/user/" + username,
			success: function(data){
				console.log(data);
				if(data.uuid !== null) {
					//console.log("ajax GET!");
					setVisible();
					setText(data);
					// Set values
				} else {
					setHidden();
					console.log("uuid is null!");
				}
			}
		});
	}
	
	
}