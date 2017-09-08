let i = 0;

const getId = function() {
  'use strict';
  return i++;
};

angular.module('famicity').constant('PUBSUB', {
  TREE: {
    MATCHING: {
      TOGGLE: getId(),
      CLOSE: getId(),
      COUNT: getId(),
      CLOSE_ITEM: getId(),
      IS_OPEN: getId(),
      IS_CLOSED: getId()
    },
    SEARCH: {
      TOGGLE: getId(),
      CLOSE: getId(),
      IS_OPEN: getId(),
      IS_CLOSED: getId()
    },
    GEDCOM: {
      LOCK: getId(),
      UNLOCK: getId(),
      STATUS: getId()
    },
    FUSION: {
      LOCK: getId(),
      UNLOCK: getId()
    },
    REFRESH: getId(),
    READY: getId()
  },
  PERMISSION: {
    ADD: {
      SUBMIT: 'permission.add.submit'
    }
  },
  NOTIFICATIONS: {
    TOGGLE: 'notifications:toggle',
    CLOSE: 'notifications:close',
    UNREADCOUNT: 'notifications:unreadcount',
    ENABLE: 'notifications:enable',
    DISABLE: 'notifications:disable',
    DISCONNECT: 'notifications:disconnect',
    DISCONNECT_SOCKET: 'notifications:disconnect_socket',
    RECEIVE: 'notifications:receive',
    REMOVE: 'notifications:remove'
  },
  CHAT: {
    CONTACT: {
      ALL: 'chat:contact:all',
      ADD: 'chat:contact:add',
      REMOVE: 'chat:contact:remove'
    },
    USER: {
      ONLINE: 'chat:user:online',
      UPDATE: 'chat:user:update'
    },
    SOCKET: {
      CONNECT: 'chat:socket:connect',
      DISCONNECT: 'chat:socket:disconnect'
    },
    ENABLE: 'chat:enable',
    DISABLE: 'chat:disable',
    CONNECT: 'chat:connect',
    DISCONNECT: 'chat:disconnect',
    RECEIVE: 'chat:receive',
    SEND: 'chat:send'
  },
  USER: {
    CONNECT: 'user:connect',
    DISCONNECT: 'user:disconnect',
    ACTIVATED: 'user:activated',
    UPDATE_LOCALE: 'user:update_locale'
  },
  MESSAGES: {
    SHOW: {
      REPLY: 'messages.show.reply'
    },
    READ: 'messages.read',
    UNREADCOUNT: 'messages.unreadcount',
    SHOW_DISCUSSION_PARTICIPANTS: 'messages.show_discussion_participants',
    WRITE: 'messages.write'
  },
  CALENDAR: {
    ADD: {
      SUBMIT: 'calendar.add.submit'
    },
    EDIT: {
      SUBMIT: 'calendar.edit.submit'
    }
  },
  ALBUM: {
    SHOW: {
      PHOTO: {
        PREVIOUS: 'album.photo.show.previous',
        NEXT: 'album.photo.show.next',
        SLIDE_SHOW: 'album.photo.show.slide_show',
        ROTATE_LEFT: 'album.photo.show.rotate_left',
        ROTATE_RIGHT: 'album.photo.show.rotate_right',
        DELETE: 'album.photo.show.delete'
      },
      SLIDE: 'album.photo.slide'
    },
    REORDER: {
      SUBMIT: 'album.reorder.submit'
    }
  },
  SETTINGS: {
    LOCALE: {
      LANGUAGE: {
        SUBMIT: 'settings.locale.language.submit'
      },
      CALENDAR: {
        SUBMIT: 'settings.locale.calendar.submit'
      }
    },
    PRIVACY: {
      DEFAULT_RIGHTS: {
        SUBMIT: 'settings.privacy.default-rights.submit'
      },
      SEARCH_ENGINE: {
        SUBMIT: 'settings.privacy.search-engine.submit'
      },
      TREE_RIGHTS: {
        SUBMIT: 'settings.privacy.tree-rights.submit'
      }
    },
    NOTIFICATIONS: {
      SUBMIT: 'settings.notifications.submit'
    }
  },
  DIRECTORY: {
    INVITATIONS: {
      SUBMIT: 'directory.invitations.submit',
      SENT: {
        REVIVE: {
          SUBMIT: 'directory.invitations.sent.revive'
        }
      }
    },
    GROUPS: {
      ADD_USERS: 'directory.groups.add-users',
      PROFILE: {
        SUBMIT: 'directory.groups.profile.submit'
      }
    }
  },
  PUSH: {
    CONNECT: 'push:connect',
    SOCKET: {
      CONNECT: 'push:socket:connect',
      DISCONNECT: 'push:socket:disconnect'
    }
  },
  PROFILE: {
    SHOW: {
      PHOTO: {
        PREVIOUS: 'profile.photo.show.previous',
        NEXT: 'profile.photo.show.next',
        SLIDE_SHOW: 'profile:show:photos:slide-show',
        ROTATE_LEFT: 'profile.photo.show.rotate_left',
        ROTATE_RIGHT: 'profile.photo.show.rotate_right',
        DELETE: 'profile.photo.show.delete'
      }
    },
    EDIT: {
      SUBMIT: 'profile:edit:submit'
    }
  },
  INVITATIONS: {
    UNREADCOUNT: 'invitations:unreadcount',
    ACCEPTED: 'invitations:accepted',
    DECLINED: 'invitations:declined'
  },
  HELP: {
    POPINS: 'help:popins'
  },
  WINDOW: {
    RESIZE: 'window:resize',
    DEVICE: 'window:device'
  },
  UPLOADER: {
    ON_SUBMITTED: 'uploader:onsubmitted',
    ON_PROGRESS: 'uploader:onprogress',
    ON_TOTAL_PROGRESS: 'uploader:ontotalprogress',
    ON_STATUS_CHANGE: 'uploader:onstatuschange',
    ON_COMPLETE: 'uploader:oncomplete',
    ON_ALL_COMPLETE: 'uploader:onallcomplete'
  },
  COOKIE: {
    CHECK: 'cookies:check'
  }
});
