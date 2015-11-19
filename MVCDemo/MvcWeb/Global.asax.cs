using MvcWeb.App_Start;
using MvcWeb.Constants;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using System.Web.Script.Serialization;
using System.Web.Security;

namespace MvcWeb
{
    // 注意: 有关启用 IIS6 或 IIS7 经典模式的说明，
    // 请访问 http://go.microsoft.com/?LinkId=9394801
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundle(BundleTable.Bundles);
        }
        protected void Application_PostAuthenticateRequest(Object sender, EventArgs e)
        {
            //var authCookie = Request.Cookies[FormsAuthentication.FormsCookieName];

            //if (authCookie == null) return;
            //FormsAuthenticationTicket authTicket = FormsAuthentication.Decrypt(authCookie.Value);
            //JavaScriptSerializer serializer = new JavaScriptSerializer();
            //if (authTicket == null) return;
            //CustomPrincipalSerializeModel serializeModel = serializer.Deserialize<CustomPrincipalSerializeModel>(authTicket.UserData);
            //CustomPrincipal newUser = new CustomPrincipal(authTicket.Name)
            //{
            //    Id = serializeModel.Id,
            //    UserName = serializeModel.UserName,
            //    Email = serializeModel.Email,
            //    Company = serializeModel.Company,
            //    Department = serializeModel.Department,
            //    FreeLayer = serializeModel.FreeLayer,
            //    AgreedUserTerms = serializeModel.AgreedUserTerms
            //};

            //HttpContext.Current.User = newUser;
        }

        protected void Application_EndRequest()
        {
            //var context = new HttpContextWrapper(Context);

            //// If we're an ajax request and forms authentication caused a 302, 
            //// then we actually need to do a 401
            //if (!FormsAuthentication.IsEnabled || context.Response.StatusCode != (int)HttpStatusCode.Found ||
            //    !context.Request.IsAjaxRequest()) return;
            //context.Response.Clear();
            //context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
        }
        protected void Application_Error(object sender, EventArgs e)
        {
            //var context = new HttpContextWrapper(Context);
            //Exception ex = Server.GetLastError();
            //var exception = ex as HttpException;
            //if (exception != null && !context.Request.IsAjaxRequest() && exception.GetHttpCode() == (int)HttpStatusCode.NotFound)
            //{
            //    Response.Redirect("/Home/Error404");
            //}
        }
        protected void Application_BeginRequest()
        {
            //if (!Convert.ToBoolean(ConfigurationManager.AppSettings["Maintenance"])) return;
            //Context.Response.WriteFile(HttpContext.Current.Server.MapPath("/Views/Shared/Maintenance.html"));
            //Context.Response.End();
        }
    }
}