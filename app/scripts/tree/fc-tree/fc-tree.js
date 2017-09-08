angular.module('famicity.tree')
  .directive('fcTree', function(
    $compile, $sce, $timeout, $moment, ModalManager, $window,
    $state, notification, LoadingAnimationUtilService, pubsub, PUBSUB, profileService) {
    'use strict';
    const log = debug('fc-tree');
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/scripts/tree/fc-tree/fc-tree.html',
      link($scope, elem) {
        // variables used to differentiate between single and double click of tree nodes
        $scope.clickTimer = null;
        $scope.clicked = false;
        const dblClickMaxDelay = 500;

        let zoom = 1;
        let previousZoom = 1;
        // let zoomFactor = 0;

        // const treeWrapper = $('.tree-wrapper');
        const wrapper = angular.element('#tr-ba');
        let back;

        // Calculate the offset between the top of the page and the top of the tree zone
        const treeHeader = angular.element('.content.tree .container-fluid');
        const topOffset = treeHeader.offset().top;

        const applyZoom = function(zoom) {
          const el = back[0];
          const usr = angular.element('.tr-us-fi');
          // Calculate transform-origin
          let x = -back.position().left / previousZoom + (angular.element($window).outerWidth() / 2 - usr.width() / 2) / previousZoom;
          let y = -back.position().top / previousZoom + angular.element($window).outerHeight() / 2 / previousZoom;
          x = (-back.position().left + angular.element($window).outerWidth() / 2 + usr.width() / 2) / previousZoom;
          y = (-back.position().top + angular.element($window).outerHeight() / 2 + usr.height() / 2 - topOffset) / previousZoom;
          log(previousZoom, zoom);

          back.css({'transform-origin': `${x}px ${y}px`});
          $timeout(() => {
            el.style.WebkitTransform = 'scale(' + zoom + ')';
            el.style.transform = 'scale(' + zoom + ')';
          });
          log('zoom on - x: %o, y: %o', x, y);
          log('zoom: %o, top: %o, left: %o, height: %o, width: %o', zoom, back.position().top, back.position().left, back.height(), back.width());
        };

        $scope.$moment = $moment;

        const unbind = pubsub.subscribe(PUBSUB.TREE.REFRESH, function(event, tree) {
          $scope.initTree(tree.structure, tree.type);
        });

        $scope.$on('$destroy', () => {
          log('destroy');
          unbind();
          elem.remove();
        });

        $scope.initTree = function(html, type) {
          if (html) {
            wrapper.html(html);
            $compile(wrapper.contents())($scope);
            $timeout(function() {
              log('tree type: %o', type);
              // We do it here and not as ng-class because we don't want the style to update before the structure
              if (type === 'detailed_web') {
                elem.addClass('detailed');
              } else {
                elem.removeClass('detailed');
              }
              back = angular.element('#c-co');
              LoadingAnimationUtilService.deactivate();
              $scope.centerTree();
              $scope.initDrag(back, wrapper);
              pubsub.publish(PUBSUB.TREE.READY);
            });
          }
        };

        $scope.centerOn = function(id, transition = false) {
          log('-----------------------------------------------');
          log('centerOn(%o)', id);

          const userBox = angular.element('#tr-com-' + id);
          // Center of the tree view
          const centerOfTreePosition = {x: $window.innerWidth / 2, y: $window.innerHeight / 2 - topOffset};
          // Position of the centered box
          const centeredBoxPosition = {
            x: centerOfTreePosition.x - userBox.width() / 2,
            y: centerOfTreePosition.y - userBox.height() / 2
          };
          // Position of the user box, relatively to the tree wrapper
          const userBoxPosition = userBox.position();

          back.css({
            'transform-origin': '50% 50%',
            transition: transition ? 'all 0.4s ease' : 'transform 0.4s ease',
            left: centeredBoxPosition.x * zoom - userBoxPosition.left,
            top: centeredBoxPosition.y * zoom - userBoxPosition.top
          });
          $timeout(() => back.css({transition: 'transform 0.4s ease'}), 400);
        };

        $scope.centerTree = function(transition) {
          $scope.centerOn($scope.viewedUserId, transition);
        };

        $scope.zoomIn = function() {
          if (zoom < 2.8) {
            previousZoom = zoom;
            zoom = parseFloat(zoom) + 0.2;
            applyZoom(zoom);
          }
        };

        $scope.zoomOut = function() {
          if (zoom > 0.6) {
            previousZoom = zoom;
            zoom = parseFloat(zoom) - 0.2;
            applyZoom(zoom);
          }
        };

        $scope.initDrag = function(element, handle) {
          let initPos = {x: null, y: null};
          let initPointer = {x: null, y: null};
          let boxPosition;
          let show = true;
          let xOffset;
          let yOffset;
          const moveDetected = function(event) {
            let zoomFactor;
            if (zoom > 1) {
              zoomFactor = -1;
            } else {
              zoomFactor = zoom < 1 ? -1 : 0;
            }
            element.css({
              left: initPos.x + event.originalEvent.clientX - initPointer.x,
              top: initPos.y + event.originalEvent.clientY - initPointer.y
            });
            if (show) {
              const newBoxPosition = back.position();
              xOffset = newBoxPosition.left - boxPosition.left;
              yOffset = newBoxPosition.top - boxPosition.top;
              log('-----------------------------------------------');
              log('zoom: %o; zoomFactor: %o', zoom, zoomFactor);
              log('init - x: %o, y: %o', boxPosition.left, boxPosition.top);
              log('now - x: %o, y: %o', newBoxPosition.left, newBoxPosition.top);
              log('---');
              log('offset - x: %o, y: %o', xOffset, yOffset);
            }
            const initX = initPos.x + zoomFactor * xOffset;
            const initY = initPos.y + zoomFactor * yOffset;
            show = false;
            event.preventDefault();

            element.css({
              left: initX + event.originalEvent.clientX - initPointer.x,
              top: initY + event.originalEvent.clientY - initPointer.y
            });
          };
          const downDetected = function(event) {
            boxPosition = back.position();
            initPointer.x = event.originalEvent.clientX;
            initPointer.y = event.originalEvent.clientY;
            initPos.x = element.position().left;
            initPos.y = element.position().top;
            handle.bind('pointermove', moveDetected);
          };
          const upDetected = function() {
            handle.unbind('pointermove', moveDetected);
            initPos = {x: null, y: null};
            initPointer = {x: null, y: null};
            show = true;
          };
          handle.bind('pointerdown', downDetected);
          handle.bind('pointerleave', upDetected);
          handle.bind('pointerup', upDetected);
        };

        $scope.openTreeUserPopup = function(userToDetail) {
          if (!$scope.clicked) {
            $scope.clickTimer = $timeout(function() {
              profileService.getTreeProfile(userToDetail).then(function(viewedUser) {
                log('viewedUser=%o', viewedUser);
                const treeOwner = $scope.viewedUserId;
                const state = viewedUser.global_state === 'unknown' ? 'u.tree.detail.fillAnonymous' : 'u.tree.detail.add';
                $state.go(state, {user_id: treeOwner, viewedUserId: userToDetail});
              });
              $scope.clicked = false;
            }, dblClickMaxDelay);
            $scope.clicked = true;
          }
        };

        $scope.goToUserTree = function(userId) {
          $timeout.cancel($scope.clickTimer);
          $scope.clicked = false;
          $state.go('u.tree', {user_id: userId, type: $scope.treeType});
        };

        $scope.invite = function(userId) {
          $state.go('u.tree.detail.invite', {
            user_id: userId,
            type: $scope.treeType,
            viewedUserId: $scope.viewedUserId
          });
        };

        $scope.revive = function(userId) {
          $state.go('u.tree.detail.revive', {
            user_id: userId,
            type: $scope.treeType,
            viewedUserId: $scope.viewedUserId
          });
        };
      }
    };
  });
