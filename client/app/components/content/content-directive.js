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
                    senators: '=senators',
                    gettingvotes: '=gettingvotes',
                    votestoday: '=votestoday'

                },
                controller: contentCtrl,
                controllerAs: "vm"
            }

            function contentCtrl(mainService, $mdBottomSheet, $mdSidenav, $scope, $mdDialog, $mdToast, $http, $mdPanel, $compile, $timeout, $filter, $mdDateLocale) {

                var self = this;

                $scope.$on('noresultsyet', function(event, noresult) {
                    console.log(noresult, 'noresult was received');
                    self.haveNoVotes = noresult;
                });
               
                self.message = null;
                self.isLoading = false;
                self.haveNoVotes = true;
               
                // DEFINE FUNCTIONS
                self.makeContact = makeContact;
                self.voteResults = voteResults;
                self.selectVotes = selectVotes;
                self.childSelected = childSelected;
                

                function childSelected (childSenator) {
                    console.log(childSenator, "I selected a senator from not voting list");
                    $scope.$emit('childSenator', childSenator);

                }


                // WATCH THE MD-DATEPICKER SELECTED DATE 
                $scope.$watch('dateObj', function(newVal, oldVal) {
                    if (!newVal.myDate) {
                        return false;
                    }
                    // CREATE VALUE FOR NG-IF CONDITION TO GET VOTING DATA ASSOCIATED WITH THE SELECTED DATE
                    self.date = $filter('date')(new Date(newVal.myDate), "yyyy-MM-dd");
                    //console.log(self.date);

                    if (newVal !== oldVal) {
                        // IF HAS NO VOTES TRUE SHOW NO VOTE MESSAGE 
                        self.haveNoVotes = true;
                        self.notVotingArray = [];
                        //console.log(self.hasNoVotes, "reset has not votes watching date change")
                    }
                }, true);


                function voteResults(v, r, sen) {
                    self.haveNoVotes = false;

                    //DEFINE ARRAYS
                    self.resultsArr = [];
                    self.yesArray = [];
                    self.noArray = [];
                    self.notVotingArray = [];
                    
                    //COUNTERS
                    var votedYes = 0;
                    var votedNo = 0;

                    self.isLoading = true;
                    self.err = false;
                    var voteUri = v.vote_uri;
                    var vRoll = v.roll_call;
                    var vQuestion = v.question;
                    var senators = sen;

                    $http({
                        method: 'get',
                        url: voteUri,
                        headers: { 'X-API-KEY': API_KEY }
                    }).then(function(response) {
                        var resultPosition = response.data.results.votes.vote.positions;
                        var resultDesc = response.data.results.votes.vote.description;
                        var senantorPosition = null;
                        
                        angular.forEach(senators, function(s) {
                            angular.forEach(resultPosition, function(i) {

                                i.roll_call = vRoll;
                            
                                if (i.vote_position === 'No') {
                                     votedNo += 1;
                                }

                                if (i.vote_position === 'Yes') {
                                    votedYes += 1;
                                    
                                }


                                if (s.id === i.member_id) {
                                    senantorPosition = {
                                        id: i.member_id,
                                        roll_call: i.roll_call,
                                        position: i.vote_position,
                                        party: s.party,
                                        state: s.state,
                                        name: s.first_name + ' ' + s.last_name,
                                        description2: resultDesc,
                                        question: vQuestion,
                                        senator: s
                                    }
                                   
                                    if (senantorPosition.position === 'Not Voting') {
                                        self.notVotingArray.push(senantorPosition);
                                    }

                                    if (senantorPosition.position === 'No') {

                                        
                                        self.noArray.push(senantorPosition);
                                        if(votedNo / 100 > 10) {
                                            self.noArray = [];
                                            //console.log('too many noses gotta dump. bye bye array');
                                        }


                                    }

                                    if (senantorPosition.position === 'Yes') {
                                       
                                        self.yesArray.push(senantorPosition);
                                        if(votedYes / 100 > 10) {
                                            self.yesArray = [];
                                            //console.log('too many yeses gotta dump. bye bye array');
                                        }
                                    }
                                }
                               



                            })
                        })

                        self.haveNoVotes = false;
                        self.results = response.data.results.votes.vote;
                        self.resultsArr.push(self.results);
                        console.log(self.resultsArr, "results array");
                        self.isLoading = false;
                        self.err = false;

                        // console.log(self.yesArray, ' senators that voted yes');
                        // console.log(self.noArray, ' senators that voted no');
                        // console.log(self.notVotingArray, ' senators that did not vote');

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



                self.colors = [{
                    backgroundColor: 'rgba(133, 193, 233, 0.7)',
                    pointBackgroundColor: 'rgb(133, 193, 233)',
                    pointHoverBackgroundColor: 'rgb(133, 193, 233)',
                    borderColor: 'rgb(133, 193, 233)',
                    pointBorderColor: '#fff',
                    pointHoverBorderColor: 'rgb(133, 193, 233)'
                }, {
                    backgroundColor: 'rgba(235, 111, 98, 0.7)',
                    pointBackgroundColor: 'rgb(235, 111, 98)',
                    pointHoverBackgroundColor: 'rgb(235, 111, 98)',
                    borderColor: 'rgb(235, 111, 98)',
                    pointBorderColor: '#fff',
                    pointHoverBorderColor: 'rgb(235, 111, 98)'
                }, {
                    backgroundColor: 'rgba(68, 115, 147, 0.7)',
                    pointBackgroundColor: 'rgb(68, 115, 147)',
                    pointHoverBackgroundColor: 'rgb(68, 115, 147)',
                    borderColor: 'rgb(68, 115, 147)',
                    pointBorderColor: '#fff',
                    pointHoverBorderColor: 'rgb(68, 115, 147)'
                }, {
                    backgroundColor: 'rgba(170, 73, 64, 0.7)',
                    pointBackgroundColor: 'rgb(170, 73, 64)',
                    pointHoverBackgroundColor: 'rgb(170, 73, 64)',
                    borderColor: 'rgb(170, 73, 64)',
                    pointBorderColor: '#fff',
                    pointHoverBorderColor: 'rgb(170, 73, 64)'
                }, {
                    backgroundColor: 'rgba(220, 220, 220, 0.7)',
                    pointBackgroundColor: 'rgb(220, 220, 220)',
                    pointHoverBackgroundColor: 'rgb(220, 220, 220)',
                    borderColor: 'rgb(220, 220, 220)',
                    pointBorderColor: '#fff',
                    pointHoverBorderColor: 'rgb(220, 220, 220)'
                }];

    

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
