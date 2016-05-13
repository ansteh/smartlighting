function testCountMeetingsFrom() {
  var now = new Date();
  var startTime = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
  var data = countMeetingsTillNowFrom(startTime);

  Logger.log('json: ' + JSON.stringify(data));
}
