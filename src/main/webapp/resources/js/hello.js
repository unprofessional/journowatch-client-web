var firstModule = angular.module('hello', [ 'ngRoute' ])
.config(function($routeProvider, $httpProvider) {
	$routeProvider.when('/', {
		templateUrl:'resources/views/home.html',
		controller:'home'
	}).when('/login', {
		templateUrl:'resources/views/login.html',
		controller:'navigation'
	}).otherwise('/');
	
	$httpProvider.defaults.headers.common["X-Requested-With"]='XMLHttpRequest';
	
})
.controller('home', function($scope, $http) {
	$http.get('resource/').success(function(data) {
		console.log(data);
		$scope.greeting = data;
	})
}).controller('user', function($scope, $http) {
	$http.get('user/').success(function(data) {
		console.log(data);
		$scope.stuff = data;
	})
}).controller('navigation', 
		function($rootScope, $scope, $http, $location) {

		var authenticate = function(credentials, callback) {

		var headers = credentials ? {authorization : "Basic "
	        + btoa(credentials.username + ":" + credentials.password)
	    } : {};

	    $http.get('user', {headers : headers}).success(function(data) {
	    	
	    	console.log("navigation data: ", data)
	    	
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

	  authenticate();
	  $scope.credentials = {};
	  $scope.login = function() {
		  console.log("login()???");
	      authenticate($scope.credentials, function() {
	    	  console.log("authenticate()???");
	        if ($rootScope.authenticated) {
	          $location.path("/");
	          $scope.error = false;
	        } else {
	          $location.path("/login");
	          $scope.error = true;
	        }
	      });
	  };
	});