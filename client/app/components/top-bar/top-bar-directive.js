(function() {
    "use strict";

    angular
        .module("main")
        .directive("topBar", function() {
            return {
                scope: {
                    currentuser: '=currentuser'
                },
                templateUrl: "components/top-bar/top-bar.html",
                controller: topBarCtrl,
                controllerAs: "vm"
            }

            function topBarCtrl ($mdBottomSheet, $mdSidenav, $scope, $rootScope) {

                var self = this;
                 
                //DEFINE FUNCTIONS 
                self.toggleList = toggleList;
                
                //WATCH WHEN SELECT OPTION CHANGES AND 
                //BROADCAST TO ROOTSCOPE
                $scope.selParty = 'all';
                $scope.$watch('selParty', function(newVal, oldVal) {
                    
                    if(newVal) {
                        $rootScope.$broadcast('parentSelParty', newVal); 
                    }
                   
                }, true);

                //WATCH WHEN SEARCH INPUT CHANGES AND 
                //BROADCAST TO ROOTSCOPE
                $scope.search = "";
                $scope.$watch('search', function(newVal, oldVal) {
                    if(newVal || newVal === "") {
                        $rootScope.$broadcast('parentSearch', newVal); 
                    }
                   
                }, true);
                 

                // VALUES FOR THE POPOVER ON NAV
                // self.classes = 'drop-theme-arrows-bounce-dark';
                // self.constrainToScrollParent = 'true';
                // self.constrainToWindow = 'true';
                // self.openOn = 'hover';
                // self.position = 'bottom center';

                // self.myWebsite = 'http://www.ianposton.com/';
                // self.myRepo = 'https://github.com/iposton/angular-material-dynamic-list';

                 

                 function toggleList($event) {
                    $mdSidenav('left').toggle();
                    $mdBottomSheet.hide($event);
                }
            }
     });
}());