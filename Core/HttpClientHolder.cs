using System;
using System.IO;
using System.Net;
using System.Text;
using System.Threading;

namespace Core
{
    public class RequestState
    {
        // This class stores the State of the request.
        const int BUFFER_SIZE = 1024;
        public StringBuilder requestData;
        public byte[] BufferRead;
        public HttpWebRequest request;
        public HttpWebResponse response;
        public Stream streamResponse;
        public RequestState()
        {
            BufferRead = new byte[BUFFER_SIZE];
            requestData = new StringBuilder("");
            request = null;
            streamResponse = null;
        }
    }

    public static class HttpClientHolder
    {
        #region HttpWebRequest
        public static ManualResetEvent AllDone = new ManualResetEvent(false);
        const int DefaultTimeout = 2 * 60 * 1000; // 2 minutes timeout
        const int BUFFER_SIZE = 1024;

        // Abort the request if the timer fires.
        private static void TimeoutCallback(object state, bool timedOut)
        {
            if (timedOut)
            {
                HttpWebRequest request = state as HttpWebRequest;
                if (request != null)
                {
                    request.Abort();
                }
            }
        }

        /// <summary>
        /// HttpWebRequest Get
        /// </summary>
        /// <param name="url"></param>
        /// <returns></returns>
        public static string Get(string url)
        {
            try
            {
                HttpWebRequest myHttpWebRequest = (HttpWebRequest)WebRequest.Create(url);
                myHttpWebRequest.Method = "GET";

                // Create an instance of the RequestState and assign the previous myHttpWebRequest
                // object to its request field.
                var myRequestState = new RequestState {request = myHttpWebRequest};

                // Start the asynchronous request.
                IAsyncResult result = (IAsyncResult)myHttpWebRequest.BeginGetResponse(new AsyncCallback(RespCallback), myRequestState);

                // this line implements the timeout, if there is a timeout, the callback fires and the request becomes aborted
                ThreadPool.RegisterWaitForSingleObject(result.AsyncWaitHandle, new WaitOrTimerCallback(TimeoutCallback), myHttpWebRequest, DefaultTimeout, true);

                // The response came in the allowed time. The work processing will happen in the 
                // callback function.
                AllDone.WaitOne();

                // Release the HttpWebResponse resource.
                if (myRequestState.response != null)
                {
                    myRequestState.response.Close();
                }
                return myRequestState.requestData.ToString();
            }
            catch (Exception e)
            {
                LoggerHelper.WriteErrorLog("HttpWebRequest Exception", e);
            }
            return string.Empty;
        }

        private static void RespCallback(IAsyncResult asynchronousResult)
        {
            try
            {
                // State of request is asynchronous.
                RequestState myRequestState = (RequestState)asynchronousResult.AsyncState;
                HttpWebRequest myHttpWebRequest = myRequestState.request;
                myRequestState.response = (HttpWebResponse)myHttpWebRequest.EndGetResponse(asynchronousResult);

                // Read the response into a Stream object.
                Stream responseStream = myRequestState.response.GetResponseStream();
                myRequestState.streamResponse = responseStream;

                // Begin the Reading of the contents of the HTML page and print it to the console.
                if (responseStream != null)
                {
                    IAsyncResult asynchronousInputRead = responseStream.BeginRead(myRequestState.BufferRead, 0, BUFFER_SIZE, new AsyncCallback(ReadCallBack), myRequestState);
                }
                return;
            }
            catch (WebException e)
            {
                LoggerHelper.WriteErrorLog("RespCallback Exception raised!", e);
            }
            AllDone.Set();
        }

        private static void ReadCallBack(IAsyncResult asyncResult)
        {
            try
            {
                RequestState myRequestState = (RequestState)asyncResult.AsyncState;
                Stream responseStream = myRequestState.streamResponse;
                int read = responseStream.EndRead(asyncResult);
                // Read the HTML page and then print it to the console.
                if (read > 0)
                {
                    myRequestState.requestData.Append(Encoding.ASCII.GetString(myRequestState.BufferRead, 0, read));
                    IAsyncResult asynchronousResult = responseStream.BeginRead(myRequestState.BufferRead, 0, BUFFER_SIZE, new AsyncCallback(ReadCallBack), myRequestState);
                    return;
                }
                responseStream.Close();
            }
            catch (WebException e)
            {
                LoggerHelper.WriteErrorLog("ReadCallBack Exception raised!", e);
            }
            AllDone.Set();
        }
        #endregion

        #region WebClient
        public static string GetRequest(string url)
        {
            try
            {
                WebClient client = new WebClient();
                client.Headers.Add("Content-Type", "application/json");
                Stream stream = client.OpenRead(url);
                //var length = stream.Length;
                StreamReader reader = new StreamReader(stream);
                return reader.ReadToEnd();
            }
            catch (WebException ex)
            {
                if (ex.Response != null)
                {
                    switch (((System.Net.HttpWebResponse)(ex.Response)).StatusCode)
                    {
                        case HttpStatusCode.Unauthorized:
                            throw new UnauthorizedAccessException("UnauthorizedAccess", ex);
                        default:
                            throw;
                    }
                }
                else
                {
                    throw;
                }
            }
        }

        public static string GetRequestForExport(string url)
        {
            try
            {
                WebClient client = new WebClient();
                client.Headers.Add("Content-Type", "application/json");
                Stream stream = client.OpenRead(url);
                //var length = stream.Length;
                StreamReader reader = new StreamReader(stream);
                return reader.ReadToEnd();
            }
            catch (WebException)
            {
                return "0";
            }
        }

        public static void GetPost(string url, string postData)
        {
            try
            {
                WebClient client = new WebClient();
                byte[] sendData = Encoding.GetEncoding("utf-8").GetBytes(postData);
                client.Headers.Add("Content-Type", "application/x-www-form-urlencoded");
                client.Headers.Add("ContentLength", sendData.Length.ToString());
                byte[] recData = client.UploadData(url, "POST", sendData);
            }
            catch (WebException)
            {
                throw;
            }
        }
        #endregion
    }
}
