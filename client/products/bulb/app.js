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

app.directive('bulbInsight', function(Hue){
  return {
    restrict: 'E',
    templateUrl: 'client/products/bulb/insight.tpl.html',
    scope: {},
    controller: function($scope){
      Hue.onLights(function(lights){
        console.log('Here are the lights:', lights);

        if(_.keys(lights).length === 0){
            $scope.bulbs = Hue.dummyBulbs;
            $scope.$apply();
        } else {
          $scope.bulbs = lights;
        }
      });
    }
  };
});

app.directive('bulb', function(BulbStates, Socket){
  return {
    restrict: 'E',
    templateUrl: 'client/products/bulb/instance.tpl.html',
    scope: { item: '=' },
    controller: function($scope, $element){
      $scope.item.state.control = true;

      $scope.states = BulbStates.states;

      $scope.getStateValue = function(state, entity){
        return BulbStates.valueOf($scope.item.state, state, entity);
      };

      var ForecastChart = Graphics.dayforecast($element.find('#forecast')[0]);
      Socket.emit('day-forecast', {
        name: $scope.item.name
      });

      Socket.on('day-forecast'+$scope.item.name, function(result){
        //console.log(result);
        ForecastChart.render(result);
      });

      $scope.train = function(){
        Socket.emit('train', {
          name: $scope.item.name
        });
      };

      Socket.on('trained', function(result){
        console.log('trained', result);
      });

      $scope.forecast = function(){
        Socket.emit('forecast', {
          name: $scope.item.name
        });
      };

      Socket.on('forecast'+$scope.item.name, function(result){
        console.log('forecast', result);
      });
    }
  };
});
