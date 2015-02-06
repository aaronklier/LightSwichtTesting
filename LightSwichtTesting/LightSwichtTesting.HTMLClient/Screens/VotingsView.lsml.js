/// <reference path="~/GeneratedArtifacts/viewModel.js" />
/// <reference path="../scripts/lswires.js" />

myapp.VotingsView.SurveyQuestions_postRender = function (element, contentItem) {
    lsWire.list.enableMultiSelect(contentItem);
};

myapp.VotingsView.SurveyQuestionsTemplate_postRender = function (element, contentItem) {
    $(element).parent("li").css("background", "#FF7585");
};

function SetBackgroundOfQuestion(question, color) {
    $("div:contains('" + question + "')").parent("li").css("background", color);;
}







myapp.VotingsView.SaveYes_execute = function (screen) {

    var list = screen.findContentItem("SurveyQuestions");
    var count = lsWire.list.selectedCount(list);
    var selected = lsWire.list.selected(list);
    var text = "Questions selected\n\n";
    _.forEach(selected, function (item) {
        text += item.Id + " - " + item.Question + "\n";
        SetBackgroundOfQuestion(item.Question, "#A3F4D2");

            var answer = new myapp.QuestionAnswer;
            answer.setSurveyQuestion(item);
            answer.Answer = 1;
            answer.Person = "akl";
            return myapp.activeDataWorkspace.ApplicationData.saveChanges().then(function () {
                screen.getSurvey(); //als refresh der Seite brauchbar ??!
            })

    });
    text += "\n\nCount = " + count;
    //window.alert(text);
    lsWire.list.selectAll(list, false);
    screen.findContentItem("SelectAll").value = false;
};


myapp.VotingsView.SaveMaybe_execute = function (screen) {

    var list = screen.findContentItem("SurveyQuestions");
    var count = lsWire.list.selectedCount(list);
    var selected = lsWire.list.selected(list);
    var text = "Questions selected\n\n";
    _.forEach(selected, function (item) {
        text += item.Id + " - " + item.Question + "\n";
        SetBackgroundOfQuestion(item.Question, "#F2C283");

        //ajax call - save maybe...
    });
    text += "\n\nCount = " + count;
    //window.alert(text);
    lsWire.list.selectAll(list, false);
    screen.findContentItem("SelectAll").value = false;
};


myapp.VotingsView.SaveNo_execute = function (screen) {
    var list = screen.findContentItem("SurveyQuestions");
    var count = lsWire.list.selectedCount(list);
    var selected = lsWire.list.selected(list);
    var text = "Questions selected\n\n";
    _.forEach(selected, function (item) {
        text += item.Id + " - " + item.Question + "\n";
        SetBackgroundOfQuestion(item.Question, "#FF7585");

        //ajax call - save no (delete entity)...
    });
    text += "\n\nCount = " + count;
    //window.alert(text);
    lsWire.list.selectAll(list, false);
    screen.findContentItem("SelectAll").value = false;
};






myapp.VotingsView.SelectAll_render = function (element, contentItem) {
    // Render a checkbox
    lsWire.checkbox.render(element, contentItem);

    // When the checkbox changes state, either select all or not
    contentItem.dataBind("screen.SelectAll", function (newValue) {
        if (newValue != undefined) {
            var list = contentItem.screen.findContentItem("SurveyQuestions");
            lsWire.list.selectAll(list, newValue);
        }
    });
};








myapp.VotingsView.Survey_render = function (element, contentItem) {
    // Write code here.

    $.getJSON('/api/SurveyInfo/1', function (data) {
        $.each(data, function (key, item) {
            alert(item.name);
        });
    });

};