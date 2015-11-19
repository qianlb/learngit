using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core;

namespace BLL
{
    public class AccountBLL:LanguagePriority
    {
        protected ISqlRepository SqlRepository;

        public AccountBLL(ISqlRepository sqlRepository)
        {
            this.SqlRepository = sqlRepository;
        }
        public string DoWork(string name)
        {
            return "Hello world" + name;
        }
    }
}
