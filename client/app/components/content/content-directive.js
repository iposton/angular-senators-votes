(function() {
    "use strict";

    angular
        .module("main")
        .directive("content", function() {
            return {
                templateUrl: "components/content/content.html",
                scope: {
                    selected: '=selected',
                    votes: '=votes'

                },
                controller: contentCtrl,
                controllerAs: "vm"
            }

            function contentCtrl(mainService, $mdBottomSheet, $mdSidenav, $scope, $mdDialog, $mdToast, $http, $mdPanel, $compile, $timeout) {

                var self = this;

                self.message = null;
                self.isLoading = false;

                // DEFINE FUNCTIONS
                self.makeContact = makeContact;
                // self.incrementVotes = incrementVotes;
                self.showToast = showToast;
                self.showMenuPropub = showMenuPropub;

                self.voteResults = voteResults;
                self.selectVotes = selectVotes;
                self.setActive = setActive;


                function voteResults(v, r) {
                    if (r === undefined || r.roll_call != v.roll_call) {
                        self.isLoading = true;
                        self.err = false;
                        var voteUri = v.vote_uri;
                        $http({
                            method: 'get',
                            url: voteUri,
                            headers: { 'X-API-KEY': API_KEY }
                        }).then(function(response) {


                            console.log(response.data.results.votes.vote, 'votes by specific session and roll call number');
                            self.results = response.data.results.votes.vote;
                            self.isLoading = false;
                            self.err = false;


                        }).catch(function(error) {
                            console.error("Error with GET request", error);
                            self.isLoading = false;
                            self.err = true;

                        })

                    } else {
                        return
                    }

                }



                function showMenuPropub(ev) {
                    var position = $mdPanel.newPanelPosition()
                        .relativeTo('.pro-fab')
                        .addPanelPosition($mdPanel.xPosition.ALIGN_START, $mdPanel.yPosition.BELOW);
                    var config = {
                        attachTo: angular.element(document.body),
                        controller: contentCtrl,
                        controllerAs: 'vm',
                        template: '<div class="demo-menu-example" ' +
                            '     aria-label="senators" ' +
                            '     role="listbox">' +
                            '<div layout="row" layout-sm="column" layout-align="space-around" ng-if="!vm.senators">' +
                            ' <md-progress-linear class="md-warn" md-mode="intermediate"></md-progress-linear>' +
                            '</div>' +
                            '     <h4 ng-if="vm.senators">Tweet your state senator</h4> ' +
                            '    <h5 ng-if="vm.senators">{{vm.day | date:\'fullDate\'}}</h5>' +
                            '  <div class="demo-menu-item" ' +
                            '       ng-class="" ' +
                            '       aria-selected="" ' +
                            '       tabindex="-1" ' +
                            '       role="option" ' +
                            '       ng-click=""' +
                            '       ng-repeat="s in vm.senators"' +
                            '       ng-keydown="">' +
                            '    <a ng-href="https://twitter.com/{{s.twitter_account}}"><img ng-src="https://know-my-senators.herokuapp.com/public/img/senators/{{s.id}}.jpg" alt="" class="ph-image"> {{s.first_name}} {{s.last_name}} {{s.state}}</a>  ' +
                            '  </div>' +
                            '</div>',
                        position: position,
                        openFrom: ev,
                        clickOutsideToClose: true,
                        escapeToClose: true,
                        focusOnOpen: false,
                        zIndex: 2
                    };

                    $mdPanel.open(config);


                }




                $scope.$on('commentSent', function(event, message) {
                    showToast(message);
                });



                // function incrementVotes(selected, vote) {
                //     var votedValue = null;

                //     if (vote === selected.like) {
                //         selected.like += 1;
                //         self.lessons.$save(selected);
                //         votedValue = 'like';


                //     } else {
                //         selected.dislike += 1;
                //         self.lessons.$save(selected);
                //         votedValue = 'dislike';

                //     }

                //     selected.voted = self.voted = true;
                //     selected.message = 'You chose to ' + votedValue + ' ' + selected.name + '. Thank you for voting!';
                //     var message = selected.message;
                //     showToast(message);
                // }

                function showToast(message) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(message)
                        .action('OK')
                        .highlightAction(true)
                        .hideDelay(0)
                        .position('bottom right')
                        .parent(angular.element(document.body))
                    );
                }

                function selectVotes(vote) {
                    self.selectedVote = vote;
                    //$mdBottomSheet.hide(self.selected);
                    //$mdSidenav('left').toggle();
                    // self.getTweet();
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
    return function(scope, elem) {
        var exp = $interpolate(elem.html()),
            watchFunc = function () { return exp(scope); };

        scope.$watch(watchFunc, function (html) {
            elem.html(html);
        });
    };
});
}());
