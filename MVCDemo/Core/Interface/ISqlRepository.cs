using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core
{
    public interface ISqlRepository
    {
        /// <summary>
        /// Create connection
        /// </summary>
        /// <returns></returns>
        SqlConnection Create();

       
    }
}
