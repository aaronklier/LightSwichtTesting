using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.LightSwitch;
using Microsoft.LightSwitch.Security.Server;
namespace LightSwitchApplication
{
    public partial class ApplicationDataService
    {
        partial void SurveyQuestions_Validate(SurveyQuestion entity, EntitySetValidationResultsBuilder results)
        {
            var surveyId = entity.Survey.Id;
            var question = SurveyQuestions.Where(q => q.Survey.Id == surveyId && q.Question == entity.Question).FirstOrDefault();
            if (question != null)
            {
                results.AddEntityError("Question already exists for this survey!");
            }

        }
    }
}
