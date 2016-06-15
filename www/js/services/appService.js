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
		loginWithEmail : function(email, password) {
			return $http.post(this.checpointAPIUrl() + "user/login", 
					{
						"email" : email,
						"password" : password
					}
			);
		},
		listApplication : function() {
			return $http.get(this.checpointAPIUrl() + "user/"  + $localStorage.user.token + "/app/list");
		},
		createApplication : function(name) {
			return $http.post(this.checpointAPIUrl() + "user/"  + $localStorage.user.token + "/app/create",
					name);
		},
		storeApplication : function(application) {
			$localStorage.application = application;
		},
		getApplication : function() {
			return $localStorage.application;
		},
		getUser : function() {
			return $localStorage.user;
		},
		storeUser : function(user) {
			$localStorage.user  = user;
		},
		removeUser : function(user) {
			$localStorage.user  = undefined;
		},
		// patient
		createPatient : function(patient) {
			var postData = {
					  "applicationToken": this.getApplication().token,
					  "utilisateurToken": this.getUser().token,
					  "patient": patient
					};
			return $http.post(this.checpointAPIUrl() + "patient/create",
					postData);
		},
		loadPatient : function(token) {
			var postData = {
					  "applicationToken": this.getApplication().token,
					  "utilisateurToken": this.getUser().token,
					  "patient": {"token" : token}
					};
			return $http.post(this.checpointAPIUrl() + "patient/load",
					postData);
		},
		listPatients : function() {
			var postData = {
					  "applicationToken": this.getApplication().token,
					  "utilisateurToken": this.getUser().token
					};
			return $http.post(this.checpointAPIUrl() + "patient/list",
					postData);
		}
	}
});