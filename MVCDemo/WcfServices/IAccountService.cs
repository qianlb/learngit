using System;
using System.Runtime.Serialization;
using System.ServiceModel;
using Core;

namespace WcfServices
{
    // 注意: 使用“重构”菜单上的“重命名”命令，可以同时更改代码和配置文件中的接口名“IAccountService”。
    [ServiceContract]
    public interface IAccountService
    {
        [OperationContract]
        Response<string> DoWork(Request<string> request);
    }
}
