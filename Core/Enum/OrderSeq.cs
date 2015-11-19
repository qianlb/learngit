using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Runtime.Serialization;

namespace Core.Enum
{
    [DataContract]
    public enum OrderSeq
    {
        [EnumMember]
        ASC = 0,
        [EnumMember]
        DESC = 1
    }
}
