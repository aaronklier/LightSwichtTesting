using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace LightSwitchApplication
{
    public class AnswersViewModel
    {
        public string PersonName;
        public List<QuestionAnswer> answers;
    }

    public class SurveyInfoController : ApiController
    {

        // GET api/<controller>/5
        public List<AnswersViewModel> Get(int id)
        {

            if (id == 0 || id < 1) return null;

            using (var context = ServerApplicationContext.CreateContext())
            {
                var questionList = context.DataWorkspace.ApplicationData.SurveyQuestions.GetQuery().Execute().Where(q => q.Survey.Id == id).ToList();

                var answersForSurvey = context.DataWorkspace.ApplicationData.QuestionAnswers.GetQuery().Execute().Where(s => s.SurveyQuestion.Survey.Id == id).ToList();

                var distinctPersons = (from p in answersForSurvey select p.Person).Distinct().ToList();

                var list = new List<AnswersViewModel>();
                foreach (var person in distinctPersons)
                {
                    var row = new AnswersViewModel();
                    row.PersonName = person;
                    row.answers = answersForSurvey.Where(a => a.Person == person).OrderBy(a => a.SurveyQuestion.Id).ToList(); 
                }

                return list;
            }

        }

        //GET api/<controller/<action>/id
        public List<int> GetAnswersByUser(int id)
        {
            if (id < 1) return null;

            using (var context = ServerApplicationContext.CreateContext())
            {
                var user = "akl"; //bei Sharepoint dann den Sharepoint-User mitgeben als Parameter?!
                var answers = context.DataWorkspace.ApplicationData.QuestionAnswers.GetQuery().Execute().Where(a => a.SurveyQuestion.Survey.Id == id && a.Person == user).ToList();
                var answerIds = (from a in answers select a.Id).ToList();
                return answerIds;
            }
        }

    }
}