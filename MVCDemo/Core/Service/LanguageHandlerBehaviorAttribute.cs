using System;
using System.Collections.ObjectModel;
using System.ServiceModel;
using System.ServiceModel.Channels;
using System.ServiceModel.Description;
using System.ServiceModel.Dispatcher;

namespace Core
{
    [AttributeUsage(AttributeTargets.Class)]
    public sealed class LanguageHandlerBehaviorAttribute : System.Attribute, IServiceBehavior //, IEndpointBehavior
    {
        //#region IEndpointBehavior Members

        //void IEndpointBehavior.AddBindingParameters(ServiceEndpoint endpoint, System.ServiceModel.Channels.BindingParameterCollection bindingParameters) { }

        //void IEndpointBehavior.ApplyClientBehavior(ServiceEndpoint endpoint, System.ServiceModel.Dispatcher.ClientRuntime clientRuntime) { }

        //void IEndpointBehavior.ApplyDispatchBehavior(ServiceEndpoint endpoint, System.ServiceModel.Dispatcher.EndpointDispatcher endpointDispatcher)
        //{
        //    ChannelDispatcher channelDispatcher = endpointDispatcher.ChannelDispatcher;
        //    if (channelDispatcher != null)
        //    {
        //        foreach (EndpointDispatcher ed in channelDispatcher.Endpoints)
        //        {
        //            LanguageMessageInspector inspector = new LanguageMessageInspector();
        //            ed.DispatchRuntime.MessageInspectors.Add(inspector);
        //        }
        //    }
        //}

        //void IEndpointBehavior.Validate(ServiceEndpoint endpoint) { }

        //#endregion

        #region IServiceBehavior Members

        void IServiceBehavior.AddBindingParameters(ServiceDescription serviceDescription, ServiceHostBase serviceHostBase, Collection<ServiceEndpoint> endpoints, BindingParameterCollection bindingParameters) { }

        void IServiceBehavior.ApplyDispatchBehavior(ServiceDescription desc, ServiceHostBase host)
        {
            foreach (ChannelDispatcher cDispatcher in host.ChannelDispatchers)
            {
                foreach (EndpointDispatcher eDispatcher in cDispatcher.Endpoints)
                {
                    eDispatcher.DispatchRuntime.MessageInspectors.Add(new LanguageMessageInspector());
                }
            }
        }

        void IServiceBehavior.Validate(ServiceDescription desc, ServiceHostBase host) { }

        #endregion
    }
}
