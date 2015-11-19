using System.Collections.Generic;
using System.Runtime.Serialization;

namespace WcfServices.DataContracts
{
    [DataContract]
    [KnownType(typeof(KeywordExtendedFilterSearch))]
    public class FilterSearch
    {
        [DataMember]
        public string Keyword { get; set; }
        [DataMember]
        public string TargetFilter { get; set; }
        [DataMember]
        public List<KeyValuePair<string, List<string>>> Filters { get; set; }
        [DataMember]
        public string BooleanSearch { get; set; }
        [DataMember]
        public string language { get; set; }
    }

    [DataContract]
    public class KeywordExtendedFilterSearch : FilterSearch
    {
        [DataMember]
        public List<KeyValuePair<string, List<string>>> KeywordExtension { get; set; }
    }

    [DataContract]
    public class FilterSearch<T> : FilterSearch
    {
        [DataMember]
        public T Extra { get; set; }
    }
}
