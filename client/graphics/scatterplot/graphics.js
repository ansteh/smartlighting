var Graphics = {};

Graphics.scatter = function(options){
  var core = {
    chart_type: 'point',
    full_width: true,
    height: 400,
    right: 10,
    target: options.target,
    min_y: 120,
    color_accessor:'z',
    color_range: ['#000', 'yellow'],
    //x_rug: true,
    y_rug: true,
    //least_squares: true
  };

  function render(data){
    options.data = options.enhance(data);
    MG.data_graphic(_.merge(core, options));
  };

  return {
    render: render
  };
};

Graphics.meetings = function(target){
  function enhance(data){
    return _.map(data, function(point){
      point.z = point.meetings/10;
      point.w = point.bri/254;
      return point;
    });
  };

  var options =  {
    target: target,
    title: "Bri vs Meetings",
    enhance: enhance,
    x_accessor: 'meetings',
    y_accessor: 'bri',
    size_accessor:'w'
  };

  var Scatter = Graphics.scatter(options);

  return Graphics.scatter(options);
};

Graphics.hours = function(target){
  function enhance(series){
    series = _.map(series, function(data){
      var date = moment(data.date);
      var fixedDate = moment({
        hour: date.hour(),
        minute: date.minute(),
        seconds: date.seconds()
      }).toDate();

      return _.merge(data, {
        date: date.toDate(),
        day: date.day(),
        hours: date.hours(),
        fixedDate: fixedDate
      });
    });
    return series;
  };

  var options =  {
    target: target,
    title: "Bri vs Hours",
    enhance: enhance,
    x_accessor: 'fixedDate',
    y_accessor: 'bri',
    size_accessor:'w'
  };

  return Graphics.scatter(options);
};
