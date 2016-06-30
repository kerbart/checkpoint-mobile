/**
 * Gestion des espaces (cabinets)
 */
starter
		.controller(
				'CabinetCtrl',
				function($scope,
						appService) {
					
					$scope.cabinets = {};
					$scope.cabinet = $scope.getCurrentCabinet();
					
					$scope.collaborateur = {};
					
					$scope.listCabinets = function() {
						appService.listCabinets().then(
								//success
								function(response) {
									$scope.cabinets = response.data.cabinets;
								},
								//error
								function(error) {
									alert("impossible de récupérer les cabinets");
								}
						);
					}
					
					$scope.inviteCollaborateur = function() {
						alert("colaborateur " + $scope.collaborateur.email + " invité");
					}
					
					$scope.listCabinets();
				})
