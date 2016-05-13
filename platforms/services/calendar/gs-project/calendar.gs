function getMeetingsTillNowFrom(startTime){
  return CalendarApp.getDefaultCalendar().getEvents(startTime, new Date(), {search: 'meeting'});
};

function countMeetingsTillNowFrom(startTime){
  var meetingEventsByDay = getMeetingsTillNowByDayFrom(startTime);
  return {
    start: startTime.toString(),
    series: meetingEventsByDay.map(function(day){
      return day.length;
    })
  }
};

function getMeetingsTillNowByDayFrom(startTime){
  return getDateSeries(startTime, new Date(), {search: 'meeting'});
};

function getDateSeries(startTime, endTime, options){
  var calendar = CalendarApp.getDefaultCalendar();
  var start = moment(startTime);
  var end = moment(endTime);
  var days = [];
  do {
    days.push(calendar.getEventsForDay(start.toDate(), options));
    start = start.add(1, 'days');
  } while(start.isSameOrBefore(end));
  return days;
};
