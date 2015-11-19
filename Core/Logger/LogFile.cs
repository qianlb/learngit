using System;
using System.Text;

namespace Core
{
    public class LogFile<T>
    {
        public enum LogType
        {
            AppLog = 0,
            Error = 1,
        }

        static object _LockObj = new object();
        static object _LockErrorObj = new object();
        static object _LockAppObj = new object();

        static LogFile<T> _LogFile = null;

        string _LogDir;

        protected string LogDir
        {
            get
            {
                if (string.IsNullOrEmpty(_LogDir))
                {
                    _LogDir = Path.AppendDivision(Path.ProcessDirectory, '\\');
                }

                return _LogDir;
            }

            set
            {
                _LogDir = value;

                try
                {
                    if (!System.IO.Directory.Exists(_LogDir))
                    {
                        System.IO.Directory.CreateDirectory(_LogDir);
                    }
                }
                catch
                {
                    _LogDir = Path.AppendDivision(Path.ProcessDirectory, '\\');
                }
            }
        }

        protected void WriteLog(LogType logType, string message)
        {
            try
            {
                string file = LogDir + DateTime.Now.ToString("yyyy-MM-dd") + "_" +
                       logType.ToString() + ".log";

                StringBuilder line = new StringBuilder();
                line.AppendFormat("LogTime:{0}.{1}\r\n", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"), DateTime.Now.Millisecond);
                line.AppendFormat("Process:{0}\r\n", System.Diagnostics.Process.GetCurrentProcess().ProcessName);
                line.AppendFormat("Message:{0}\r\n", message);
                File.WriteLine(file, line.ToString());
            }
            catch
            {
            }
        }

        public static void WriteErrorLog(string message, Exception e)
        {
            WriteErrorLog(string.Format("ErrMsg:{0}\r\nException:{1}\r\nMessage:{2}\r\nStack:{3}",
                message, e.GetType().ToString(), e.Message, e.StackTrace));
        }

        public static void WriteErrorLog(string message)
        {
            lock (_LockObj)
            {
                if (_LogFile == null)
                {
                    _LogFile = (LogFile<T>)Instance.CreateInstance(typeof(T));
                }
            }

            lock (_LockErrorObj)
            {
                _LogFile.WriteLog(LogType.Error, message);
            }
        }

        public static void WriteAppLog(string message)
        {
            WriteAppLog(message, true);
        }

        public static void WriteAppLog(string message, bool enabled)
        {
            if (!enabled)
            {
                return;
            }

            lock (_LockObj)
            {
                if (_LogFile == null)
                {
                    _LogFile = (LogFile<T>)Instance.CreateInstance(typeof(T));
                }
            }

            lock (_LockAppObj)
            {
                _LogFile.WriteLog(LogType.AppLog, message);
            }
        }
    }
}
