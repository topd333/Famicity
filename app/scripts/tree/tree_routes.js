class Form {
  constructor(title) {
    this.title = title;
  }
  withLeftMenu() {
    this.menu = true;
    return this;
  }
  withHint(hint) {
    this.hint = hint;
    return this;
  }
  withSubmitButton(submit) {
    this.submit = submit;
    return this;
  }
  whenCancel(onCancel) {
    this.onCancel = onCancel;
    return this;
  }
  whenSuccess(onSuccess) {
    this.onSuccess = onSuccess;
    return this;
  }
  fromAFormToFill() {
    this.user = {};
    return this;
  }
  thatUpdates() {
    this.isUpdate = true;
    return this;
  }
  thatCreates(relationship) {
    this.parentLink = relationship;
    this.isUpdate = false;
    return this.fromAFormToFill();
  }
  thatCreatesAParent(sex) {
    this.thatCreates('P');
    this.user.sex = sex;
    return this;
  }
  thatCreatesAPartner(sex) {
    this.thatCreates('Pa');
    this.user.sex = sex;
    return this;
  }
  thatCreatesBrotherhood(sex) {
    this.thatCreates('B');
    this.user.sex = sex;
    return this;
  }
  thatCreatesAChild(sex) {
    this.thatCreates('S');
    this.user.sex = sex;
    return this;
  }
}

angular
  .module('famicity.tree', [])
  .constant('FORMS',
  {
    add() {
      'use strict';
      return new Form('fc-add-relative.ADD.TITLE')
        .withLeftMenu()
        .thatUpdates();
    },
    selectSecondParent() {
      'use strict';
      return new Form('fc-add-relative.SELECT_SECOND_PARENT.TITLE')
        .withHint('fc-add-relative.SELECT_SECOND_PARENT.HINT')
        .withSubmitButton('fc-add-relative.SELECT_SECOND_PARENT.SUBMIT')
        .thatUpdates();
    },
    createFirstParent() {
      'use strict';
      return new Form('fc-add-relative.CREATE_FIRST_PARENT.TITLE')
        .thatCreatesAParent()
        .withHint('fc-add-relative.CREATE_FIRST_PARENT.HINT')
        .withSubmitButton('fc-add-relative.CREATE_FIRST_PARENT.SUBMIT');
    },
    createSecondParent() {
      'use strict';
      return new Form('fc-add-relative.CREATE_SECOND_PARENT.TITLE')
        .thatCreatesAParent()
        .withHint('fc-add-relative.CREATE_SECOND_PARENT.HINT')
        .withSubmitButton('fc-add-relative.CREATE_SECOND_PARENT.SUBMIT');
    },
    createChildSecondParent() {
      'use strict';
      return new Form('fc-add-relative.SELECT_SECOND_PARENT.ADD.TITLE')
        // The second parent of your child is your Partner
        .thatCreatesAPartner()
        .withHint('fc-add-relative.SELECT_SECOND_PARENT.ADD.HINT')
        .withSubmitButton('fc-add-relative.SELECT_SECOND_PARENT.ADD.SUBMIT')
        // Back to child add form
        .whenSuccess('u.tree.detail.createChild');
    },
    addHusband() {
      'use strict';
      return new Form('fc-add-relative.ADD_HUSBAND.TITLE')
        // The second parent of your child is your Partner
        .thatCreatesAPartner('Male')
        .withHint('fc-add-relative.ADD_HUSBAND.HINT')
        .withSubmitButton('fc-add-relative.ADD_HUSBAND.SUBMIT')
        .whenCancel('u.tree.detail.add');
    },
    addWife() {
      'use strict';
      return new Form('fc-add-relative.ADD_WIFE.TITLE')
        .thatCreatesAPartner('Female')
        .withHint('fc-add-relative.ADD_WIFE.HINT')
        .withSubmitButton('fc-add-relative.ADD_WIFE.SUBMIT')
        .whenCancel('u.tree.detail.add');
    },
    addBrother() {
      'use strict';
      return new Form('fc-add-relative.ADD_BROTHER.TITLE')
        .thatCreatesBrotherhood('Male')
        .withHint('fc-add-relative.ADD_BROTHER.HINT')
        .withSubmitButton('fc-add-relative.ADD_BROTHER.SUBMIT')
        .whenCancel('u.tree.detail.add');
    },
    addSister() {
      'use strict';
      return new Form('fc-add-relative.ADD_SISTER.TITLE')
        .thatCreatesBrotherhood('Female')
        .withHint('fc-add-relative.ADD_SISTER.HINT')
        .withSubmitButton('fc-add-relative.ADD_SISTER.SUBMIT')
        .whenCancel('u.tree.detail.add');
    },
    addSon() {
      'use strict';
      return new Form('fc-add-relative.ADD_SON.TITLE')
        .thatCreatesAChild('Male')
        .withHint('fc-add-relative.ADD_SON.HINT')
        .withSubmitButton('fc-add-relative.ADD_SON.SUBMIT')
        .whenSuccess('u.tree')
        .whenCancel('u.tree.detail.add');
    },
    addDaughter() {
      'use strict';
      return new Form('fc-add-relative.ADD_DAUGHTER.TITLE')
        .thatCreatesAChild('Female')
        .withHint('fc-add-relative.ADD_DAUGHTER.HINT')
        .withSubmitButton('fc-add-relative.ADD_DAUGHTER.SUBMIT')
        .whenSuccess('u.tree')
        .whenCancel('u.tree.detail.add');
    },
    completeAnonymous() {
      'use strict';
      return new Form('fc-add-relative.ANONYMOUS.TITLE')
        .withHint('fc-add-relative.ANONYMOUS.HINT')
        .withSubmitButton('fc-add-relative.ANONYMOUS.SUBMIT')
        .thatUpdates()
        .fromAFormToFill();
    },
    invite() {
      'use strict';
      return new Form('fc-add-relative.INVITE.TITLE')
        .withHint('INVITATION_FORM_INSTRUCTION')
        .whenSuccess('u.tree.detail.add')
        .whenCancel('u.tree.detail.add');
    },
    revive() {
      'use strict';
      return new Form('fc-add-relative.REVIVE.TITLE')
        .withHint('INVITATION_FORM_INSTRUCTION')
        .whenSuccess('u.tree.detail.add')
        .whenCancel('u.tree.detail.add');
    }
  }
)
  .config(function($stateProvider, FORMS) {
    'use strict';

    $stateProvider
      .state('u.abstract-tree', {
        abstract: true,
        url: '/tree',
        views: {
          '@': {
            template: `
              <fc-tree-matching></fc-tree-matching>
              <fc-tree-search data-on-click="goToUserTree"></fc-tree-search>
              <div class="content-view" ui-view="tree"></div>
            `,
            controller($scope, $state, $location, sessionManager) {
              $scope.goToUserTree = (userId) => {
                const params = $location.search();
                const type = sessionManager.getTreeType() || null;
                const q = params.q || null;
                $state.go($state.current.name, {user_id: userId, q: null}).then(() => {
                  // Update url, to keep q and type parameters
                  const href = $state.href($state.current.name, {user_id: userId, type, q});
                  $location.skipReload().url(href).replace();
                });
              };
            }
          }
        },
        data: {
          stateClass: 'tree',
          hideCmBar: true,
          label: '{{ \'TREE.MY_TREE\' | translate }}',
          doNotHideOnLoad: true
        }
      })
      .state('u.tree', {
        parent: 'u.abstract-tree',
        url: '/:user_id?q&ts',
        views: {
          tree: {
            templateUrl: '/scripts/tree/Tree.html',
            controller: 'TreeController'
          }
        },
        resolve: {
          tree(treeService, $stateParams, sessionManager) {
            const treeType = sessionManager.getTreeType();
            log('resolved tree type: %o', treeType);
            return treeService.userTree($stateParams.user_id, treeType);
          }
        },
        data: {
          stateClass: 'tree'
        },
        ncyBreadcrumb: {
          label: '{{ \'TREE.MY_TREE\' | translate }}'
        }
      })
      .state('u.tree.detail', {
        url: '/detail/:viewedUserId',
        abstract: true,
        onEnter: ($stateParams, $state, $modal) => {
          const modal = $modal.open({
            template: '<div ui-view="modalRoot"></div>'
          });
          $stateParams.modalInstance = modal;
          modal.result.then(function() {
            if ($stateParams.cause === 'cancel') {
              $state.go('u.tree');
            }
          }).catch(function() {
            $state.go('u.tree');
          });
        },
        onExit($stateParams) {
          $stateParams.modalInstance.close();
        },
        views: {
          'modalRoot@': {
            templateUrl: '/scripts/tree/popup/TreeUserPopup.html',
            controller: 'TreeUserPopupController'
          }
        },
        resolve: {
          viewedUser($stateParams, profileService) {
            return profileService.getTreeProfile($stateParams.viewedUserId);
          }
        }
      })
      .state('u.tree.detail.add', {
        url: '/add',
        views: {
          treePopupMenu: {
            templateUrl: '/scripts/tree/popup/TreePopupMenu.html',
            controller: 'TreeAddController'
          },
          treePopupForm: {
            templateUrl: '/scripts/tree/popup/TreeAdd.html',
            controller: 'TreeAddController'
          }
        },
        resolve: {
          someForm() {
            return FORMS.add();
          }
        }
      })
      .state('u.tree.detail.fillAnonymous', {
        url: '/fillAnonymous',
        views: {
          treePopupMenu: {
            template: ''
          },
          treePopupForm: {
            templateUrl: '/scripts/tree/popup/fc-fill-relative.html',
            controller: 'FillAnonymousController'
          }
        },
        resolve: {
          someForm() {
            return FORMS.completeAnonymous();
          }
        }
      })
      .state('u.tree.detail.addSon', {
        url: '/addSon',
        views: {
          treePopupMenu: {
            template: ''
          },
          treePopupForm: {
            templateUrl: '/scripts/tree/popup/fc-add-2nd-parent.html',
            controller: 'AddSecondParentController'
          }
        },
        resolve: {
          someForm() {
            return FORMS.addSon();
          }
        }
      })
      .state('u.tree.detail.addDaughter', {
        url: '/addDaughter',
        views: {
          treePopupMenu: {
            template: ''
          },
          treePopupForm: {
            templateUrl: '/scripts/tree/popup/fc-add-2nd-parent.html',
            controller: 'AddSecondParentController'
          }
        },
        resolve: {
          someForm() {
            return FORMS.addDaughter();
          }
        }
      })
      .state('u.tree.detail.addBrother', {
        url: '/addBrother',
        views: {
          treePopupMenu: {
            template: ''
          },
          treePopupForm: {
            templateUrl: '/scripts/tree/popup/fc-fill-relative.html',
            controller: 'CreateSiblingController'
          }
        },
        resolve: {
          someForm() {
            return FORMS.addBrother();
          }
        }
      })
      .state('u.tree.detail.addSister', {
        url: '/addSister',
        views: {
          treePopupMenu: {
            template: ''
          },
          treePopupForm: {
            templateUrl: '/scripts/tree/popup/fc-fill-relative.html',
            controller: 'CreateSiblingController'
          }
        },
        resolve: {
          someForm() {
            return FORMS.addSister();
          }
        }
      })
      .state('u.tree.detail.addHusband', {
        url: '/addHusband',
        views: {
          treePopupMenu: {
            template: ''
          },
          treePopupForm: {
            templateUrl: '/scripts/tree/popup/fc-fill-relative.html',
            controller: 'CreateSiblingController'
          }
        },
        resolve: {
          someForm() {
            return FORMS.addHusband();
          }
        }
      })
      .state('u.tree.detail.addWife', {
        url: '/addWife',
        views: {
          treePopupMenu: {
            template: ''
          },
          treePopupForm: {
            templateUrl: '/scripts/tree/popup/fc-fill-relative.html',
            controller: 'CreateSiblingController'
          }
        },
        resolve: {
          someForm() {
            return FORMS.addWife();
          }
        }
      })
      .state('u.tree.detail.createChild', {
        url: '/createChild/:partnerId',
        views: {
          treePopupMenu: {
            template: ''
          },
          treePopupForm: {
            templateUrl: '/scripts/tree/popup/fc-fill-relative.html',
            controller: 'CreateChildController'
          }
        },
        resolve: {
          partnerId($stateParams) {
            // May be undefined if parent is unknown
            return $stateParams.partnerId;
          }
        }
      })
      .state('u.tree.detail.createChildSecondParent', {
        url: '/createChildSecondParent',
        views: {
          treePopupMenu: {
            template: ''
          },
          treePopupForm: {
            templateUrl: '/scripts/tree/popup/fc-fill-relative.html',
            controller: 'CreateParentController'
          }
        },
        resolve: {
          someForm() {
            return FORMS.createChildSecondParent();
          }
        }
      })
      .state('u.tree.detail.createFirstParent', {
        url: '/createFirstParent',
        views: {
          treePopupMenu: {
            template: ''
          },
          treePopupForm: {
            templateUrl: '/scripts/tree/popup/fc-fill-relative.html',
            controller: 'CreateParentController'
          }
        },
        resolve: {
          someForm(viewedUser) {
            let form = FORMS.createFirstParent();
            const firstParent = viewedUser.parents[0];
            if (firstParent && firstParent.global_state === 'unknown') {
              form.user = firstParent;
              form = form.thatUpdates();
            }
            return form;
          }
        }
      })
      .state('u.tree.detail.createSecondParent', {
        url: '/createSecondParent',
        views: {
          treePopupMenu: {
            template: ''
          },
          treePopupForm: {
            templateUrl: '/scripts/tree/popup/fc-fill-relative.html',
            controller: 'CreateParentController'
          }
        },
        resolve: {
          someForm(viewedUser) {
            let form = FORMS.createSecondParent();
            const secondParent = viewedUser.parents[1];
            if (secondParent && secondParent.global_state === 'unknown') {
              form.user = secondParent;
              form = form.thatUpdates();
            }
            return form;
          }
        }
      })
      .state('u.tree.detail.invite', {
        url: '/invite',
        views: {
          treePopupMenu: {
            template: ''
          },
          treePopupForm: {
            templateUrl: '/scripts/tree/popup/fc-revive-invite.html',
            controller: 'InviteFromTreeController'
          }
        },
        resolve: {
          someForm() {
            return FORMS.invite();
          }
        }
      })
      .state('u.tree.detail.revive', {
        url: '/revive',
        views: {
          treePopupMenu: {
            template: ''
          },
          treePopupForm: {
            templateUrl: '/scripts/tree/popup/fc-revive-invite.html',
            controller: 'InviteFromTreeController'
          }
        },
        resolve: {
          someForm() {
            return FORMS.revive();
          }
        }
      });
  });
