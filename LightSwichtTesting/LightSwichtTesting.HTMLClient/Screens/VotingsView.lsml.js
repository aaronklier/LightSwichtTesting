/// <reference path="~/GeneratedArtifacts/viewModel.js" />
/// <reference path="../scripts/lswires.js" />

var array = [];
var newAnswer = false;

myapp.VotingsView.created = function (screen) {
    var details = screen.findContentItem("Wrapper")
    details.handleViewDispose(function () {
        array = [];
        newAnswer = false;
    });
};

myapp.VotingsView.Details_postRender = function (element, contentItem) {
    $.getJSON('/api/SurveyInfo/GetAnswersByUser/' + contentItem.screen.Survey.Id, function (data) {
        if (data.length == 0) {
            //No Answers yet::
            newAnswer = true;
            ArrayPushNewAnswers(contentItem.screen.Survey.Id);
            return;
        }
        else {
            //Already answered this survey::
            ArrayPushCurrentAnswers(data);
        }
    });
};

function ArrayPushNewAnswers(surveyId) {
    var filter = "(SurveyQuestion_Survey eq " + msls._toODataString(surveyId, ":Int32") + ")";
    myapp.activeDataWorkspace.ApplicationData.SurveyQuestions.filter(filter).execute().then(function (results) {
            $.each(results.results, function (key, item) {
                var answer = new myapp.QuestionAnswer;
                answer.Person = "akl";
                answer.Answer = 3;
                answer.setSurveyQuestion(item);
                array.push(answer);
            });
        },
        function (error) {
            alert(error);
        });
}
function ArrayPushCurrentAnswers(data){
    $.each(data, function (key, item) {
        myapp.activeDataWorkspace.ApplicationData.QuestionAnswers_SingleOrDefault(item).expand("SurveyQuestion").execute().then(function (results) {
            var answer = results.results[0];
            array.push(answer);
        },
        function (error) {
            alert(error);
        });
    });
}





myapp.VotingsView.Wrapper_postRender = function (element, contentItem) {
    if (!contentItem.screen.Survey.isActive) {
        $(".msls-header-area .msls-save-button").css("display", "none");    //natürlich auch serverseitig abfragen!
    }
};

function SetBackgroundcolor(answer) {
    switch (answer.Answer) {
        case 1: //Yes
            $("div:contains('" + answer.SurveyQuestion.Question + "')").parent("li").css("background", "#A3F4D2");
            break;
        case 2: //Maybe
            $("div:contains('" + answer.SurveyQuestion.Question + "')").parent("li").css("background", "#F2C283");
            break;
        case 3: //No
            $("div:contains('" + answer.SurveyQuestion.Question + "')").parent("li").css("background", "#FF7585");
            break;
        default: break;
    }
}
function SetAnswerAndBackgroundcolor(answer) {
    switch (answer.Answer) {
        case 1: //Yes
            answer.Answer = 2;
            SetBackgroundcolor(answer) //wird Maybe
            break;
        case 2: //Maybe
            answer.Answer = 3;
            SetBackgroundcolor(answer) //wird No
            break;
        case 3: //No
            answer.Answer = 1;
            SetBackgroundcolor(answer) //wird Yes
            break;
        default: break;
    } 
}

myapp.VotingsView.SurveyQuestionsTemplate_postRender = function (element, contentItem) {
    if(newAnswer == true) {
        $(element).parent("li").css("background", "#FF7585");
        return;
    }
    else {
        var answer = $.grep(array, function (item) {
            return item.SurveyQuestion.Id == contentItem.value.Id;
        });
        SetBackgroundcolor(answer[0]);
    }
};

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
 
    $.getJSON('/api/SurveyInfo/Get/' + contentItem.screen.Survey.Id, function (data) {
        $.each(data, function (key, item) {
           // alert(item.name);
        });
    });

};
