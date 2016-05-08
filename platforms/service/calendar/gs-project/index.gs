function json(data){
  return ContentService.createTextOutput(JSON.stringify(data))
  .setMimeType(ContentService.MimeType.JSON);
};

function doGet(request){
  if((request.parameter.task === 'meetings') && (request.parameter.date)){
    var startTime = new Date(parseInt(request.parameter.date));
    var data = countMeetingsTillNowFrom(startTime);
    return json(data);
  } else {
    return json({ error: 'invalid querystring!'});
  }
};
