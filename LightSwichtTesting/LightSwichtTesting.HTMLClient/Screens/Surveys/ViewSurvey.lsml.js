/// <reference path="~/GeneratedArtifacts/viewModel.js" />
/// <reference path="../../scripts/date.js" />

myapp.ViewSurvey.Details_postRender = function (element, contentItem) {
    // Write code here.
    var name = contentItem.screen.Survey.details.getModel()[':@SummaryProperty'].property.name;
    contentItem.dataBind("screen.Survey." + name, function (value) {
        contentItem.screen.details.displayName = value;
    });
}
//myapp.ViewSurvey.AllowMaybe_postRender = function (element, contentItem) {
//    setTimeout(function () {
//        $(element).find("select").slider("disable");
//    }, 0);
//};
//myapp.ViewSurvey.isActive_postRender = function (element, contentItem) {
//    setTimeout(function () {
//        $(element).find("select").slider("disable");
//    }, 0);
//};

// ADD MULTIPLE DATES
myapp.ViewSurvey.ScreenContent_render = function (element, contentItem) {
    
    $(element).addClass("multiDatePicker");
    $('.multiDatePicker').multiDatesPicker({
        numberOfMonths: [3, 4]
    });

};

myapp.ViewSurvey.SaveDates_postRender = function (element, contentItem) {
    $(element).css("float","right");
};

myapp.ViewSurvey.SaveDates_execute = function (screen) {

    var dates = $('.multiDatePicker').multiDatesPicker('getDates');
    if(dates.length === 0) {
        alert("Please pick your dates!");
        return;
    }

    $.each(dates, function (key, item) {
        var question = new myapp.SurveyQuestion;
        question.setSurvey(screen.Survey);
        question.Question = item.toString();
    });
    return myapp.activeDataWorkspace.ApplicationData
    .saveChanges().then(function () {
        // Refresh the Questions
        screen.getSurveyQuestions();
        $('.multiDatePicker').multiDatesPicker('resetDates', 'picked');
    });
};



// ADD DATE TIME

myapp.ViewSurvey.ScreenContentDateTime_render = function (element, contentItem) {
  
    $(element).addClass("dateTimePicker");
    $('.dateTimePicker').datetimepicker({
        step: 15,
        inline: true,
        defaultTime: '08:00'
    });

};
myapp.ViewSurvey.SaveDateTime_postRender = function (element, contentItem) {
    $(element).css("float", "right");
};


Date.prototype.ddmmyyyy = function () {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
    var dd = this.getDate().toString();
    return (dd[1] ? dd : "0" + dd[0]) + "." + (mm[1] ? mm : "0" + mm[0]) + "." + yyyy;
};

function GetDateFormatted(date) {
    var d = new Date(date);
    return d.ddmmyyyy();
}
function GetNumberFormatted(number) {
    return ((number < 10) ? ("0" + number) : number)
}
function GetDateWithTimeSpanFormatted(von, bis) {
    var datum = GetDateFormatted(von);
    return datum + " " + GetNumberFormatted(von.getHours()) + ":" + GetNumberFormatted(von.getMinutes()) + " - " + GetNumberFormatted(bis.getHours()) + ":" + GetNumberFormatted(bis.getMinutes());
}

function GetQuestionFromInput(dateTime, timeSpan) {
    if (timeSpan == null) return;
    if (timeSpan == "allday") {
        return GetDateFormatted(dateTime);
    }
    //if not allday-event:
    var VonDate = new Date(dateTime);
    var BisDate = new Date(VonDate);
    var hrs = parseFloat(timeSpan).toFixed(2);
    BisDate.addHours(hrs);
    return GetDateWithTimeSpanFormatted(VonDate, BisDate);
}

myapp.ViewSurvey.SaveDateTime_execute = function (screen) {
    //date and startTime
    var dateTimeValue = $('.dateTimePicker').val();
    if (dateTimeValue == "" || dateTimeValue == null) {
        alert("Please choose a Date / Time!");
        return;
    }
    
    //create and get Question from users input
    var timeSpan = $("#selectTimeSpan").val();
    var questionTxt = GetQuestionFromInput(dateTimeValue, timeSpan);
    var x = 1;

    //var question = new myapp.SurveyQuestion;
    //question.setSurvey(screen.Survey);
    //question.Question = questionTxt;

    //return myapp.activeDataWorkspace.ApplicationData
    //.saveChanges().then(function () {
    //    // Refresh the Questions
    //    screen.getSurveyQuestions();
    //});

};
myapp.ViewSurvey.TimeSpan_render = function (element, contentItem) {
    
    $(element).html("<div class='ui-select'>"
       + "<select id='selectTimeSpan'>"
       + "<option value='allday'>All-day Event</option>"
       + "<option value='0.25'>15 Minuten</option>"
       + "<option value='0.5'>30 Minuten</option>"
       + "<option value='1'>1 Stunde</option>"
       + "<option value='1.5'>1.5 Stunden</option>"
       + "<option value='2'>2 Stunden</option>"
       + "<option value='2.5'>2.5 Stunden</option>"
       + "<option value='3'>3 Stunden</option>"
       + "<option value='3.5'>3.5 Stunden</option>"
       + "<option value='4'>4 Stunden</option>"
       + "<option value='4.5'>4.5 Stunden</option>"
       + "<option value='5'>5 Stunden</option>"
       + "<option value='5.5'>5.5 Stunden</option>"
       + "<option value='6'>6 Stunden</option>"
       + "<option value='6.5'>6.5 Stunden</option>"
       + "<option value='7'>7 Stunden</option>"
       + "<option value='7.5'>7.5 Stunden</option>"
       + "<option value='8'>8 Stunden</option>"
       + "</select></div>");

};
myapp.ViewSurvey.AddDates_postRender = function (element, contentItem) {
    $(element).css("display","none"); // DELETE this Button if not used in the next time..
};

//myapp.ViewSurvey.AddDateTimes_postRender = function (element, contentItem) {
//    $(element).children().find(".msls-label").addClass("TEST");
//};
