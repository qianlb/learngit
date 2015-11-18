using System;
using System.Text;

namespace Core
{
    public static class BASE64
    {
        private static Encoding myEncoding = Encoding.GetEncoding("utf-8");

        public static string Serializable(string str) 
        {
            byte[] myByte = myEncoding.GetBytes(str);
            return Convert.ToBase64String(myByte);
        }

        public static string Deserialize(string str) 
        {
            byte[] myByte = Convert.FromBase64String(str);
            return myEncoding.GetString(myByte);
        }
    }
}
