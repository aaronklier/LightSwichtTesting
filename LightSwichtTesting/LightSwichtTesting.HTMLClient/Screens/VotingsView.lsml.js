/// <reference path="~/GeneratedArtifacts/viewModel.js" />
/// <reference path="../scripts/lswires.js" />

myapp.VotingsView.SurveyQuestions_postRender = function (element, contentItem) {
    
    lsWire.list.enableMultiSelect(contentItem);

};

function SetBackgroundYes(question) {
    $("div:contains('" + question + "')").parent("li").css("background", "#A3F4D2");;
}
function SetBackgroundMaybe(question) {
    $("div:contains('" + question + "')").parent("li").css("background", "#F2C283");;
}
function SetBackgroundNo(question) {
    $("div:contains('" + question + "')").parent("li").css("background", "#FF7585");;
}

myapp.VotingsView.SaveYes_execute = function (screen) {
 
    var list = screen.findContentItem("SurveyQuestions");
    var count = lsWire.list.selectedCount(list);
    var selected = lsWire.list.selected(list);
    var text = "Questions selected\n\n";
    _.forEach(selected, function (item) {
        text += item.Id + " - " + item.Question + "\n";
        SetBackgroundYes(item.Question);

        //ajax call - save yes...
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
        SetBackgroundMaybe(item.Question);

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
        SetBackgroundNo(item.Question);

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

myapp.VotingsView.SurveyQuestionsTemplate_postRender = function (element, contentItem) {

    $(element).parent("li").css("background", "#FF7585");

};

