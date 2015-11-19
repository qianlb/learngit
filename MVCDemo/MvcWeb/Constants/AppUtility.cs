using Core;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Globalization;
using System.Web;

namespace MvcWeb.Constants
{
    public class AppUtility
    {
        public AppUtility() { }

        public static void SetCookie(string key, string value, DateTime expireTime)
        {
            HttpCookie myCookie = new HttpCookie(key);
            myCookie.Value = value;
            myCookie.Expires = expireTime;
            HttpCookie cookie = HttpContext.Current.Request.Cookies[key];
            if (cookie != null)
                HttpContext.Current.Response.Cookies.Set(myCookie);
            else
                HttpContext.Current.Response.Cookies.Add(myCookie);
        }

        /// <summary>
        /// Removes Cookie from the response
        /// </summary>
        /// <param name="Cookie"></param>
        public static void RemoveCookie(string key)
        {
            HttpContext.Current.Response.Cookies.Remove(key);
            HttpCookie myCookie = new HttpCookie(key);
            myCookie.Expires = DateTime.Now.AddDays(-1d);
            HttpContext.Current.Response.Cookies.Add(myCookie);
        }

        public static string GetCultureFromCookie()
        {
            string language = string.Empty;
            //switch (getCultureFromCookie())
            //{
            //    case Consts.Cultures.ZH_CN: language = Consts.Language.CN; break;
            //    case Consts.Cultures.PT_BR: language = Consts.Language.PT; break;
            //    case Consts.Cultures.ES: language = Consts.Language.SP; break;
            //    default: language = Consts.Language.EN;
            //        break;
            //}
            return language;
        }

        public static CultureInfo GetCultureInfoFromCookie { get { return new CultureInfo(getCultureFromCookie()); } }

        private static string getCultureFromCookie()
        {
            string culture;
            if (HttpContext.Current != null && HttpContext.Current.Request.Cookies[AppConstants.Cookie.CULTURE] != null)
                culture = HttpContext.Current.Request.Cookies[AppConstants.Cookie.CULTURE].Value;
            else
                culture = System.Threading.Thread.CurrentThread.CurrentUICulture.ToString();
            return culture;
        }

        public static Nullable<int> GetCurrentUserID()
        {
            CustomPrincipal User = HttpContext.Current.User as CustomPrincipal;
            if (User != null)
            {
                return User.Id;
            }
            return null;//no user;
        }

        public static string GetUserExportCount(string userId)
        {
            if (!string.IsNullOrWhiteSpace(userId))
            {
                string url = string.Format("{0}/api/Export?userId={1}&productId=1", ConfigurationManager.ConnectionStrings["AdminSite"], userId);
                var authority = HttpClientHolder.GetRequestForExport(url);
                var count = JsonConvert.DeserializeObject<string>(authority);
                return count;
            }
            else
            {
                return "";
            }
        }

        public static void InsertUserExportCount(string userId, string count)
        {
            string url = string.Format("{0}/api/Export?userId={1}&productId=1&count={2}", ConfigurationManager.ConnectionStrings["AdminSite"], userId, count);
            HttpClientHolder.GetRequestForExport(url);
        }

        //public static List<ResourcesEntity> GetUserAuthorityBySubResourceId(string subResourceId)
        //{
        //    string url = string.Format("{0}/api/Authority?subResourceId={1}", ConfigurationManager.ConnectionStrings["AdminSite"], subResourceId);
        //    var authority = HttpClientHolder.GetRequest(url);
        //    var result = JsonHelper.FromJson<List<ResourcesEntity>>(authority);
        //    return result;
        //}
    }
}