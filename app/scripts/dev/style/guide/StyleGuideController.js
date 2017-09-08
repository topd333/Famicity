angular.module('famicity')
.controller('StyleGuideController', function($scope, notification, yesnopopin, $translate, menuBuilder) {
  'use strict';

  // Tabs
  this.tabActive = '1';

  // Avatar
  this.user = {
    id: 1,
    global_state: 'active',
    user_name: 'Jérôme Beau',
    avatar_url: 'https://placekitten.com/g/500/500'
  };
  this.user2 = {
    id: 1,
    global_state: 'active',
    is_invited_by_me: true,
    user_name: 'Jérôme Beau',
    avatar_url: 'https://placekitten.com/g/600/600'
  };
  this.user3 = {
    id: 1,
    global_state: 'directory',
    user_name: 'Jérôme Beau',
    avatar_url: 'https://placekitten.com/g/800/800'
  };

  // Notifications
  this.success = () => notification.add('CONNEXION_SUCCESS_MSG');
  this.error = () => notification.add('INVALID_FORM', {warn: true});

  // Dropdowns
  this.list = [
    {id: 0, key: 'First'},
    {id: 1, key: 'Second'},
    {id: 2, key: 'Third'}
  ];
  this.selected = 0;

  // Yes/no popin
  this.openConfirmation = () => yesnopopin.open('DELETE_PHOTO_CONFIRMATION_TITLE');

  this.transparency = false;

  this.locale = $translate.use();
  this.setLocale = function() {
    $translate.use(this.locale);
  };

  this.samplePatternModel = {
    value: 'hey'
  };
  this.samplePatterns = [
    {
      pattern: 'JJ/MM/AAAA',
      locales: ['fr', 'en'],
      matches: function(value) {
        if (value) {
          var numbers = value.split('/', 3);
          if (numbers.length > 1 && numbers.length <= 3) {
            return numbers;
          }
        }
        return null;
      }
    },
    {
      pattern: 'MM/DD/YYYY',
      locales: ['en'],
      matches: function(value) {
        if (value) {
          var numbers = value.split('/', 3);
          if (numbers.length > 1 && numbers.length <= 3) {
            return numbers;
          }
        }
        return null;
      }
    },
    {
      pattern: 'X-Y-Z',
      locales: [],
      matches: function(value) {
        if (value) {
          var numbers = value.split('-', 3);
          if (numbers.length > 1 && numbers.length <= 3) {
            return numbers;
          }
        }
        return null;
      }
    }
  ];
  this.samplePatternCheck = function(result) {
    var pattern;
    $scope.guesses = [];
    for (let i = 0; i < result.length; i++) {
      var match = result[i];
      $scope.guesses.push(match);
    }
    if (!$scope.guesses.length) {
      pattern = '';
    }
    return pattern;
  };
  this.sampleDateModel = {
    value: null,
    dateValid: null
  };
  this.sampleHintDateModel = {
    value: null
  };

  var gedSpaceChoice = {
    tooltip: 'TOOLTIP_GED',
    onActive: () => window.alert('Go to Gedcom space'),
    label: 'GED',
    notificationsCount: 0
  };
  // this.$watch('tree_content.gedcom_count', function(newVal) {
  //  gedSpaceChoice.notificationsCount = newVal;
  // });

  var gedImport = {
    tooltip: 'TOOLTIP_IMPORT_GED',
    onActive: () => window.alert('Go to Gedcom wizard'),
    icon: 'fa fa-sign-in'
  };

  var fusionsSpace = {
    tooltip: 'TOOLTIP_FUSIONS',
    onActive: () => window.alert('Go to fusions'),
    icon: 'fa fa-link',
    notificationsCount: 0
  };
  //this.$watch('tree_content.fusion_count', function(newVal) {
  //  fusionsSpace.notificationsCount = newVal;
  //});

  var treeWriterToolbarChoices = [
    gedSpaceChoice,
    gedImport,
    fusionsSpace
    /*,
     {
     tooltip: 'TREE.MATCHING.TITLE',
     onActive: function () {
     if (this.treeType !== 'detailed_web') {
     this.treeType = 'detailed_web';
     readTree();
     }
     pubsub.publish(PUBSUB.TREE.MATCHING.TOGGLE);
     },
     getnotificationsCount: function () {
     return this.matchingsCount;
     },
     getState: function () {
     return this.matchingOpen;
     },
     icon: 'fc fc-matching'
     }*/
  ];

  // Menu

  this.searchOpen = false;
  this.treeType = 'web';
  var searchChoice = {
    tooltip: 'SEARCH.TITLE',
    onActive: () => window.alert('Show search window'),
    state: this.searchOpen,
    icon: 'fa fa-search',
    notificationsCount: 0
  };
  // this.$watch('searchOpen', function(newVal) {
  //  searchChoice.state = newVal;
  // });
  const treeDetailedChoice = {
    tooltip: 'fc-tree.fc-toolbar.TREE_DETAILED',
    onActive() {
      this.treeType = this.treeType === 'web' ? 'detailed_web' : 'web';
    },
    state: this.treeType === 'detailed_web',
    icon: 'fc fc-tree-detailed'
  };
  // this.$watch('treeType', function(newVal) {
  //  treeDetailedChoice.state = newVal === 'detailed_web';
  // });

  const treeReaderToolbarChoices = [
    searchChoice,
    treeDetailedChoice
  ];

  const canRead = function() {
    // TODO: In the future, we may receive explicit access rights about an tree
    return true;
  };
  const canWrite = function() {
    return true;
  };

  this.toolbarChoices = [];
  if (canRead()) {
    this.toolbarChoices = this.toolbarChoices.concat(treeReaderToolbarChoices);
  }
  if (canWrite()) {
    this.toolbarChoices = this.toolbarChoices.concat(treeWriterToolbarChoices);
  }

  this.zoombarChoices = [
    {
      tooltip: 'TOOLTIP_CENTER_PROFILE',
      onActive: () => window.alert('Center tree'),
      icon: 'fa fa-crosshairs',
      tooltipPlacement: 'top'
    },
    {
      tooltip: 'TOOLTIP_ZOOM_IN',
      onActive: () => window.alert('Zoom in'),
      icon: 'plus-icon',
      tooltipPlacement: 'left'
    },
    {
      tooltip: 'TOOLTIP_ZOOM_OUT',
      onActive: () => window.alert('Zoom out'),
      icon: 'minus-icon',
      tooltipPlacement: 'left'
    }
  ];


  // Menu

  const photo = {
    isUpdatable: true
  };
  const menu = menuBuilder.newMenu();
  const commentAction = {
    style: 'fc-comments-count',
    templateUrl: '/scripts/common/toolbar/choice/comment/commentToolbarChoice.html',
    scope: {
      object: photo
    },
    onActive: () => {
      // navigation.go('u.albums-update', {user_id: userId, album_id: album.id});
    }
  };
  menu.withAction(commentAction);

  const likeAction = {
    style: 'fc-like',
    templateUrl: '/scripts/common/toolbar/choice/like/likeToolbarChoice.html',
    scope: {
      object: photo
    }
  };
  menu.withAction(likeAction);

  const previousAction = {
    // tooltip: 'album.SHOW.PHOTO.PREVIOUS',
    icon: 'fa fa-angle-left',
    onActive: () => window.alert('Go to previous photo')
  };
  menu.withAction(previousAction);

  const nextAction = {
    // tooltip: 'album.SHOW.PHOTO.NEXT',
    icon: 'fa fa-angle-right',
    onActive: () => window.alert('Go to next photo')
  };
  menu.withAction(nextAction);

  const slideShowAction = {
    tooltip: 'album.SHOW.PHOTO.SLIDE_SHOW',
    icon: 'fa fa-play-circle-o',
    onActive: () => window.alert('Go to previous photo')
  };
  menu.withAction(slideShowAction);

  if (photo.isUpdatable) {
    const rotateLeftAction = {
      tooltip: 'album.SHOW.PHOTO.ROTATE_LEFT',
      icon: 'fa fa-reply',
      onActive: () => window.alert('Rotate photo left')
    };
    menu.withAction(rotateLeftAction);

    const rotateRightAction = {
      tooltip: 'album.SHOW.PHOTO.ROTATE_RIGHT',
      icon: 'fa fa-share',
      onActive: () => window.alert('Rotate photo right')
    };
    menu.withAction(rotateRightAction);

    const deleteAction = {
      tooltip: 'album.SHOW.PHOTO.DELETE',
      icon: 'fa fa-trash-o',
      onActive: () => window.alert('Delete photo'),
      style: 'wcs-g-icon-red-rollover'
    };
    menu.withAction(deleteAction);
  }
  menu.build();
});
