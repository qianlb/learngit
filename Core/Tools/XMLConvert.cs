using System.IO;
using System.Runtime.Serialization;
using System.Text;
using System.Xml.Linq;

namespace Core
{
    public static class XMLConvert
    {
        public static string SerializeObject<T>(T obj)
        {
            XDocument doc = new XDocument();
            using (var writer = doc.CreateWriter())
            {
                var serializer = new DataContractSerializer(typeof(T));
                serializer.WriteObject(writer, obj);
            }
            return doc.ToString();
        }
        public static T DeserializeObject<T>(string xml) where T : class
        {
            T result = null;
            using (MemoryStream input = new MemoryStream(Encoding.UTF8.GetBytes(xml)))
            {
                DataContractSerializer serializer = new DataContractSerializer(typeof(T));
                result = serializer.ReadObject(input) as T;
            }
            return result;
        }
    }
}
