starter.service('appService', function ($log, $http, $localStorage, $q, $ionicLoading, $ionicHistory) {
	return {
		checpointAPIUrl : function() {
			return "http://api.ilet.fr/ilet/api/";
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
		listCabinets : function() {
			return $http.get(this.checpointAPIUrl() + "user/"  + $localStorage.user.token + "/cabinet/list");
		},
		createCabinet : function(name) {
			return $http.post(this.checpointAPIUrl() + "user/"  + $localStorage.user.token + "/cabinet/create",
					name);
		},
		joinCabinet : function(shortCode) {
			return $http.post(this.checpointAPIUrl() + "user/"  + $localStorage.user.token + "/cabinet/join",
					shortCode);
		},
		storeCabinet : function(cabinet) {
			$localStorage.cabinet = cabinet;
		},
		getCabinet : function() {
			return $localStorage.cabinet != undefined ? $localStorage.cabinet : {"token" : "null"};
		},
		getUser : function() {
			return $localStorage.user;
		},
		storeUser : function(user) {
			$localStorage.user  = user;
		},
		logout : function(user) {
			$localStorage.user  = undefined;
			$localStorage.cabinet = undefined;
			$localStorage.patients = undefined;
		},
		// patient
		createPatient : function(patient) {
			var postData = {
					  "cabinetToken": this.getCabinet().token,
					  "utilisateurToken": this.getUser().token,
					  "patient": patient
					};
			return $http.post(this.checpointAPIUrl() + "patient/create",
					postData);
		},
		updatePatient : function(patient) {
			var postData = {
					  "cabinetToken": this.getCabinet().token,
					  "utilisateurToken": this.getUser().token,
					  "patient": patient
					};
			return $http.post(this.checpointAPIUrl() + "patient/update",
					postData);
		},
		loadPatient : function(token) {
			var postData = {
					  "cabinetToken": this.getCabinet().token,
					  "utilisateurToken": this.getUser().token,
					  "patient": {"token" : token}
					};
			return $http.post(this.checpointAPIUrl() + "patient/load",
					postData);
		},
		listPatients : function() {
			var postData = {
					  "cabinetToken": this.getCabinet().token,
					  "utilisateurToken": this.getUser().token
					};
			return $http.post(this.checpointAPIUrl() + "patient/list",
					postData);
		},
		listOrdonnances : function(patientToken) {
			var postData = {
					  "cabinetToken": this.getCabinet().token,
					  "utilisateurToken": this.getUser().token,
					  "patientToken" : patientToken
					};
			return $http.post(this.checpointAPIUrl() + "patient/ordonnances", postData);
		},
		listCommentaires : function(patientToken) {
			var postData = {
					  "cabinetToken": this.getCabinet().token,
					  "utilisateurToken": this.getUser().token,
					  "patientToken" : patientToken
					};
			return $http.post(this.checpointAPIUrl() + "patient/commentaires", postData);
		},
		saveOrdonnance : function(ordonnance, patientToken) {
			console.log("Saving ordonnance", ordonnance);
			var postData = {
					  "cabinetToken": this.getCabinet().token,
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
					  "cabinetToken": this.getCabinet().token,
					  "utilisateurToken": this.getUser().token,
					  "patientToken" : patientToken, 
					  "commentaire" : commentaire
					};
			return $http.post(this.checpointAPIUrl() + "commentaire/add",
					postData);
			
			
		},
		getOrdonnancePictureURL : function(fileToken) {
			return this.checpointAPIUrl() + "/patient/ordonnance/photo/" +this.getCabinet().token + "/" + this.getUser().token + "/" + fileToken; 
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
		        params.cabinetToken = this.getCabinet().token;
		        params.utilisateurToken = this.getUser().token;
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