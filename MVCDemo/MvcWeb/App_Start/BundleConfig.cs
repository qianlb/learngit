using System;
using System.Web.Optimization;

namespace MvcWeb.App_Start
{
    public class BundleConfig
    {
        public static void RegisterBundle(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/layout").Include(
                "~/Content/js/libs/jquery-1.8.3.min.js",
                "~/Content/js/libs/jquery-ui.js",
                "~/Content/js/libs/jquery-ui-1.10.3.custom.min.js",
                "~/Content/js/libs/ie8-eventlistener.js",
                "~/Content/js/libs/jquery.unobtrusive-ajax.js",
                "~/Content/js/libs/modernizr-2.6.2.js",
                "~/Content/js/libs/bootstrap.js",
                "~/Content/js/libs/application.js",
                "~/Content/js/libs/flatui-checkbox.js",
                "~/Content/js/libs/html5shiv.js",
                "~/Content/js/libs/respond.js",
                "~/Content/js/libs/jquery.placeholder.js",
                "~/Content/js/libs/jquery.ui.touch-punch.js",
                "~/Content/js/libs/layout-sidebar.js",
                "~/Content/js/libs/main-gsap.js",
                "~/Content/js/libs/resizeable.js",
                "~/Content/js/libs/leftSliderScroll.js",
                "~/Content/js/libs/perfect-scrollbar.jquery.js",
                "~/Content/js/libs/app.js",
                "~/Content/js/libs/jquery.scrollTo.js",
                "~/Content/js/libs/jquery.slimscroll.min.js",
                "~/Content/js/libs/moment-2.2.1.js",
                "~/Content/js/Layout.js"
                ));
        }
    }
}