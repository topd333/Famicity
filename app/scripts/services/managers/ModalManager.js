angular.module('famicity').factory('ModalManager', function($modal, $rootScope) {
    'use strict';

    const Modal = (function() {
      function Modal(options) {
        this.modal = $modal.open(options);
      }

      return Modal;
    })();

    const ModalManager = (function() {
      function ModalManager() {
        $rootScope.$on('$stateChangeStart', (function(_this) {
          return function() {
            if (_this.isOpen()) {
              _this.modal.modal.close();
              _this.modal = null;
            }
          };
        })(this));
        this.modal = null;
      }

      ModalManager.prototype.open = function(options) {
        this.modal = new Modal(options);
        this.modal.modal.result.finally((function(_this) {
          return function() {
            _this.modal = null;
          };
        })(this));
        return this.modal.modal;
      };

      ModalManager.prototype.close = function(result) {
        let promise;
        if (this.modal) {
          this.modal.modal.close(result);
          promise = this.modal.modal.result;
        }
        this.modal = null;
        return promise;
      };

      ModalManager.prototype.dismiss = function(result) {
        this.modal.dismiss(result);
        return this.modal.modal.result;
      };

      ModalManager.prototype.isOpen = function() {
        return this.modal != null;
      };

      return ModalManager;
    })();
    return new ModalManager();
  }
);
