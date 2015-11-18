using System.Collections.Generic;
using System.Runtime.Serialization;

namespace Core

{
    #region Request

    [DataContract]
    public class Request
    {
        [DataMember]
        public string Language { get; set; }
        [DataMember]
        public List<string> Priority { get; set; }
    }
    [DataContract]
    public class Request<T> : Request
    {
        [DataMember]
        public virtual T Item { get; set; }
    }
    #endregion
}
