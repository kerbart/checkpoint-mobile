starter.service('appService', function ($log, $http, $localStorage, $q, $ionicLoading, $ionicHistory) {
	return {
		checpointAPIUrl : function() {
			return "http://kim.kerbart.com/checkpoint/api/";
			// return "http://192.168.1.41:8080/checkpoint/api/";
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
		checkUserToken : function() {
			var token = $localStorage.user != undefined ? $localStorage.user.token : "";
			return $http.get(this.checpointAPIUrl() + "user/" +  token  + "/check");
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
			return $localStorage.application != undefined ? $localStorage.application : {"token" : "null"};
		},
		getUser : function() {
			return $localStorage.user;
		},
		storeUser : function(user) {
			$localStorage.user  = user;
		},
		logout : function(user) {
			$localStorage.user  = undefined;
			$localStorage.application = undefined;
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
		listOrdonnances : function(patientToken) {
			var postData = {
					  "applicationToken": this.getApplication().token,
					  "patientToken" : patientToken
					};
			return $http.post(this.checpointAPIUrl() + "patient/ordonnances?patientToken=" + patientToken + "&applicationToken=" + this.getApplication().token);
		},
		listCommentaires : function(patientToken) {
			var postData = {
					  "applicationToken": this.getApplication().token,
					  "patientToken" : patientToken
					};
			return $http.post(this.checpointAPIUrl() + "patient/commentaires?patientToken=" + patientToken + "&applicationToken=" + this.getApplication().token);
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
		saveCommenaitre : function(commentaire, patientToken) {
			console.log("Saving commentaire", commentaire);
			var postData = {
					  "applicationToken": this.getApplication().token,
					  "utilisateurToken": this.getUser().token,
					  "patientToken" : patientToken, 
					  "commentaire" : commentaire
					};
			return $http.post(this.checpointAPIUrl() + "commentaire/add",
					postData);
			
			
		},
		getOrdonnancePictureURL : function(fileToken) {
			return this.checpointAPIUrl() + "/patient/ordonnance/photo?applicationToken=" + this.getApplication().token + "&fileToken=" + fileToken; 
		},
		saveOrdonnancePicture : function(ordonnanceToken, file) {
			 var deffered = $q.defer();
			
			console.log("Saving ordonnance file", ordonnanceToken, file);
			$ionicLoading.show({
			      template: 'Télérchargement de l\'ordonnance en cours...<br /><span class="ion-ios-checkmark-outline larger"></span>'
		    });
			 var myImg = file;
		        var options = new FileUploadOptions();
		        options.fileKey="source";
		        options.chunkedMode = false;
		        var params = {};
		        params.applicationToken = this.getApplication().token;
		        params.ordonnanceToken = ordonnanceToken;
		        options.params = params;
		        var ft = new FileTransfer();
		        ft.onprogress = function(progressEvent) {
		            if (progressEvent.lengthComputable) {
		            	$ionicLoading.show({
						      template: Math.round((progressEvent.loaded / progressEvent.total * 100)) + '%  téléchargé ...<br /><span class="ion-ios-clock-outline larger"></span>'
					    });
		            } 
		        };
		        
		         ft.upload(myImg, encodeURI(this.checpointAPIUrl() + "ordonnance/new/file"), 
		        		function(success) {
		        	console.log("Success !!", success);
		        	$ionicLoading.show({
					      template: 'L\'ordonnance a été correctement téléchargée !.<br /><span class="ion-ios-checkmark-outline larger"></span>'
				    });
		        	window.setTimeout(
		        			function() {
		        				$ionicLoading.hide();
		        				deffered.resolve(success);
		        			},
		        			500
		        	);
		        }, function(error) {
		        	console.log("Error !!", error);
		        	$ionicLoading.show({
					      template: 'Impossible de télécharger l\'ordonnance !.<br /><span class="ion-ios-checkmark-outline larger"></span>'
				    });
		        	window.setTimeout(
		        			function() {
		        				$ionicLoading.hide();
		        				deffered.resolve(error);
		        			},
		        			500
		        	);
		        }, options);
		         
		         return deffered.promise;
		},
	}
});