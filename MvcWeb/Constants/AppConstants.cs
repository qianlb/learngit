using System.Configuration;

namespace MvcWeb.Constants
{
    public class AppConstants
    {
        public AppConstants()
        {
            //
            // TODO: Add constructor logic here
            //
        }

        public class Cookie
        {
            public const string SHARE_COOKIE = "SHARECOOKIE";
            public const string CULTURE = "culture";
            public const string USER_TERMS = "UserTerms";
        }

        public class UrlParams
        {
            //public const string TOKEN = "Token";
            public const string SHARE_TOKEN = "shareToken";
            //public const string REQUEST_ID = "RequestId";
            public const string RETURN_URL = "returnUrl";
            public const string ERROR_MSG = "ErrorMassage";
        }

        public class ConnectionStrings 
        {
            public const string SSO_SITE = "SSOSite";
            public const string Data_SITE = "DataSite";        
        }

        public class Session 
        {
            public const string USER_AUTHORITY = "UserAuthority";
            public const string USER_DATA_AUTHORITY = "UserDataAuthority";
            public const string AUTHORITY_DIC = "AuthorityDic";
            public const string AUTHORITY_LEFTBAR = "AuthorityLeftBar";
            public const string USER_TERMS = "UserTerms";
            public const string BUNDLES = "Bundles";
        }

        public static string ExportPath
        {
            get
            {
                return ConfigurationManager.AppSettings["ExportPath"];
            }
        }
    }
}