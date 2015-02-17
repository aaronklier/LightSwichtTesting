/// <reference path="~/GeneratedArtifacts/viewModel.js" />

myapp.ViewSurvey.Details_postRender = function (element, contentItem) {
    // Write code here.
    var name = contentItem.screen.Survey.details.getModel()[':@SummaryProperty'].property.name;
    contentItem.dataBind("screen.Survey." + name, function (value) {
        contentItem.screen.details.displayName = value;
    });
}



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
        inline: true
    });
};
myapp.ViewSurvey.SaveDateTime_postRender = function (element, contentItem) {
    $(element).css("float", "right");
};
myapp.ViewSurvey.SaveDateTime_execute = function (screen) {
 
    var value = $('.dateTimePicker').val();
    if (value == "" || value == null) {
        alert("Please choose a DateTime!");
        return;
    }

    var question = new myapp.SurveyQuestion;
    question.setSurvey(screen.Survey);
    question.Question = value;

    return myapp.activeDataWorkspace.ApplicationData
    .saveChanges().then(function () {
        // Refresh the Questions
        screen.getSurveyQuestions();
        $('.dateTimePicker'). RESET
    });

};