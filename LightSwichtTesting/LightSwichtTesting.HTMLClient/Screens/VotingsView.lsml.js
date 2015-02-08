/// <reference path="~/GeneratedArtifacts/viewModel.js" />
/// <reference path="../scripts/lswires.js" />

var red = "#FF7585";
var orange = "#F2C283";
var green = "#A3F4D2";

function SetBackgroundcolor(answer) {
    switch (answer.Answer) {
        case 1: //Yes
            $("div:contains('" + answer.SurveyQuestion.Question + "')").parent("li").css("background", green);
            break;
        case 2: //Maybe
            $("div:contains('" + answer.SurveyQuestion.Question + "')").parent("li").css("background", orange);
            break;
        case 3: //No
            $("div:contains('" + answer.SurveyQuestion.Question + "')").parent("li").css("background", red);
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
function ArrayPushCurrentAnswers(data) {
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



myapp.VotingsView.SurveyQuestionsTemplate_postRender = function (element, contentItem) {
    if (newAnswer == true) {
        $(element).parent("li").css("background", red);
        return;
    }
    //else {
    //    for (var i = 0, len = array.length; i < len; i++) {
    //        if (array[i].SurveyQuestion.Id === contentItem.value.Id) {
    //            SetBackgroundcolor(array[i]); // Return as soon as the object is found
    //        }
    //    }
    //}
    else {
        var answer = $.grep(array, function (item) {
            return item.SurveyQuestion.Id == contentItem.value.Id;
        });
        SetBackgroundcolor(answer[0]); //wird beim ersten Mal in ein SurveyVoting klicken nicht richtig ausgeführt
    }
};

myapp.VotingsView.Wrapper_postRender = function (element, contentItem) {
    if (!contentItem.screen.Survey.isActive) {
        $(".msls-header-area .msls-save-button").css("display", "none");    //natürlich auch serverseitig abfragen!
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

function GetBackgroundColorForAnswer(answer) {
    switch (answer) {
        case "Yes": return green;
        case "Maybe": return orange;
        case "No": return red;
        default: "blue";
    }
}
myapp.VotingsView.Survey_render = function (element, contentItem) {
 
    $(element).append('<table id="votingTable" class="msls-table ui-responsive table-stripe msls-hstretch ui-table ui-table-reflow"><thead></thead><tbody></tbody');

    $.getJSON('/api/SurveyInfo/Get/' + contentItem.screen.Survey.Id, function (data) {
        $.each(data, function (key, row) {
            if (key == 0) {
                    $.each(row, function (key, value) {
                        $("#votingTable thead").append('<th class="msls-table-header">' + value + '</th>');
                    });
                return;
            }
            //else
            $("#votingTable tbody").append('<tr></tr>');
                $.each(row, function (key, value) {
                    $("#votingTable tbody tr:last").append('<td class="msls-column" style="background:'+ GetBackgroundColorForAnswer(value) +' ">' + value + '</td>');
                });
        });
    });
    $(element).append('</table>');

};
