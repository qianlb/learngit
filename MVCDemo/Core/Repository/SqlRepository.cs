using System.Data.SqlClient;

namespace Core
{
    public class SqlRepository : ISqlRepository
    {
        #region variable
        //connection string
        private string connectionString;

        #endregion

        #region Public Method

        /// <summary>
        /// constructor
        /// </summary>
        /// <param name="connectionString"></param>
        public SqlRepository(string connectionString)
        {
            this.connectionString = connectionString;
        }


        /// <summary>
        /// create the connection
        /// </summary>
        /// <returns></returns>
        public SqlConnection Create()
        {
            return new SqlConnection(connectionString);
        }

        #endregion
    }
}
