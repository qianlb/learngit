using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Proxies.AccountService;
using Core;

namespace Proxies
{
    public class Class1
    {
        public AccountServiceClient client
        {
            get { return new AccountServiceClient(); }
        }
        public string getName(string userID)
        {
            Request<string> request = new Request<string>();
            request.Item = userID;
            var response = Utility.ClientHelper(client, proxy => proxy.DoWork(request));
            return response.Item;
        }
    }
}
