angular.module('famicity.tree')
  .controller('TreeController', function(
    $scope, $rootScope, $state, $stateParams, pubsub,
    $location, notification,
    LoadingAnimationUtilService, userService, me,
    counters, PUBSUB, treeService, tree,
    sessionManager) {
    'use strict';

    LoadingAnimationUtilService.activate();
    $scope.userId = me.id;
    $scope.viewedUserId = $stateParams.user_id;
    $scope.matchingsCount = counters.getTreeMatchings();

    $scope.treeType = sessionManager.getTreeType() || 'web';
    $scope.searchOpen = false;
    $scope.matchingOpen = false;

    $scope.tree_content = tree.tree_content;
    $scope.structure = tree.tree_content.structure;
    pubsub.publish(PUBSUB.TREE.REFRESH, {
      structure: tree.tree_content.structure,
      type: sessionManager.getTreeType()
    }, {pooled: true});

    if ($stateParams.q) {
      pubsub.publish(PUBSUB.TREE.SEARCH.TOGGLE, $stateParams.q, {pooled: true});
    }

    function readTree() {
      log('readTree tree type: %o', $scope.treeType);
      treeService.userTree($stateParams.user_id, $scope.treeType)
        .then(function(treeContentResponse) {
          $scope.tree_content = treeContentResponse.tree_content;
          $scope.structure = treeContentResponse.tree_content.structure;
          pubsub.publish(PUBSUB.TREE.REFRESH, {
            structure: $scope.structure,
            type: sessionManager.getTreeType()
          });
        })
        .catch(function(response) {
          LoadingAnimationUtilService.deactivate();
          if (response.status === 403) {
            notification.add('TREE_NO_RIGHTS', {warn: true});
          }
        });
    }

    pubsub.subscribe(PUBSUB.TREE.GEDCOM.LOCK, function() {
      $scope.$applyAsync(function() {
        $scope.tree_content.gedcom_count += 1;
        $scope.tree_content.tree_is_lock = true;
      });
    }, $scope);

    pubsub.subscribe(PUBSUB.TREE.GEDCOM.UNLOCK, function() {
      $scope.$applyAsync(function() {
        $scope.tree_content.gedcom_count -= 1;
        if ($scope.tree_content.gedcom_count <= 0) {
          $scope.tree_content.tree_is_lock = false;
          $scope.tree_content.gedcom_count = 0;
        }
      });
    }, $scope);

    pubsub.subscribe(PUBSUB.TREE.FUSION.LOCK, function() {
      $scope.$applyAsync(function() {
        $scope.tree_content.fusion_count += 1;
        $scope.tree_content.tree_is_lock = true;
      });
    }, $scope);

    pubsub.subscribe(PUBSUB.TREE.FUSION.UNLOCK, function() {
      $scope.$applyAsync(function() {
        $scope.tree_content.fusion_count -= 1;
        if ($scope.tree_content.fusion_count <= 0) {
          $scope.tree_content.tree_is_lock = false;
          $scope.tree_content.fusion_count = 0;
        }
      });
    }, $scope);

    pubsub.subscribe(PUBSUB.TREE.MATCHING.COUNT, function(event, matchingCounts) {
      $scope.$applyAsync(function() {
        $scope.matchingsCount = matchingCounts;
      });
    }, $scope);

    pubsub.subscribe(PUBSUB.TREE.SEARCH.IS_OPEN, () => $scope.$applyAsync(() => $scope.searchOpen = true), $scope);
    pubsub.subscribe(PUBSUB.TREE.SEARCH.IS_CLOSED, () => $scope.$applyAsync(() => $scope.searchOpen = false), $scope);
    pubsub.subscribe(PUBSUB.TREE.MATCHING.IS_OPEN, () => $scope.$applyAsync(() => $scope.matchingOpen = true), $scope);
    pubsub.subscribe(PUBSUB.TREE.MATCHING.IS_CLOSED, () => $scope.$applyAsync(() => $scope.matchingOpen = false), $scope);

    $scope.removeGedcomPopup = function(redirect) {
      return userService.popupGedcom($scope.userId).then(function() {
        $scope.tree_content.can_show_gedcom_popup = false;
        if (redirect) {
          $state.go('gedcom-import-wizard', {user_id: $stateParams.user_id});
        }
      });
    };

    $scope.removeIntroPopup = function() {
      $scope.tree_content.can_show_tree_popup = false;
    };

    const gedSpaceChoice = {
      tooltip: 'TOOLTIP_GED',
      onActive() {
        $state.go('u.gedcom-index', {user_id: $scope.userId});
      },
      label: 'GED',
      notificationsCount: 0
    };
    $scope.$watch('tree_content.gedcom_count', function(newVal) {
      gedSpaceChoice.notificationsCount = newVal;
    });

    const gedImport = {
      tooltip: 'TOOLTIP_IMPORT_GED',
      onActive() {
        $state.go('gedcom-import-wizard', {user_id: $scope.userId});
      },
      icon: 'fa fa-sign-in'
    };

    const fusionsSpace = {
      tooltip: 'TOOLTIP_FUSIONS',
      onActive() {
        $state.go('u.fusions-index');
      },
      icon: 'fa fa-link',
      notificationsCount: 0
    };
    $scope.$watch('tree_content.fusion_count', function(newVal) {
      fusionsSpace.notificationsCount = newVal;
    });

    const treeWriterToolbarChoices = [
      gedSpaceChoice,
      gedImport,
      fusionsSpace
      /* ,
       {
       tooltip: 'TREE.MATCHING.TITLE',
       onActive: function () {
       if ($scope.treeType !== 'detailed_web') {
       $scope.treeType = 'detailed_web';
       readTree();
       }
       pubsub.publish(PUBSUB.TREE.MATCHING.TOGGLE);
       },
       getnotificationsCount: function () {
       return $scope.matchingsCount;
       },
       getState: function () {
       return $scope.matchingOpen;
       },
       icon: 'fc fc-matching'
       }*/
    ];

    const searchChoice = {
      tooltip: 'SEARCH.TITLE',
      onActive() {
        pubsub.publish(PUBSUB.TREE.SEARCH.TOGGLE);
      },
      state: $scope.searchOpen,
      icon: 'fa fa-search',
      notificationsCount: 0
    };
    $scope.$watch('searchOpen', function(newVal) {
      searchChoice.state = newVal;
    });
    const treeDetailedChoice = {
      tooltip: 'fc-tree.fc-toolbar.TREE_DETAILED',
      onActive() {
        $scope.treeType = $scope.treeType === 'web' ? 'detailed_web' : 'web';
        log('set tree type: %o', $scope.treeType);
        sessionManager.setTreeType($scope.treeType);
        readTree();
      },
      state: $scope.treeType === 'detailed_web',
      icon: 'fc fc-tree-detailed'
    };
    $scope.$watch('treeType', function(newVal) {
      treeDetailedChoice.state = newVal === 'detailed_web';
    });

    const treeReaderToolbarChoices = [
      searchChoice,
      treeDetailedChoice
    ];

    const canRead = function() {
      // TODO: In the future, we may receive explicit access rights about an tree
      return true;
    };
    const canWrite = function() {
      return $scope.tree_content.current_user_tree_id && $scope.tree_content.current_user_tree_id === $scope.tree_content.user_tree_id;
    };

    $scope.toolbarChoices = [];
    if (canRead()) {
      $scope.toolbarChoices = $scope.toolbarChoices.concat(treeReaderToolbarChoices);
    }
    if (canWrite()) {
      $scope.toolbarChoices = $scope.toolbarChoices.concat(treeWriterToolbarChoices);
    }

    $scope.zoombarChoices = [
      {
        tooltip: 'TOOLTIP_CENTER_PROFILE',
        onActive() {
          $scope.centerTree(true);
        },
        icon: 'fa fa-crosshairs',
        tooltipPlacement: 'top'
      },
      {
        tooltip: 'TOOLTIP_ZOOM_IN',
        onActive() {
          $scope.zoomIn();
        },
        icon: 'plus-icon',
        tooltipPlacement: 'left'
      },
      {
        tooltip: 'TOOLTIP_ZOOM_OUT',
        onActive() {
          $scope.zoomOut();
        },
        icon: 'minus-icon',
        tooltipPlacement: 'left'
      }
    ];
  });
