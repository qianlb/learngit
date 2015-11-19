using System.Configuration;

namespace Core
{
    public class LoggerHelper : LogFile<LoggerHelper>
    {
        public LoggerHelper()
        {
            LogDir = ConfigurationManager.AppSettings["LogDirectory"];
        }
    }
}
