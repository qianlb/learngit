using System.Runtime.Serialization;

namespace Core
{
    #region Response

    [DataContract]
    public class Response
    {
        [DataMember]
        public bool IsSuccess { get; set; }
        [DataMember]
        public string MessageKey { get; set; }
        [DataMember]
        public string[] MessageArgs { get; set; }
    }

    [DataContract]
    public class Response<T> : Response
    {
        [DataMember]
        public virtual T Item { get; set; }
    }

    #endregion
}
