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

            function topBarCtrl($mdBottomSheet, $mdSidenav, $scope, $rootScope, $mdDialog) {

                var self = this;

                $scope.customFullscreen = false;

                self.votes = null;

                //DEFINE FUNCTIONS 
                self.toggleList = toggleList;
                self.searchVoteModal = searchVoteModal;

                //WATCH WHEN SELECT OPTION CHANGES AND 
                //BROADCAST TO ROOTSCOPE
                $scope.selParty = 'all';
                $scope.$watch('selParty', function(newVal, oldVal) {

                    if (newVal) {
                        $rootScope.$broadcast('parentSelParty', newVal);
                    }

                }, true);

                //WATCH WHEN SEARCH INPUT CHANGES AND 
                //BROADCAST TO ROOTSCOPE
                $scope.search = "";
                $scope.$watch('search', function(newVal, oldVal) {
                    if (newVal || newVal === "") {
                        $rootScope.$broadcast('parentSearch', newVal);
                    }

                }, true);

                $rootScope.$on('votes', function(event, v) {

                    self.votes = v;

                    //self.gettingvotes = true;

                })


                //console.log($scope.votes, "scope votes");

                function searchVoteModal(ev, v) {

                    $mdDialog.show({
                            locals: {
                                voteObj: v
                            },
                            controller: ['$scope', 'voteObj', function($scope, voteObj) {
                                var self = this;

                                //globals
                                self.votes = voteObj;
                                $scope.search = "";

                                //define functions
                                self.sensitiveSearch = sensitiveSearch;
                                self.setDatePicker = setDatePicker;
                                self.cancel = cancel;

                                function setDatePicker(date) {
                                    $rootScope.$broadcast('date', date);
                                }

                                function sensitiveSearch(v) {
                                    if ($scope.search) {
                                        self.searchText = $scope.search.toLowerCase();
                                        return v.description.toLowerCase().indexOf(self.searchText) >= 0;
                                    }
                                    return true;
                                };

                                function cancel() {
                                    $mdDialog.cancel();
                                };
                            }],
                            controllerAs: 'vm',
                            template: `<md-dialog aria-label="Search Votes" style="width:100%">
                                  <form ng-cloak>
                                    <md-toolbar>
                                      <div class="md-toolbar-tools">
                                        <h2>Search for a particular vote</h2>
                                        <span flex></span>
                                        <md-button class="md-icon-button" ng-click="cancel()">
                                          <md-icon md-svg-src="img/icons/ic_close_24px.svg" aria-label="Close dialog"></md-icon>
                                        </md-button>
                                      </div>
                                    </md-toolbar>

                                    <md-dialog-content style="width:100%">
                                      <div class="md-dialog-content search-votes">
                                        <h2>Use a keyword to search for a particular vote.</h2>
                                         <md-input-container hide-sm>
                                            <label>Search Votes</label>
                                            <input type="text" id="name" ng-model="search" />
                                         </md-input-container>
                                        <div ng-repeat="v in filteredSearch = (vm.votes| filter:vm.sensitiveSearch)">
                                       
                                          <h2><a ng-click="vm.setDatePicker(v.date); vm.cancel();">{{v.description +" "+ v.date}}</a></h2>
                                          
                                        </div>
                                        <div>
                                            <h2 ng-if="filteredSearch.length === 0">No results found for search term '{{ vm.searchText }}'</h2>
                                        </div>
                                      </div>
                                    </md-dialog-content>

                                   
                                  </form>
                                </md-dialog>`,
                            parent: angular.element(document.body),
                            targetEvent: ev,
                            clickOutsideToClose: true,
                            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                        })
                        .then(function() {

                        }, function() {

                        });

                }

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
