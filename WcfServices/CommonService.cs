using BLL;
using Core;
using System;
using System.Collections.Generic;
using System.Configuration;

using System.Runtime.Serialization;
using System.ServiceModel;

using WcfServices.DataContracts;

namespace WcfServices
{
    // 注意: 使用“重构”菜单上的“重命名”命令，可以同时更改代码和配置文件中的类名“CommonService”。
    public class CommonService : ICommonService
    {
        public ISqlRepository SqlRepository
        {
            get
            {
                return new SqlRepository(ConfigurationManager.ConnectionStrings["gbinfosystem"].ToString());
            }
        }

        public void DoWork()
        {
        }
        public Response<List<KeyValuePair<string, int>>> GetFilterCount(Request<FilterSearch> request)
        {
            AccountBLL accountBl = new AccountBLL(SqlRepository);
            accountBl.InitLanguagePriority(request.Language, request.Priority);
            Response<List<KeyValuePair<string, int>>> response = new Response<List<KeyValuePair<string, int>>>();
            //response.Item = accountBl.DoWork(request.Item);
            response.IsSuccess = true;
            return response;
        }
    }
}
