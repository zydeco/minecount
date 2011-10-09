jQuery.fn.calendarPicker = function(options) {
  // --------------------------  start default option values --------------------------
  if (!options.date)
    options.date = new Date();
  
  if (!options.today)
     options.today = new Date();

  if (typeof(options.maps) == "undefined")
      options.maps=null;

  if (typeof(options.years) == "undefined")
    options.years=1;

  if (typeof(options.months) == "undefined")
    options.months=3;

  if (typeof(options.days) == "undefined")
    options.days=4;

  if (typeof(options.showDayArrows) == "undefined")
    options.showDayArrows=true;

  if (typeof(options.useWheel) == "undefined")
    options.useWheel=true;

  if (typeof(options.callbackDelay) == "undefined")
    options.callbackDelay=500;
  
  if (typeof(options.monthNames) == "undefined")
    options.monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  if (typeof(options.dayNames) == "undefined")
    options.dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  if (typeof(options.availableDateCallback) == "undefined")
    options.availableDateCallback = null;

  // --------------------------  end default option values --------------------------

  var calendar = {currentDate: options.date};
  calendar.options = options;

  //build the calendar on the first element in the set of matched elements.
  var theDiv = this.eq(0);//$(this);
  theDiv.addClass("calBox");

  //empty the div
  theDiv.empty();

  var divMaps = $("<div>").addClass("calMap");
  var divYears = $("<div>").addClass("calYear");
  var divMonths = $("<div>").addClass("calMonth");
  var divDays = $("<div>").addClass("calDay");

  theDiv.append(divMaps).append(divYears).append(divMonths).append(divDays);

  calendar.changeDate = function(date, today, map) {
    if (date) calendar.currentDate = date;
    else date = calendar.currentDate;
    if (today) calendar.today = today;
    else today = calendar.today;
    if (map) calendar.map = map;
    else map = calendar.map;

    var fillMaps = function() {
      divMaps.empty();
      if (options.maps == null) return;
      var nc = options.maps.length;
      var w = parseInt((theDiv.width()-4-(nc)*4)/nc)+"px";
      var d = new Date(date);
      for(var i in options.maps) {
        var m = options.maps[i];
        var span = $("<span>").addClass("calElement").attr("mcmap", m).attr("millis", d.getTime()).attr("cbType", "map").html(m).css("width",w);
        if (map == m) span.addClass("today").addClass("selected");
        divMaps.append(span);
      }
    }
    
    var fillYears = function(date, t, map) {
      var year = date.getFullYear();
      divYears.empty();
      var nc = options.years*2+1;
      var w = parseInt((theDiv.width()-4-(nc)*4)/nc)+"px";
      for (var i = year - options.years; i <= year + options.years; i++) {
        var d = new Date(date);
        d.setFullYear(i);
        var span = $("<span>").addClass("calElement").attr("millis", d.getTime()).attr("mcmap", map).attr("cbType", "year").html(i).css("width",w);
        if (d.getYear() == t.getYear())
          span.addClass("today");
        if (d.getYear() == calendar.currentDate.getYear())
          span.addClass("selected");
        if (options.availableDateCallback != null && options.availableDateCallback(map,d.getFullYear(), -1, -1) == false)
          span.addClass("disabled");
        divYears.append(span);
      }
    }

    var fillMonths = function(date, t, map) {
      var month = date.getMonth();
      divMonths.empty();
      if (options.months == 'fixed') {
        var nc = 12;
        var w = parseInt((theDiv.width()-4-(nc)*4)/nc)+"px";
        for (var i=0; i < nc; i++) {
          var d = new Date(date);
          var oldday = d.getDate();
          d.setMonth(i);

          if (d.getDate() != oldday) {
            d.setMonth(d.getMonth() - 1);
            d.setDate(28);
          }
          var span = $("<span>").addClass("calElement").attr("millis", d.getTime()).attr("mcmap", map).attr("cbType", "month").html(options.monthNames[d.getMonth()]).css("width",w);
          if (d.getYear() == t.getYear() && d.getMonth() == t.getMonth())
            span.addClass("today");
          if (d.getYear() == calendar.currentDate.getYear() && d.getMonth() == calendar.currentDate.getMonth())
            span.addClass("selected");
          if (options.availableDateCallback != null && options.availableDateCallback(map,d.getFullYear(), d.getMonth()+1, -1) == false)
            span.addClass("disabled");
          divMonths.append(span);
        }
      } else {
        var oldday = date.getDay();
        var nc = options.months*2+1;
        var w = parseInt((theDiv.width()-4-(nc)*4)/nc)+"px";
        for (var i = -options.months; i <= options.months; i++) {
          var d = new Date(date);
          var oldday = d.getDate();
          d.setMonth(month + i);

          if (d.getDate() != oldday) {
            d.setMonth(d.getMonth() - 1);
            d.setDate(28);
          }
          var span = $("<span>").addClass("calElement").attr("millis", d.getTime()).attr("mcmap", map).attr("cbType", "month").html(options.monthNames[d.getMonth()]).css("width",w);
          if (d.getYear() == t.getYear() && d.getMonth() == t.getMonth())
            span.addClass("today");
          if (options.availableDateCallback != null && options.availableDateCallback(map,d.getFullYear(), d.getMonth()+1, -1) == false)
            span.addClass("disabled");
          divMonths.append(span);
        }
      }
    }

    var fillDays = function(date, t, map) {
      var day = date.getDate();
      divDays.empty();
      if (options.days == 'fixed') {
        options.showDayArrows = false;
        var nc = 16;
        var w = parseInt((theDiv.width()-4-(options.showDayArrows?12:0)-(nc)*4)/(nc-(options.showDayArrows?2:0)))+"px";
        for (var i = 1; i <= 31; i++) {
          var d = new Date(date);
          d.setDate(i);
          if (d.getDate() != i) break;
          var span = $("<span>").addClass("calElement").attr("millis", d.getTime()).attr("mcmap", map).attr("cbType", "day");
          span.html("<span class=dayNumber>" + d.getDate() + "</span><br>" + options.dayNames[d.getDay()]).css("width",w);
          if (d.getYear() == t.getYear() && d.getMonth() == t.getMonth() && d.getDate() == t.getDate())
            span.addClass("today");
          if (d.getYear() == calendar.currentDate.getYear() && d.getMonth() == calendar.currentDate.getMonth() && d.getDate() == calendar.currentDate.getDate())
            span.addClass("selected");
          if (options.availableDateCallback && options.availableDateCallback(map,d.getFullYear(), d.getMonth()+1, d.getDate()) == false)
            span.addClass("disabled");
          divDays.append(span);
          if (i == 16) divDays.append($("<br>"));
          
        }
      } else {
        var nc = options.days*2+1;
        var w = parseInt((theDiv.width()-4-(options.showDayArrows?12:0)-(nc)*4)/(nc-(options.showDayArrows?2:0)))+"px";
        for (var i = -options.days; i <= options.days; i++) {
          var d = new Date(date);
          d.setDate(day + i)
          var span = $("<span>").addClass("calElement").attr("millis", d.getTime()).attr("mcmap", map).attr("cbType", "day");
          if (i == -options.days && options.showDayArrows) {
            span.addClass("prev");
          } else if (i == options.days && options.showDayArrows) {
            span.addClass("next");
          } else {
            span.html("<span class=dayNumber>" + d.getDate() + "</span><br>" + options.dayNames[d.getDay()]).css("width",w);
            if (d.getYear() == t.getYear() && d.getMonth() == t.getMonth() && d.getDate() == t.getDate())
              span.addClass("today");
            if (d.getYear() == calendar.currentDate.getYear() && d.getMonth() == calendar.currentDate.getMonth() && d.getDate() == calendar.currentDate.getDate())
              span.addClass("selected");
            if (options.availableDateCallback && options.availableDateCallback(map,d.getFullYear(), d.getMonth()+1, d.getDate()) == false)
              span.addClass("disabled");
          }
          divDays.append(span);
        }
      }
    }

    fillMaps();
    fillYears(date, today, map);
    fillMonths(date, today, map);
    fillDays(date, today, map);

  }

  theDiv.click(function(ev) {
    var el = $(ev.target).closest(".calElement");
    if (el.hasClass("calElement")) {
      calendar.changeDate(new Date(parseInt(el.attr("millis"))), null, el.attr("mcmap"));
      
      if (typeof(options.callback) == "function" && !(el.hasClass("disabled") || el.hasClass("prev") || el.hasClass("next"))) {
          if (calendar.timer)
            clearTimeout(calendar.timer);

          calendar.timer = setTimeout(function() {
            options.callback(calendar, el.attr("cbType"));
          }, options.callbackDelay);
        }
    }
  });


  //if mousewheel
  if ($.event.special.mousewheel && options.useWheel) {
    divYears.mousewheel(function(event, delta) {
      var d = new Date(calendar.currentDate.getTime());
      d.setFullYear(d.getFullYear() + delta);
      calendar.changeDate(d, new Date());
      return false;
    });
    divMonths.mousewheel(function(event, delta) {
      var d = new Date(calendar.currentDate.getTime());
      d.setMonth(d.getMonth() + delta);
      calendar.changeDate(d, new Date());
      return false;
    });
    divDays.mousewheel(function(event, delta) {
      var d = new Date(calendar.currentDate.getTime());
      d.setDate(d.getDate() + delta);
      calendar.changeDate(d, new Date());
      return false;
    });
  }


  calendar.changeDate(options.date, options.today, options.defaultMap);

  return calendar;
};