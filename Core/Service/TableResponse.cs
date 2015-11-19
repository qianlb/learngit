using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using Core.Enum;
namespace Core
{
    [DataContract]
    public class TableResponse : Response
    {
        [DataMember]
        public int? TotalRecord { get; set; }
        [DataMember]
        public int? PageIndex { get; set; }
        [DataMember]
        public int? PageSize { get; set; }
        [DataMember]
        public OrderSeq? OrderSeq { get; set; }
        [DataMember]
        public string OrderBy { get; set; }
    }

    [DataContract]
    public class TableResponse<T> : TableResponse
    {
        public static TableResponse<T> Create(TableRequest tableRequest)
        {
            return new TableResponse<T>
            {
                OrderBy = tableRequest.OrderBy,
                OrderSeq = tableRequest.OrderSeq,
                PageSize = tableRequest.PageSize,
                PageIndex = tableRequest.PageIndex
            };
        }
        public static TableResponse<T> Create(TableRequest tableRequest, IEnumerable<T> t)
        {
            return new TableResponse<T>
            {
                OrderBy = tableRequest.OrderBy,
                OrderSeq = tableRequest.OrderSeq,
                PageSize = tableRequest.PageSize,
                PageIndex = tableRequest.PageIndex,
                Item = t.ToList()
            };
        }
        public static TableResponse<T> Create(TableRequest tableRequest, IEnumerable<T> t,int totalRecord)
        {
            return new TableResponse<T>
            {
                OrderBy = tableRequest.OrderBy,
                OrderSeq = tableRequest.OrderSeq,
                PageSize = tableRequest.PageSize,
                PageIndex = tableRequest.PageIndex,
                TotalRecord = totalRecord,
                Item = t.ToList()
            };
        }
        public static TableResponse<T> Create(TableResponse tableResponse, IEnumerable<T> t)
        {
            return new TableResponse<T>
            {
                OrderBy = tableResponse.OrderBy,
                OrderSeq = tableResponse.OrderSeq,
                PageSize = tableResponse.PageSize,
                PageIndex = tableResponse.PageIndex,
                TotalRecord = tableResponse.TotalRecord,
                Item = t.ToList()
            };
        }
        public static TableResponse<T> Load(TableRequest<T> request)
        {
            return new TableResponse<T>{PageSize = request.PageSize, PageIndex = request.PageIndex};
        }
        [DataMember]
        public virtual List<T> Item { get; set; }
    }
}
