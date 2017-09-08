angular.module('famicity')
  .directive('fcUserList', function(
    ModalManager, $stateParams, $filter, $location, $timeout,
    notification, sessionManager, InvitationService, Invitation,
    $state, User, yesnopopin, $moment, $parse, $templateRequest, util) {
    'use strict';

    const log = debug('user-list');

    return {
      scope: {
        me: '=?',
        users: '=ngModel',
        mode: '@?',
        filter: '=?',
        selectionMode: '=?',
        loadMore: '=?',
        showAlert: '=?',
        message: '@',
        selectedUsers: '=?',
        filterByName: '=?',
        disableSearchField: '=?',
        customSearchCriteria: '=?',
        displayCapital: '=?',
        minLength: '=?',
        resultCount: '=?',
        template: '@?',
        onClick: '=?',
        infiniteScrollContainer: '@?',
        infiniteScrollParent: '@?',
        deleteMode: '@?'
      },
      restrict: 'E',
      templateUrl: '/scripts/common/user-list/fc-user-list.html',
      link($scope, element, attrs) {
        let searchInitialized;
        let customSearchInitialized;
        $scope.userId = $scope.me ? $scope.me.id : null;
        $scope.mode = $scope.mode || 'default';
        $scope.filter = $scope.filter || '';
        $scope.selectionMode = $scope.selectionMode || false;
        $scope.loadMore = $scope.loadMore || null;
        $scope.alertInviteShown = false;
        $scope.showAlert = $scope.showAlert || false;
        $scope.messageAlert = $scope.message || 'AUTOMATIC_INVITATION_ALERT_POPUP_TITLE';
        $scope.selectedUsers = $scope.selectedUsers || [];
        $scope.search = {
          criteria: $stateParams.q || ''
        };
        $scope.customSearchCriteria = $scope.customSearchCriteria || null;
        $scope.filterByName = $scope.filterByName || false;
        $scope.page = 2;
        $scope.disableSearchField =
          typeof $scope.disableSearchField !== 'undefined' && $scope.disableSearchField !== null ? $scope.disableSearchField : true;
        $scope.displayCapital =
          typeof $scope.displayCapital !== 'undefined' && $scope.displayCapital !== null ? $scope.displayCapital : true;
        $scope.minLength = $scope.minLength || 0;
        $scope.showResultCount = attrs.showResultCount != null ? angular.fromJson(attrs.showResultCount) : true;
        $scope.resultCount = $scope.resultCount || 0;
        $scope.$moment = $moment;

        $scope.ROUTE = $scope.$parent.ROUTE;

        const delay = attrs.delay || 300;

        const updateUsers = function() {
          // let _ref4;
          if ($scope.displayCapital) {
            $scope.formattedUsers = $filter('directoryUsersList')($scope.users);
          } else if ($scope.filterByName) {
            $scope.formattedUsers = $filter('directoryUserListByName')($scope.users);
          } else {
            $scope.formattedUsers = $scope.users;
          }
          // if ($scope.disableSearchField && ((_ref4 = $scope.users) != null ? _ref4.length : void 0) >= 10) {
          //   $scope.disableSearchField = false;
          // }
        };
        $scope.$watchCollection('users', updateUsers);
        updateUsers();

        $scope.infiniteScrollLoading = false;
        $scope.infiniteScrollDisabled = false;
        if ($scope.infiniteScrollParent === 'false') {
          $scope.infiniteScrollParent = null;
        }

        $scope.checkboxTriggered = function(user) {
          let newElems;

          if (user.selected) {
            const userIds = $scope.selectedUsers.map(user => user.id);
            if (userIds.indexOf(user.id) < 0) {
              $scope.selectedUsers.push(user);
            }
          } else {
            newElems = $scope.selectedUsers.filter(element => element.id !== user.id);
            Array.prototype.splice.apply($scope.selectedUsers, [0, $scope.selectedUsers.length].concat(newElems));
          }
          if (!$scope.alertInviteShown && $scope.showAlert) {
            if (user.global_state !== 'active' && !user.is_invited_by_me && (user.selected == null || user.selected === false)) {
              return $scope.showAlertPopup(user);
            }
          }
        };

        $scope.showAlertPopup = function(user) {
          $scope.alertInviteUser = user;
          $scope.alertInviteShown = true;
          if ($stateParams.location_type === 'default') {
            $scope.messageAlert = 'AUTOMATIC_INVITATION_ALERT_POPUP_TITLE_DEFAULT_RIGHT';
          }
          return ModalManager.open({
            templateUrl: '/views/popup/popup_invitation_alert.html',
            controller: 'InvitationAlertPopupController',
            scope: $scope
          });
        };

        $scope.cancelUserSelection = function() {
          $scope.alertInviteUser.selected = false;
        };

        $scope.loadMoreElementsUnthrottled = function() {
          if ($scope.loadMore) {
            if ($scope.minLength === 0 || $scope.search.criteria && $scope.search.criteria.length >= $scope.minLength) {
              $scope.infiniteScrollLoading = true;
              const criteria = $scope.customSearchCriteria || $scope.search.criteria;
              log('loadMore, q: %o, page: %o', criteria, $scope.page);
              $scope.loadMore($scope.page, criteria)
                .then(function(response) {
                  if (response.result_count) {
                    $timeout(function() {
                      $scope.resultCount = response.result_count;
                    });
                  }
                  if (response.users && response.users.length || angular.isArray(response) && response.length) {
                    $scope.page += 1;
                  } else {
                    $scope.infiniteScrollDisabled = true;
                  }
                }).finally(function() {
                  $scope.infiniteScrollLoading = false;
                });
            } else {
              $timeout(function() {
                $scope.formattedUsers = [];
                $scope.resultCount = null;
              });
            }
          } else {
            $scope.infiniteScrollDisabled = true;
          }
        };

        $scope.loadMoreElements =
          util.throttle($scope.loadMoreElementsUnthrottled, 500, {leading: false, trailing: false});

        function goToTop() {
          angular.element('.directory-listing').animate({scrollTop: 0}, 'ease', function() {
            $timeout(function() {
              $scope.newCount = 0;
            }, 500);
          });
        }

        $scope.doSearch = function() {
          const criteria = $scope.customSearchCriteria || $scope.search.criteria;
          if ($scope.loadMore) {
            if ($scope.minLength === 0 || criteria && criteria.length >= $scope.minLength) {
              $scope.page = 1;
              $scope.infiniteScrollLoading = true;
              log('search, q: %o, page: %o', criteria, $scope.page);
              $scope.loadMore($scope.page, criteria)
                .then(function(response) {
                  if (response.result_count) {
                    $timeout(function() {
                      $scope.resultCount = response.result_count;
                    });
                  }
                })
                .finally(function() {
                  $scope.infiniteScrollLoading = false;
                  $scope.infiniteScrollDisabled = false;
                  $scope.page = 2;
                  goToTop();
                });
            } else {
              $timeout(function() {
                $scope.formattedUsers = [];
                $scope.resultCount = null;
              });
            }
          } else {
            $scope.frontSideSearch();
            goToTop();
          }
        };

        const debouncedSearch = util.debounce($scope.doSearch, delay);

        $scope.$watch('search.criteria', function() {
          if (searchInitialized) {
            debouncedSearch();
          } else {
            searchInitialized = true;
          }
        });

        $scope.$watch('customSearchCriteria', function() {
          if (customSearchInitialized) {
            debouncedSearch();
          } else {
            customSearchInitialized = true;
          }
        });

        $scope.frontSideSearch = function() {
          $timeout(() =>
            $scope.formattedUsers = $filter('directoryUsersList')($filter('filter')($scope.users, function(user) {
              const search = $scope.customSearchCriteria || ($scope.search && $scope.search.criteria ? $scope.search.criteria : '') || '';
              return user.user_name && user.user_name.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
                user.email && user.email.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
                user.user && user.user.user_name && user.user.user_name.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
                user.other_user && user.other_user.user_name && user.other_user.user_name.toLowerCase().indexOf(search.toLowerCase()) !== -1;
            }))
          );
        };
      }
    };
  });
