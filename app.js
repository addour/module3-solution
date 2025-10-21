(function () {
  'use strict';

  angular.module('NarrowItDownApp', [])
  .controller('NarrowItDownController', NarrowItDownController)
  .service('MenuSearchService', MenuSearchService)
  .directive('foundItems', FoundItemsDirective);

  function FoundItemsDirective() {
    var ddo = {
      restrict: 'E',
      templateUrl: 'foundItems.html',
      scope: {
        found: '<',
        onRemove: '&'
      }
    };
    return ddo;
  }

  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService) {
    var ctrl = this;
    ctrl.searchTerm = "";
    ctrl.found = [];

    ctrl.narrowItDown = function () {
      MenuSearchService.getMatchedMenuItems(ctrl.searchTerm).then(function (results) {
        ctrl.found = results;
      });
    };

    ctrl.removeItem = function (index) {
      ctrl.found.splice(index, 1);
    };
  }

  MenuSearchService.$inject = ['$http'];
  function MenuSearchService($http) {
    var service = this;
    service.getMatchedMenuItems = function (searchTerm) {
      return $http({
        method: "GET",
        url: "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json"
      }).then(function (result) {
        var allItems = result.data.menu_items;
        var foundItems = [];

        if (searchTerm) {
          for (var i = 0; i < allItems.length; i++) {
            if (allItems[i].description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
              foundItems.push(allItems[i]);
            }
          }
        }
        return foundItems;
      });
    };
  }
})();
