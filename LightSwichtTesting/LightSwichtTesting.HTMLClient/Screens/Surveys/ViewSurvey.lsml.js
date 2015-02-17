/// <reference path="~/GeneratedArtifacts/viewModel.js" />

myapp.ViewSurvey.Details_postRender = function (element, contentItem) {
    // Write code here.
    var name = contentItem.screen.Survey.details.getModel()[':@SummaryProperty'].property.name;
    contentItem.dataBind("screen.Survey." + name, function (value) {
        contentItem.screen.details.displayName = value;
    });
}

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
        alert(key + " : " + item);
    });

};