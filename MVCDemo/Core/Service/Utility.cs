using System;
using System.Linq.Expressions;
using System.ServiceModel;
using System.Threading.Tasks;

namespace Core
{
    public static class Utility
    {
        public static TRespone ClientHelper<TClient, TRespone>(TClient client, Expression<Func<TClient, TRespone>> expression)
            where TRespone : Response
            where TClient : ICommunicationObject
        {
            TRespone response;
            try
            {
                if (client.State != System.ServiceModel.CommunicationState.Opened)
                {
                    client.Open();
                }
                var originalDelegate = expression.Compile();

                response = originalDelegate.Invoke(client);

                if (!response.IsSuccess)
                {
                    throw new Exception("Response is not successful");
                }
                client.Close();
            }
            catch (FaultException<ExceptionDetail> e)
            {
                client.Abort();
                throw new Exception(string.Format("{0}-GUID:{1}",e.Message,e.Detail.Message));
            }
            catch (TimeoutException e) 
            {
                client.Abort();
                throw new Exception(e.Message);
            }
            return response;
        }

        public static async Task<TRespone> AsyncClientHelper<TClient, TRespone>(TClient client, Expression<Func<TClient, Task<TRespone>>> expression)
            where TRespone : Response
            where TClient : ICommunicationObject
        {
            TRespone response;
            try
            {
                client.Open();
                if (client.State != System.ServiceModel.CommunicationState.Opened)
                {
                    throw new Exception();
                }
                var originalDelegate = expression.Compile();
                response = await originalDelegate.Invoke(client);
                
                if (!response.IsSuccess)
                {
                    throw new Exception();
                }
                client.Close();
            }
            catch (FaultException<ExceptionDetail> e)
            {
                client.Abort();
                throw new Exception(e.Message);
            }
            catch (FaultException e)
            {
                client.Abort();
                throw new Exception(e.Message);
            }
            catch (TimeoutException e)
            {
                client.Abort();
                throw new Exception(e.Message);
            }
            return response;
        }
    }
}
