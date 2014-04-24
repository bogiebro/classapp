angular.module('app.modalqueue', ['ui.bootstrap.tpls', 'ui.bootstrap'])

.factory('$modalQueue', function ($modal) {
  result = {};
  result.openers = [];
  result.isOpen = false;
  result.openModal = function () {
    if (result.openers[0] && !result.isOpen) {
      result.isOpen = true;
      $modal.open(result.openers.shift()).result.then(function () {
        result.isOpen = false;
        result.openModal();
      }, function () {
        result.isOpen = false;
        result.openModal();
      });
    }
  };
  result.addModal = function (obj) {
    result.openers.push(obj);
    result.openModal();
  }
  return result;
})
