using System.Security.Principal;

namespace MvcWeb.Constants
{
    interface ICustomPrincipal
    {
        int Id { get; set; }
        string UserName { get; set; }
        string Email { get; set; }
        string Company { get; set; }
        string Department { get; set; }
        bool FreeLayer { get; set; }
        bool AgreedUserTerms { get; set; } //Free Layer User Terms
    }
    public class CustomPrincipal : ICustomPrincipal, IPrincipal
    {
        public IIdentity Identity { get; private set; }
        public bool IsInRole(string role) { return false; }

        public CustomPrincipal(string email)
        {
            Identity = new GenericIdentity(email);
        }

        public int Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Company { get; set; }
        public string Department { get; set; }
        public bool FreeLayer { get; set; }
        public bool AgreedUserTerms { get; set; }
    }
    public class CustomPrincipalSerializeModel : ICustomPrincipal
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Company { get; set; }
        public string Department { get; set; }
        public bool FreeLayer { get; set; }
        public bool AgreedUserTerms { get; set; }
    }
}