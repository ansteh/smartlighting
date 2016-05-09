app.factory('BulbStates', function(){
  var States = BulbStateSchema;

  function getValueOf(instance, state, entity){
    var entityOptions = States[state][entity];
    var value = entityOptions.off;
    if(instance[state]){
      value = entityOptions.on;
    }
    return value;
  };

  return {
    states: States,
    valueOf: getValueOf
  };
});

app.directive('bulbInsight', function(){
  return {
    restrict: 'E',
    templateUrl: 'client/products/bulb/insight.tpl.html',
    scope: {},
    controller: function($scope){
      $scope.bulbs = [{
        name: 'Bulb 1',
        reach: true,
        power: true,
        control: true
      }/*, {
        name: 'Bulb 2',
        reach: false,
        power: true,
        control: true
      }*/];
    }
  };
});

app.directive('bulb', function(BulbStates, Socket){
  return {
    restrict: 'E',
    templateUrl: 'client/products/bulb/instance.tpl.html',
    scope: { item: '=' },
    controller: function($scope, $element){
      $scope.states = BulbStates.states;

      $scope.getStateValue = function(state, entity){
        return BulbStates.valueOf($scope.item, state, entity);
      };

      Socket.emit('day-forecast', {
        name: $scope.item.name
      });

      var ForecastChart = Graphics.dayforecast($element.find('#forecast')[0]);
      Socket.on('day-forecast', function(result){
        console.log(result);
        ForecastChart.render(result);
      });

      $scope.train = function(){
        Socket.emit('train', {
          name: $scope.item.name
        });
      };

      Socket.on('trained', function(result){
        console.log(result);
      });

      $scope.forecast = function(){
        Socket.emit('forecast', {
          name: $scope.item.name
        });
      };

      Socket.on('forecast', function(result){
        console.log(result);
      });
    }
  };
});
