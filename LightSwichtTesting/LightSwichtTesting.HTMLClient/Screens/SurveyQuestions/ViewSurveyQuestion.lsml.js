﻿/// <reference path="~/GeneratedArtifacts/viewModel.js" />

myapp.ViewSurveyQuestion.Details_postRender = function (element, contentItem) {
    // Write code here.
    var name = contentItem.screen.SurveyQuestion.details.getModel()[':@SummaryProperty'].property.name;
    contentItem.dataBind("screen.SurveyQuestion." + name, function (value) {
        contentItem.screen.details.displayName = value;
    });
}

