using System;
using Core;
using BLL;
using System.ServiceModel;
using System.Configuration;
namespace WcfServices
{
    // 注意: 使用“重构”菜单上的“重命名”命令，可以同时更改代码和配置文件中的类名“AccountService”。
    public class AccountService : IAccountService
    {
        public ISqlRepository SqlRepository
        {
            get
            {
                return new SqlRepository(ConfigurationManager.ConnectionStrings["gbinfosystem"].ToString());
            }
        }

        public Response<string> DoWork(Request<string> request)
        {
            AccountBLL accountBl = new AccountBLL(SqlRepository);
            Response<string> response = new Response<string>();
            response.Item = accountBl.DoWork(request.Item);
            response.IsSuccess = true;
            return response;
        }
    }
}
