using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;

namespace Core
{
    public static class SqlRepositoryExtension
    {
        /// <summary>
        /// Void
        /// </summary>
        /// <param name="repository"></param>
        /// <param name="spName"></param>
        /// <param name="sqlParameter"></param>
        public static void ExecuteStoredProcedure(this ISqlRepository repository, string spName, SqlParameter[] sqlParameter) 
        {
            using (var conn = repository.Create())
            {
                SqlCommand command = new SqlCommand(spName, conn);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.Clear();
                command.Parameters.AddRange(sqlParameter);
                try
                {
                    Stopwatch sw = new Stopwatch();
                    sw.Start();
                    conn.Open();
                    sw.Stop();
                    var connOpen = sw.Elapsed.TotalSeconds;
                    sw.Restart();
                    command.ExecuteNonQuery();
                    sw.Stop();
                    //var execute = sw.Elapsed.TotalSeconds;
                    //Log.SqlServerPerformaceAnalysis(command, connOpen, execute);
                }
                finally
                {
                    conn.Close();
                }
            }
        }

        /// <summary>
        /// DataTable
        /// </summary>
        /// <param name="repository"></param>
        /// <param name="spName"></param>
        /// <param name="sqlParameter"></param>
        /// <param name="dt"></param>
        public static void ExecuteStoredProcedure(this ISqlRepository repository, string spName, SqlParameter[] sqlParameter, DataTable dt)
        {
            using (var conn = repository.Create())
            {
                SqlCommand command = new SqlCommand(spName, conn);
                command.CommandType = System.Data.CommandType.StoredProcedure;
                command.Parameters.Clear();
                command.Parameters.AddRange(sqlParameter);
                try
                {
                    Stopwatch sw = new Stopwatch();
                    sw.Start();

                    conn.Open();

                    sw.Stop();
                    var connOpen = sw.Elapsed.TotalSeconds;
                    sw.Restart();

                    SqlDataAdapter sqlDA = new SqlDataAdapter(command);
                    sqlDA.Fill(dt);

                    sw.Stop();
                    //var execute = sw.Elapsed.TotalSeconds;
                    //Log.SqlServerPerformaceAnalysis(command, connOpen, execute);
                }
                finally
                {
                    conn.Close();
                }
            }
        }

        /// <summary>
        /// DataTable Without Parameter
        /// </summary>
        /// <param name="repository"></param>
        /// <param name="spName"></param>
        /// <param name="dt"></param>
        public static void ExecuteStoredProcedure(this ISqlRepository repository, string spName, DataTable dt)
        {
            using (var conn = repository.Create())
            {
                SqlCommand command = new SqlCommand(spName, conn);
                command.CommandType = System.Data.CommandType.StoredProcedure;
                try
                {
                    Stopwatch sw = new Stopwatch();
                    sw.Start();

                    conn.Open();

                    sw.Stop();
                    var connOpen = sw.Elapsed.TotalSeconds;
                    sw.Restart();
                    
                    SqlDataAdapter sqlDA = new SqlDataAdapter(command);
                    sqlDA.Fill(dt);

                    sw.Stop();
                    //var execute = sw.Elapsed.TotalSeconds;
                    //Log.SqlServerPerformaceAnalysis(command, connOpen, execute);
                }
                finally
                {
                    conn.Close();
                }
            }
        }

        /// <summary>
        /// DataSet
        /// </summary>
        /// <param name="repository"></param>
        /// <param name="spName"></param>
        /// <param name="sqlParameter"></param>
        /// <param name="ds"></param>
        public static void ExecuteStoredProcedure(this ISqlRepository repository, string spName, SqlParameter[] sqlParameter, DataSet ds)
        {
            using (var conn = repository.Create())
            {
                SqlCommand command = new SqlCommand(spName, conn);
                command.CommandType = System.Data.CommandType.StoredProcedure;
                command.Parameters.Clear();
                command.Parameters.AddRange(sqlParameter);
                try
                {
                    Stopwatch sw = new Stopwatch();
                    sw.Start();

                    conn.Open();

                    sw.Stop();
                    var connOpen = sw.Elapsed.TotalSeconds;
                    sw.Restart();

                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(ds);

                    sw.Stop();
                    //var execute = sw.Elapsed.TotalSeconds;
                    //Log.SqlServerPerformaceAnalysis(command, connOpen, execute);
                }
                finally
                {
                    conn.Close();
                }
            }
        }

        /// <summary>
        /// DataSet Without Parameter
        /// </summary>
        /// <param name="repository"></param>
        /// <param name="spName"></param>
        /// <param name="sqlParameter"></param>
        /// <param name="ds"></param>
        public static void ExecuteStoredProcedure(this ISqlRepository repository, string spName, DataSet ds)
        {
            using (var conn = repository.Create())
            {
                SqlCommand command = new SqlCommand(spName, conn);
                command.CommandType = System.Data.CommandType.StoredProcedure;
                try
                {
                    Stopwatch sw = new Stopwatch();
                    sw.Start();

                    conn.Open();

                    sw.Stop();
                    var connOpen = sw.Elapsed.TotalSeconds;
                    sw.Restart();

                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(ds);

                    sw.Stop();
                    //var execute = sw.Elapsed.TotalSeconds;
                    //Log.SqlServerPerformaceAnalysis(command, connOpen, execute);
                }
                finally
                {
                    conn.Close();
                }
            }
        }
    }
}
