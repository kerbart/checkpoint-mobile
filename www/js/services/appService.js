starter.service('appService', function ($log, $http, $localStorage, $q) {
	return {
		checpointAPIUrl : function() {
			return "http://localhost:8080/checkpoint/api/";
		},
		isUserConnected : function() {
			return $localStorage.user != undefined;
		},
		signInWithPhone : function(phoneNumber) {
			
		},
		signInWithEmail : function(email, password) {
			return $http.post(this.checpointAPIUrl() + "user/signin", 
					{
						"email" : email,
						"password" : password
					}
			);
		},
		storeUser : function(user) {
			$localStorage.user  = user;
		}
		
		
	}
});