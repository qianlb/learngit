using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace Common.Tools
{
    /// <summary>
    /// jailall.sun手机帮助类
    /// </summary>
    public class MobileHelper
    {
        public const string REG_MOBILE_KEYWORD = @"(iemobile|iphone|ipod|android|nokia|sonyericsson|blackberry|samsung|sec\-|windows ce|motorola|mot\-|up.b|midp\-)";

        //判段是否是手机访问
        public static bool IsMobile
        {
            get
            {
                var context = System.Web.HttpContext.Current;
                var RegexMobile = new Regex(REG_MOBILE_KEYWORD, RegexOptions.IgnoreCase | RegexOptions.Compiled);
                if (context != null)
                {
                    var request = context.Request;
                    if (request.Browser.IsMobileDevice)
                    {
                        return true;
                    }

                    if (!string.IsNullOrEmpty(request.UserAgent) && RegexMobile.IsMatch(request.UserAgent))
                    {
                        return true;
                    }
                }

                return false;
            }
        }
    }
}
