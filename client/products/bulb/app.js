app.directive('intToNumber', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
      ngModel.$parsers.push(function(value) {
        return '' + value;
      });
      ngModel.$formatters.push(function(value) {
        return parseFloat(value, 10);
      });
    }
  };
});

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

        $scope.bulbs = lights;
        if(_.keys(lights).length === 0){
            $scope.bulbs = Hue.dummyBulbs;
        }
        $scope.$apply();
      });
    }
  };
});

app.directive('bulb', function(BulbStates, Socket){
  return {
    restrict: 'E',
    templateUrl: 'client/products/bulb/instance.tpl.html',
    scope: { item: '=' },
    controller: function($scope, $element, $interval, $filter){
      $scope.item.state.control = true;
      $scope.states = BulbStates.states;
      $scope.bri = 0;

      $scope.getStateValue = function(state, entity){
        return BulbStates.valueOf($scope.item.state, state, entity);
      };

      var ForecastChart = Graphics.dayforecast($element.find('#forecast')[0]);

      $scope.updateChart = function(){
        Socket.emit('day-forecast', {
          name: $scope.item.name
        });
      };
      $scope.updateChart();

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
        //console.log('trained', result);
      });

      $scope.forecast = function(){
        Socket.emit('forecast', {
          name: $scope.item.name
        });
      };

      $interval($scope.forecast, 1000);

      Socket.on('forecast'+$scope.item.name, function(result){
        //console.log('forecast', $scope.item.name, result);
        $scope.bri = $filter('number')(result.bri, 0);
      });

      $scope.switch = function(){
        Socket.emit('switch', {
          name: $scope.item.name,
          index: $scope.item.index
        });
      };

      Socket.on('switch'+$scope.item.name, function(state){
        $scope.item.state.on = state.on;
        //console.log(state);
        $scope.$apply();
      });

      $scope.briSetted = function(){
        Socket.emit('set-bri', {
          name: $scope.item.name,
          bri: $scope.bri,
          index: $scope.item.index
        });
      };

      Socket.on('set-bri'+$scope.item.name, function(response){
        //console.log(response);
        $scope.updateChart();
      });

      $scope.meetings = 0;
      $scope.getMeetings = function(){
        Socket.emit('meetings', {
          name: $scope.item.name
        });
      };
      $scope.getMeetings();

      Socket.on('meetings'+$scope.item.name, function(result){
        //console.log(result);
        $scope.meetings = result.meetings;
        $scope.updateChart();
      });
    }
  };
});
