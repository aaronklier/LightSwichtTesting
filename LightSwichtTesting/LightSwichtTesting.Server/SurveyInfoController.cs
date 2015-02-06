using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace LightSwitchApplication
{
    public class VotingsViewModel
    {
        public string name;
    }


    public class SurveyInfoController : ApiController
    {
        // GET api/<controller>/5
        public List<VotingsViewModel> Get(int id)
        {
            var x = new VotingsViewModel();
            x.name = "albert";
            var list = new List<VotingsViewModel>();
            list.Add(x);
            return list;
        }
    }
}