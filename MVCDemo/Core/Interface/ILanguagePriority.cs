using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core
{
    public interface ILanguagePriority
    {
        /// <summary>
        /// Init Language and Priority
        /// </summary>
        /// <param name="language"></param>
        /// <param name="priority"></param>
        void InitLanguagePriority(string language, List<string> priority);
    }
}
