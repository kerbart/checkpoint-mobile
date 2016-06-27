/**
 * Login Controller
 */
starter
	.controller(
		'LoginCtrl',
		function($scope, $ionicLoading, $ionicPopup, $ionicModal,
			appService) {
		    console.log("Login Controller");

		    $scope.user = {};
		    $scope.newuser = {};

		    $scope.user.email = "";
		    $scope.user.password = "";

		    $scope.newuser.email = "";
		    $scope.newuser.password = "";
		    $scope.newuser.passwordAgain = "";

		   

		    /**
		     * Creation d'un nouveau compte
		     */
		    $scope.createAccount = function() {
			$ionicLoading
				.show({
				    template : "Creation de votre comtpe...<br /><ion-spinner icon='spiral' class='spinner-energized' ></ion-spinner>"
				});

			appService
				.signInWithEmail($scope.newuser.email,
					$scope.newuser.password)
				.then(
					function(response) {
					    $ionicLoading.hide();
					    if (response.data.error) {
						$scope
							.popup(
								"Impossible de se connecter",
								"Vérifiez votre email/mot de passe.");

						alert(response.data.error);
						return;
					    }
					    appService
						    .storeUser(response.data.utilisateur);
					    $scope.loginModal.hide();
					    console.log("hide loginModal...");
					    // check if new user have at least
					    // one application
					    $scope.checkApplicationExists();
					}, function(error) {
					    alert(error);
					    $ionicLoading.hide();
					});
		    }

		    $scope.login = function() {
			$ionicLoading
				.show({
				    template : "Connexion...<br /><ion-spinner icon='spiral' class='spinner-energized' ></ion-spinner>"
				});

			appService
				.loginWithEmail($scope.user.email,
					$scope.user.password)
				.then(
					function(response) {
					    $ionicLoading.hide();
					    if (response.data.error) {
						$scope
							.popup(
								"Impossible de se connecter",
								"Vérifiez votre email/mot de passe.");
						console.log(
							"Erreur lors du login",
							response.data.error);
						return;
					    }
					    appService
						    .storeUser(response.data.utilisateur);
					    window.setTimeout(
						    function() {
							 $scope.goHome();
							 $ionicLoading.hide();
						    }
						    ,1000
					    );
					    $ionicLoading
						.show({
						    template : "Vous êtes maintenant connecté !<br /><ion-spinner icon='spiral' class='spinner-energized' ></ion-spinner>"
						});
					    $scope.goHome();
					    // check if new user have at least
					    // one application
					    $scope.checkApplicationExists();
					},
					function(error) {
					    console.log("Erreur technique !",
						    error);
					    $scope
						    .popup(
							    "Impossible de se connecter",
							    "Veuillez rééssayer dans quelques moments !");
					    $ionicLoading.hide();
					});
		    }

		});