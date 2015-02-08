/// <reference path="~/GeneratedArtifacts/viewModel.js" />
/// <reference path="../scripts/lswires.js" />

var array = [];

myapp.VotingsView.created = function (screen) {
    var details = screen.findContentItem("Wrapper")
    details.handleViewDispose(function () {
        array = [];
    });
};
myapp.VotingsView.Wrapper_postRender = function (element, contentItem) {
    if (!contentItem.screen.Survey.isActive) {
        $(".msls-header-area .msls-save-button").css("display", "none");    //natürlich auch serverseitig abfragen!
    }
};

myapp.VotingsView.SurveyQuestionsTemplate_postRender = function (element, contentItem) {

    $(element).parent("li").css("background", "#FF7585");

    var answer = new myapp.QuestionAnswer;
    answer.Person = "akl";
    answer.Answer = 3;
    answer.setSurveyQuestion(contentItem.value);
    array.push(answer);

};

function SetBackgroundcolor(question, color) {
    $("div:contains('" + question + "')").parent("li").css("background", color);;
}
function SetAnswerAndBackgroundcolor(answer) {
    switch (answer.Answer) {
        case 1: //Yes
            SetBackgroundcolor(answer.SurveyQuestion.Question, "#F2C283") //wird Maybe
            answer.Answer = 2;
            break;
        case 2: //Maybe
            SetBackgroundcolor(answer.SurveyQuestion.Question, "#FF7585") //wird No
            answer.Answer = 3;
            break;
        case 3: //No
            SetBackgroundcolor(answer.SurveyQuestion.Question, "#A3F4D2") //wird Yes
            answer.Answer = 1;
            break;
        default: break;
    } 
}

myapp.VotingsView.SurveyQuestions_ItemTap_execute = function (screen) {

    var id = screen.SurveyQuestions.selectedItem.Id;
    var answer = $.grep(array, function (item) {
        return item.SurveyQuestion.Id == id;
    });
    SetAnswerAndBackgroundcolor(answer[0]);

};

//myapp.VotingsView.SaveAnswer_execute = function (screen) {

//    return myapp.activeDataWorkspace.ApplicationData.saveChanges().then(function () {
//        screen.getSurvey(); //als refresh der Seite brauchbar ??!
//    })

//};

myapp.VotingsView.Survey_render = function (element, contentItem) {
 
    $.getJSON('/api/SurveyInfo/' + contentItem.screen.Survey.Id, function (data) {
        $.each(data, function (key, item) {
           // alert(item.name);
        });
    });

};
