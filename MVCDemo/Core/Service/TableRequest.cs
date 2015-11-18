using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Runtime.Serialization;
using Core.Enum;

namespace Core
{
    [DataContract]
    public class TableRequest : Request
    {
        [DataMember]
        public OrderSeq? OrderSeq { get; set; }
        [DataMember]
        public string OrderBy { get; set; }
        [DataMember]
        public int? PageSize { get; set; }
        [DataMember]
        public int? PageIndex { get; set; }
    }
    [DataContract]
    public class TableRequest<T> : TableRequest
    {
        public static TableRequest<T> Create(TableRequest tableRequest,T t)
        {
            return new TableRequest<T>
            {
                OrderBy = tableRequest.OrderBy,
                OrderSeq = tableRequest.OrderSeq,
                PageSize = tableRequest.PageSize,
                PageIndex = tableRequest.PageIndex,
                Priority = tableRequest.Priority,
                Language = tableRequest.Language,
                Item = t
            };
        }
        [DataMember]
        public virtual T Item { get; set; }
    }
    [DataContract]
    public class TableRequest<T1,T2> : TableRequest
    {
        public static TableRequest<T1, T2> Create(TableRequest tableRequest, T1 t1,T2 t2)
        {
            return new TableRequest<T1, T2>
            {
                OrderBy = tableRequest.OrderBy,
                OrderSeq = tableRequest.OrderSeq,
                PageSize = tableRequest.PageSize,
                PageIndex = tableRequest.PageIndex,
                Priority = tableRequest.Priority,
                Language = tableRequest.Language,
                Item1 = t1,
                Item2 = t2
            };
        }
        [DataMember]
        public virtual T1 Item1 { get; set; }
        [DataMember]
        public virtual T2 Item2 { get; set; }
    }
    [DataContract]
    public class TableRequest<T1, T2, T3> : TableRequest
    {
        public static TableRequest<T1, T2,T3> Create(TableRequest tableRequest, T1 t1, T2 t2, T3 t3)
        {
            return new TableRequest<T1, T2,T3>
            {
                OrderBy = tableRequest.OrderBy,
                OrderSeq = tableRequest.OrderSeq,
                PageSize = tableRequest.PageSize,
                PageIndex = tableRequest.PageIndex,
                Priority = tableRequest.Priority,
                Language = tableRequest.Language,
                Item1 = t1,
                Item2 = t2,
                Item3 = t3
            };
        }
        [DataMember]
        public virtual T1 Item1 { get; set; }
        [DataMember]
        public virtual T2 Item2 { get; set; }
        [DataMember]
        public virtual T3 Item3 { get; set; }
    }
}
