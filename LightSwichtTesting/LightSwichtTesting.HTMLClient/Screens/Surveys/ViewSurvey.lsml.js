/// <reference path="~/GeneratedArtifacts/viewModel.js" />

myapp.ViewSurvey.Details_postRender = function (element, contentItem) {
    // Write code here.
    var name = contentItem.screen.Survey.details.getModel()[':@SummaryProperty'].property.name;
    contentItem.dataBind("screen.Survey." + name, function (value) {
        contentItem.screen.details.displayName = value;
    });
}

