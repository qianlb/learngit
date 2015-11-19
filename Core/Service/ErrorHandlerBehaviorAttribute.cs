
using System;
using System.Collections.ObjectModel;
using System.Net;
using System.ServiceModel;
using System.ServiceModel.Channels;
using System.ServiceModel.Description;
using System.ServiceModel.Dispatcher;
using System.Threading.Tasks;

namespace Core
{
    [AttributeUsage(AttributeTargets.Class)]
    public sealed class ErrorHandlerBehaviorAttribute : System.Attribute, IServiceBehavior, IErrorHandler
    {
        protected Type ServiceType { get; set; }
        protected Guid ErrorGuid { get; set; }
        public string EmailList { get; set; }

        public ErrorHandlerBehaviorAttribute()
        {
            this.EmailList = "kaisheng.xu@generalbiologic.com;aaron.wang@generalbiologic.com;";
        }

        void IServiceBehavior.ApplyDispatchBehavior(ServiceDescription description, ServiceHostBase host)
        {
            ServiceType = description.ServiceType;
            foreach (ChannelDispatcher dispatcher in host.ChannelDispatchers)
            {
                dispatcher.ErrorHandlers.Add(this);
            }
        }
        bool IErrorHandler.HandleError(Exception error)
        {
            //log
            new Task(() =>
            {
#if !DEBUG
                LoggerHelper.WriteErrorLog(this.ErrorGuid.ToString(), error);
                EmailHelper.Send(new GBI.EP.Email.EmailService.EmailMessage() 
                { 
                    From = "GBI Service", 
                    FromDisplay = "EP2.0 SOURCE", 
                    ToList = this.EmailList,
                    Subject = string.Format("EP2.0 ERROR LOG FROM {0} {1}", GetPublishAddress(), this.ErrorGuid.ToString()), 
                    Body = error.ToString() 
                });
#endif
            }).Start();
            return false;
        }
        void IErrorHandler.ProvideFault(Exception error, MessageVersion version, ref Message fault)
        {
            this.ErrorGuid = Guid.NewGuid();
            FaultException<ExceptionDetail> faultException = new FaultException<ExceptionDetail>(new ExceptionDetail(error) { Message = this.ErrorGuid.ToString() }, new FaultReason("ServiceError"));
            MessageFault messageFault = faultException.CreateMessageFault();
            fault = Message.CreateMessage(version, messageFault, faultException.Action);
        }
        void IServiceBehavior.Validate(ServiceDescription serviceDescription, ServiceHostBase serviceHostBase)
        { }
        void IServiceBehavior.AddBindingParameters(ServiceDescription serviceDescription, ServiceHostBase serviceHostBase, Collection<ServiceEndpoint> endpoints, BindingParameterCollection bindingParameters)
        { }

        /// <summary>
        /// Get Publish Address for error log
        /// </summary>
        /// <returns>host name</returns>
        private string GetPublishAddress()
        {
            return Dns.GetHostEntry(Dns.GetHostName()).HostName;
        }
    }
}
