var app = angular.module('app', ['ngMaterial']);

app.factory('Hue', function(){
  return {};
});

app.factory('Socket', function(){
  return io();
});
