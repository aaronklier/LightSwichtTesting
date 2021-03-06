﻿/// <reference path="~/GeneratedArtifacts/viewModel.js" />
/// <reference path="../scripts/lswires.js" />

var red = "#FF7585";
var orange = "#F2C283";
var green = "#A3F4D2";

function SetBackgroundcolor(answer) {
    switch (answer.Answer) {
        case 1: //Yes
            var li = $("div:contains('" + answer.SurveyQuestion.Question + "')").parent("li").css("background", green);
            $(li).find(".votingIcon").remove();
            var iconToAdd = $(GetHtmlForAnswer("Yes"));
            $(li).append(iconToAdd);
            iconToAdd.addClass("votingIcon");
            break;
        case 2: //Maybe
            var li = $("div:contains('" + answer.SurveyQuestion.Question + "')").parent("li").css("background", orange);
            $(li).find(".votingIcon").remove();
            var iconToAdd = $(GetHtmlForAnswer("Maybe"));
            $(li).append(iconToAdd);
            iconToAdd.addClass("votingIcon");
            break;
        case 3: //No
            var li = $("div:contains('" + answer.SurveyQuestion.Question + "')").parent("li").css("background", red);
            $(li).find(".votingIcon").remove();
            var iconToAdd = $(GetHtmlForAnswer("No"));
            $(li).append(iconToAdd);
            iconToAdd.addClass("votingIcon");
            break;
        default:
            break;
    }
}
function SetAnswerAndBackgroundcolor(answer) {
    switch (answer.Answer) {
        case 1: //Yes
            if (answer.SurveyQuestion.Survey.AllowMaybe == false) {
                answer.Answer = 3;
                SetBackgroundcolor(answer) //wird No
            }
            else {
                answer.Answer = 2;
                SetBackgroundcolor(answer) //wird Maybe
            }
            break;
        case 2: //Maybe
            answer.Answer = 3;
            SetBackgroundcolor(answer) //wird No
            break;
        case 3: //No
            answer.Answer = 1;
            SetBackgroundcolor(answer) //wird Yes
            break;
        default://default is NO
                answer.Answer = 3;
                SetBackgroundcolor(answer)
                break;
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

// WAS FEHLT: FALLS FRAGEN IM NACHHINEIN HINZUGEFÜGT WERDEN:: DIESE MÜSSTEN "NEU ERSTELLT" WERDEN...
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

function GetBackgroundColorForAnswer(answer) {
    switch (answer) {
        case "Yes": return green;
        case "Maybe": return orange;
        case "No": return red;
        default: "blue";
    }
}
function GetHtmlForAnswer(answer) {
    switch (answer) {
        case "Yes": return "<img class='answerIcon' src='Content/images/check.png'>";
        case "Maybe": return "<img class='answerIcon' src='Content/images/question.png'>";
        case "No": return "<img class='answerIcon' src='Content/images/cross.png'>";
        default: return answer;
    }
}

myapp.VotingsView.Survey_render = function (element, contentItem) {
 
    $(element).append('<table id="votingTable" class="msls-table ui-responsive table-stripe msls-hstretch ui-table ui-table-reflow"><thead></thead><tbody></tbody');
    var rowCounter = 1;
    $.getJSON('/api/SurveyInfo/Get/' + contentItem.screen.Survey.Id, function (data) {
        $.each(data, function (key, row) {
            if (key == 0) {
                $.each(row, function (key, value) {
                    if (key == 0) { $("#votingTable thead").append('<th class="msls-table-header" style="width:25px !important;">' + value + '</th>'); return;}
                        $("#votingTable thead").append('<th class="msls-table-header">' + value + '</th>');
                    });
                return;
            }
            //else
            $("#votingTable tbody").append('<tr></tr>');
            $.each(row, function (key, value) {
                $("#votingTable tbody tr:last").append('<td class="msls-column" style="background:' + GetBackgroundColorForAnswer(value) + ' ">' + GetHtmlForAnswer(value) + '</td>');
                });
        });
    });
    $(element).append('</table>');

};


//########## TAB 2::



function SendComment(contentItem) {
    var surveyId = contentItem.screen.Survey.Id;
    var text = $('#newMessage').val();
    if (text == null || text.length < 1) {
        alert("Please fill in your comment.");
        return;
    }
    var newComment = new myapp.Comment;
    newComment.Message = text;
    newComment.setSurvey(contentItem.screen.Survey);
    return myapp.activeDataWorkspace.ApplicationData.saveChanges().then(function () {
        screen.getComments();
    });

}
myapp.VotingsView.Textfield_render = function (element, contentItem) {
    $(element).append("<input type='text' value='' id='newMessage'/>")
};
myapp.VotingsView.SendComment_execute = function (screen) {
    var surveyId = screen.Survey.Id;
    var text = $('#newMessage').val();
    if (text == null || text.length < 1) {
        return;
    }
    var newComment = new myapp.Comment;
    newComment.Message = text;
    newComment.setSurvey(screen.Survey);
    return myapp.activeDataWorkspace.ApplicationData.saveChanges().then(function () {
        $('#newMessage').val('');
        screen.getComments();
    });
};

myapp.VotingsView.Comments1Template_postRender = function (element, contentItem) {
    $(element).parent("li").addClass("SurveyComment");
};
myapp.VotingsView.CreatedBy_postRender = function (element, contentItem) {
    $(element).css("font-weight","bold");
};
myapp.VotingsView.Comments_postRender = function (element, contentItem) {

    var surveyId = contentItem.screen.Survey.Id;
    setInterval(function ()
    {
        var filter = "(Comment_Survey eq " + msls._toODataString(surveyId, ":Int32") + ")";
        myapp.activeDataWorkspace.ApplicationData.Comments.filter(filter).execute().then(function (results) {
                var currentComments = contentItem.screen.Comments.count;
                if (results.results.length != currentComments) {
                    contentItem.screen.Comments.load();
                }
        });
    }, 3000);

};
