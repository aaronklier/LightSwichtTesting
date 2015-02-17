using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace LightSwitchApplication
{
    public class SurveyInfoController : ApiController
    {

        // GET api/<controller>/5
        public List<List<string>> Get(int id)
        {
            if (id == 0 || id < 1) return null;

            using (var context = ServerApplicationContext.CreateContext())
            {
                var allAnswersForSurvey = context.DataWorkspace.ApplicationData.QuestionAnswers.GetQuery().Execute().Where(s => s.SurveyQuestion.Survey.Id == id).ToList();
                var distinctPersons = (from p in allAnswersForSurvey select p.Person).Distinct().ToList();
                var votingList = new List<List<string>>();

                //header
                var header = new List<string>();
                header.Add("Nr.");
                header.Add("Person");
                header.AddRange(context.DataWorkspace.ApplicationData.SurveyQuestions.GetQuery().Execute().Where(q => q.Survey.Id == id).OrderBy(q => q.Id).Select(q => q.Question.ToString()).ToList());
                votingList.Add(header);
                //votings per Person
                var rowCounter = 1;
                foreach (var person in distinctPersons)
                {
                    var list = new List<string>();
                    //new TR (HTML)
                    list.Add(rowCounter.ToString());
                    list.Add(person);
                    var answers = allAnswersForSurvey.Where(a => a.Person == person).OrderBy(a => a.Id).Select(a => a.Answer).ToList();
                    foreach (var answer in answers)
                    {
                        list.Add(GetAnswer(answer));
                    }
                    votingList.Add(list);
                    rowCounter++;
                }

                return votingList;

            }
        }

        public string GetAnswer(int numberToConvert)
        {
            switch (numberToConvert)
            {
                case 1: return "Yes";
                case 2: return "Maybe";
                case 3: return "No";
                default: return "Error";
            };
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