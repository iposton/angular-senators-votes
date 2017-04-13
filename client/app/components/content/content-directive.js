(function() {
    "use strict";

    angular
        .module("main")
        .directive("content", function() {
            return {
                templateUrl: "components/content/content.html",
                scope: {
                    selected: '=selected',
                    votes: '=votes',
                    gettingvotes: '=gettingvotes',
                    vootestoday: '=votestoday'

                },
                controller: contentCtrl,
                controllerAs: "vm"
            }

            function contentCtrl(mainService, $mdBottomSheet, $mdSidenav, $scope, $mdDialog, $mdToast, $http, $mdPanel, $compile, $timeout, $filter, $mdDateLocale) {

                var self = this;

                self.message = null;
                self.isLoading = false;
                self.haveNoVotes = true;

                // DEFINE FUNCTIONS
                self.makeContact = makeContact;
                self.voteResults = voteResults;
                self.selectVotes = selectVotes;
                self.setActive = setActive;

                // WATCH THE MD-DATEPICKER SELECTED DATE 
                $scope.$watch('dateObj', function(newVal, oldVal) {
                    if (!newVal.myDate) {
                        return false;
                    }
                    // CREATE VALUE FOR NG-IF CONDITION TO GET VOTING DATA ASSOCIATED WITH THE SELECTED DATE
                    self.date = $filter('date')(new Date(newVal.myDate), "yyyy-MM-dd");
                    //console.log(self.date);

                    if (newVal != oldVal) {
                        // IF HAS NO VOTES TRUE SHOW NO VOTE MESSAGE 
                        self.haveNoVotes = true;
                        //console.log(self.hasNoVotes, "reset has not votes watching date change")
                    }
                }, true);


                function voteResults(v, r) {
                    self.haveNoVotes = false;
                    self.resultsArr = [];


                    self.isLoading = true;
                    self.err = false;
                    var voteUri = v.vote_uri;
                    $http({
                        method: 'get',
                        url: voteUri,
                        headers: { 'X-API-KEY': API_KEY }
                    }).then(function(response) {

                        self.haveNoVotes = false;
                        //console.log(self.haveNoVotes, "get vote results for today");
                        //console.log(response.data.results.votes.vote, 'votes by specific session and roll call number');
                        self.results = response.data.results.votes.vote;
                        self.resultsArr.push(self.results);
                        console.log(self.resultsArr, "results array");
                        self.isLoading = false;
                        self.err = false;


                    }).catch(function(error) {
                        console.error("Error with GET request", error);
                        self.isLoading = false;
                        self.err = true;

                    })


                }

                // CREATE CURRENT DATE AND OBJECT FOR THE DATEPICKER 
                // WITH MIN AND MAX DATE SELECTION
                var nd = new Date();

                $scope.dateObj = {
                    myDate: nd
                }

                self.minDate = new Date(
                    new Date().getFullYear(),
                    new Date().getMonth() - 2,
                    new Date().getDate()
                );

                self.maxDate = new Date(
                    new Date().getFullYear(),
                    new Date().getMonth(),
                    new Date().getDate()
                );

                // FORMAT THE DATE FOR THE DATEPICKER
                $mdDateLocale.formatDate = function(date) {
                    return $filter('date')($scope.dateObj.myDate, "mediumDate");
                };


                // $scope.$on('commentSent', function(event, message) {
                //     showToast(message);
                // });



                // function showToast(message) {
                //     $mdToast.show(
                //         $mdToast.simple()
                //         .textContent(message)
                //         .action('OK')
                //         .highlightAction(true)
                //         .hideDelay(0)
                //         .position('bottom right')
                //         .parent(angular.element(document.body))
                //     );
                // }

                function selectVotes(vote) {
                    self.selectedVote = vote;
                    //$mdBottomSheet.hide(self.selected);
                    //$mdSidenav('left').toggle();
                    //self.getVotes();

                }

                function setActive(item, list) {

                    list.some(function(item) {

                        if (item.active) {
                            item.active = false;
                        }
                    });
                    item.active = true;

                }

                // PIE CHART OPTIONS
                self.labels = ["D (Yes)", "R (Yes)", "D (No)", "R (No)", "Not Voting"];
                self.optionsC = {
                    rotation: 0.5 * Math.PI,
                    // title: {
                    //     display: true,
                    //     text: 'Vote Breakdown By Party',
                    //     fontColor: 'rgba(0,0,0,0.4)',
                    //     fontSize: 16
                    // },
                    legend: {
                        display: true
                    }
                }


  // $scope.onClick = function (points, evt) {
  //   console.log(points, evt);
  // };




                function makeContact(selectedSenator) {


                    $mdBottomSheet.show({
                        controllerAs: "vm",
                        controller: ['$mdBottomSheet', ContactSheetController],
                        templateUrl: 'components/content/contactsheet.html',
                        parent: angular.element(document.getElementById('content'))
                    });

                    /**
                     * Bottom Sheet controller for the Avatar Actions
                     */

                    function ContactSheetController($mdBottomSheet) {

                        this.senator = selectedSenator;

                        this.items = [
                            { name: 'Facebook', icon: 'facebook', icon_url: 'assets/svg/facebook-box.svg', link: 'https://www.facebook.com/' + this.senator.facebook_account },
                            { name: 'Twitter', icon: 'twitter', icon_url: 'assets/svg/twitter-box.svg', link: 'https://twitter.com/' + this.senator.twitter_account }

                        ];
                        this.contactLesson = function(action) {

                            $mdBottomSheet.hide(action);
                        };
                    }
                }



            }
        }).directive('parseStyle', function($interpolate) {
            // A custom directive for using inline css according to dynamic {{data}} 
            //and ng-class
            return function(scope, elem) {
                var exp = $interpolate(elem.html()),
                    watchFunc = function() {
                        return exp(scope);
                    };

                scope.$watch(watchFunc, function(html) {
                    elem.html(html);
                });
            };
        });
}());
