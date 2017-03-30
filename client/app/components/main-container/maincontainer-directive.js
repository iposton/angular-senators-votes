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

            function mainContainerCtrl(mainService, $mdBottomSheet, $mdSidenav, $http, $scope) {

                var self = this;

                // Set globals
                self.selected = null;
                self.tweet = null;
                self.party = party;

                self.selParty = 'all';

                function party(p) {
                    // console.log($scope.selected);
                    if (self.selParty == 'all') {
                        return true;
                    }
                    return self.selParty == p;
                };



                $http({
                    method: 'get',
                    url: 'https://api.propublica.org/congress/v1/115/senate/members.json',
                    headers: { 'X-API-KEY': API_KEY }
                }).then(function(response) {


                    console.log(response.data.results[0].members, ' members');
                    self.senators = response.data.results[0].members;

                    // the success method called

                }).catch(function(error) {
                    console.error("Error with GET request", error);
                })


                // Define functions
                self.selectSenator = selectSenator;
                self.setActive = setActive;

                self.getVotes = getVotes;

                function getVotes(selected) {
                    $http({
                        method: 'get',
                        url: 'https://api.propublica.org/congress/v1/members/' + self.selected.id + '/votes.json',
                        headers: { 'X-API-KEY': API_KEY }
                    }).then(function(response) {


                        console.log(response.data.results[0].votes, ' votes');
                        self.votes = response.data.results[0].votes;

                        // the success method called

                    }).catch(function(error) {
                        console.error("Error with GET request", error);
                    })
                }

                function selectSenator(senator) {
                    self.selected = senator;
                    $mdBottomSheet.hide(self.selected);
                    $mdSidenav('left').toggle();
                    // self.getTweet();
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
        }).directive('onLoadClicker', function($timeout) {
            return {
                restrict: 'A',
                scope: {
                    index: '=index'
                },
                link: function($scope, iElm) {
                    if ($scope.index === 0) {
                        $timeout(function() {

                            iElm.triggerHandler('click');

                        }, 0);
                    }
                }
            };
        });
}());
