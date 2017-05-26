(function() {
    "use strict";

    angular
        .module("main")
        .directive("mainContainer", function() {
            return {
                templateUrl: "components/main-container/main-container.html",
                controller: mainContainerCtrl,
                controllerAs: "vm"
            }

            function mainContainerCtrl(mainService, $mdBottomSheet, $mdSidenav, $http, $scope, $rootScope) {

                var self = this;

                //SET GLOBALS
                self.selected = null;
                //self.search = "";

                //DEFINE FUNCTIONS
                self.selectSenator = selectSenator;
                self.setActive = setActive;
                self.getVotes = getVotes;
                self.sensitiveSearch = sensitiveSearch;
                self.party = party;

                $scope.$on('childSenator', function(event, newSenator) {
                    self.selected = newSenator;
                    self.gettingvotes = true;
                    $mdBottomSheet.hide(self.selected);
                    $mdSidenav('left').toggle();
                    self.getVotes();
                })

                self.selParty = 'all';
                //LISTEN FOR CHANGES ON SELECT MENU FOR NG-SHOW
                $rootScope.$on('parentSelParty', function(event, selParty) {
                    self.selParty = selParty;
                });

                //LISTEN FOR CHANGES ON SEARCH AND DEFINE SELF.SEARCH 
                $rootScope.$on('parentSearch', function(event, search) {
                    self.search = search;
                });

                function party(p) {
                    if (self.selParty === 'all') {
                        return true;
                    }
                    return self.selParty === p;
                }

                function sensitiveSearch(s) {
                    if (self.search) {
                        return s.first_name.indexOf(self.search) == 0;
                        //|| s.state.indexOf(self.search) == 0;
                    }
                    return true;
                };

                $http({
                    method: 'get',
                    url: 'https://api.propublica.org/congress/v1/115/senate/members.json',
                    headers: { 'X-API-KEY': API_KEY }
                }).then(function(response) {
                    //Get data from the response and print it to the console.
                    console.log(response.data.results[0].members, ' members');
                    //Define the array of data for ng-repeat in the html
                    self.senators = response.data.results[0].members;
                }).catch(function(error) {
                    //If error throw error
                    console.error("Error with GET request", error);
                })


                function getVotes() {
                    // self.gettingvotes = true;
                    $http({
                        method: 'get',
                        url: 'https://api.propublica.org/congress/v1/members/' + self.selected.id + '/votes.json',
                        headers: { 'X-API-KEY': API_KEY }
                    }).then(function(response) {


                        console.log(response.data.results[0].votes, ' votes');
                        self.gettingvotes = false;
                        self.votes = response.data.results[0].votes;
                        self.votestoday = false;
                        self.noresultsyet = true;
                        $scope.$broadcast('noresultsyet', self.noresultsyet);

                        var d = new Date();
                        self.today = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toJSON().slice(0, 10);
                        console.log(self.votes[0].date, 'votes date', self.today, 'today');
                        if (self.votes[0].date === self.today) {

                            self.votestoday = true;



                            console.log("yes there are votes today", self.votestoday)
                        }

                        // the success method called

                    }).catch(function(error) {
                        self.gettingvotes = false;
                        console.error("Error with GET request", error);
                    })
                }

                function selectSenator(senator) {
                    self.gettingvotes = true;
                    self.selected = senator;
                    $mdBottomSheet.hide(self.selected);
                    $mdSidenav('left').toggle();
                    self.getVotes();

                }

                function setActive(item, list) {

                    list.some(function(item) {

                        if (item.active) {
                            item.active = false;
                        }
                    });
                    item.active = true;

                }




            }
        }).directive('onLoadClicker', function($timeout, $mdSidenav) {
            return {
                restrict: 'A',
                scope: {
                    index: '=index'
                },
                link: function($scope, iElm) {
                    if ($scope.index === 0) {
                        $timeout(function() {

                            iElm.triggerHandler('click');
                            $mdSidenav('left').toggle();
                        }, 0);
                    }
                }
            };
        });
}());
