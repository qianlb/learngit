
using Core;
using System.Data;
using System.Data.SqlClient;
using System.Runtime.Serialization;

namespace Core.Enum
{
    [DataContract]
    public enum CodeDescription
    {
        [EnumMember]
        Code,
        [EnumMember]
        Description
    }
}
