using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core
{
    public class LanguagePriority: ILanguagePriority
    {
        //Current language
        public string Language;
        //Language priority
        protected List<string> Priority;

        public void InitLanguagePriority(string language, List<string> priority) 
        {
            this.Language = language;
            this.Priority = priority;
        }
    }
}
