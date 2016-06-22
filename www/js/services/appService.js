starter.service('appService', function ($log, $http, $localStorage, $q) {
	return {
		checpointAPIUrl : function() {
			 return "http://ns328613.ip-37-187-114.eu:8080/checkpoint/api/";
			// return "http://192.168.0.18:8080/checkpoint/api/";
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
		updatePatient : function(patient) {
			var postData = {
					  "applicationToken": this.getApplication().token,
					  "utilisateurToken": this.getUser().token,
					  "patient": patient
					};
			return $http.post(this.checpointAPIUrl() + "patient/update",
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
		},
		saveOrdonnance : function(ordonnance, patientToken) {
			console.log("Saving ordonnance", ordonnance);
			var postData = {
					  "applicationToken": this.getApplication().token,
					  "utilisateurToken": this.getUser().token,
					  "patientToken" : patientToken, 
					  "ordonnance" : ordonnance
					};
			return $http.post(this.checpointAPIUrl() + "ordonnance/new",
					postData);
			
		},
		saveOrdonnancePicture : function(ordonnanceToken, file) {
			console.log("Saving ordonnance file", ordonnanceToken, file);
			 var myImg = file;
		        var options = new FileUploadOptions();
		        options.fileKey="source";
		        options.chunkedMode = false;
		        var params = {};
		        params.applicationToken = this.getApplication().token;
		        params.ordonnanceToken = ordonnanceToken;
		        options.params = params;
		        var ft = new FileTransfer();
		        return ft.upload(myImg, encodeURI(this.checpointAPIUrl() + "ordonnance/new/file"), 
		        		function(success) {
		        	console.log("Success !!", success);
		        }, function(error) {
		        	console.log("Error !!", error);
		        }, options);
		},
	}
});