function updateState(){
  return new CronJob('* * * * * *', function() {
    console.log('You will see this message every second');
    physical.getLights()
    .then(function(lights){
      Object.keys(lights).forEach(function(index){
        let light = physical.getLight(index);
        light.getInfo()
        .then(function(info){
          if(info.state.reachable){
            software.trainProductByState({ name: info.name, index: index }, { bri: info.state.bri })
            .then(function(response){
              //console.log('trained by updateState:');
              physical.setBri(product.index, product.bri);
            });
          }
        });
      });
    })
    .catch(function(err){
      console.log('updateState', err);
    });
  }, null, true);
};
