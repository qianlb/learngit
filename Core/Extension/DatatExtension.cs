using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Data.SqlClient;
using System.Web.Routing;
using System.Web;
using System.Web.Script.Serialization;
using System.Collections;
using System.Data;

/// <summary>
/// @Author：Peter
/// @Date：2014-12-04
/// @desc：通过扩展方法
/// </summary>
public static class DatatExtension
{
    #region ToSqlFilter sql过滤关键字
    /// <summary>
    /// sql过滤关键字   
    /// </summary>
    /// <param name="objWord"></param>
    /// <returns></returns>
    public static string ToSqlFilter(this object objWord)
    {
        if (objWord == null) return "";
        string typeName = objWord.GetType().Name;
        switch (typeName)
        {
            case "DateTime":
            case "guid":
                return objWord + "";
        }
        var str = objWord + "";
        str = str.Replace("'", "‘");
        str = str.Replace(";", "；");
        str = str.Replace(",", ",");
        str = str.Replace("?", "?");
        str = str.Replace("<", "＜");
        str = str.Replace(">", "＞");
        str = str.Replace("(", "(");
        str = str.Replace(")", ")");
        str = str.Replace("@", "＠");
        str = str.Replace("=", "＝");
        str = str.Replace("+", "＋");
        str = str.Replace("*", "＊");
        str = str.Replace("&", "＆");
        str = str.Replace("#", "＃");
        str = str.Replace("%", "％");
        str = str.Replace("$", "￥");
        return str;
    }

    /// <summary>
    /// sql过滤关键字   
    /// </summary>
    /// <param name="objWord"></param>
    /// <returns></returns>
    public static T ToSqlFilter<T>(this object objWord)
    {

        return objWord.PerfectConversion<T>();
    }
    #endregion

    #region ToPars 将匿名对象转成 SqlParameter[]
    /// <summary>
    /// 将匿名对象转成 SqlParameter[] 
    /// </summary>
    /// <param name="o">如 var o=new {id=1,name="张三"}</param>
    /// <returns>SqlParameter[]</returns>
    public static SqlParameter[] ToPars(this object o)
    {
        List<SqlParameter> pars = new List<SqlParameter>();
        RouteValueDictionary rvd = new RouteValueDictionary(o);
        foreach (var r in rvd)
        {
            SqlParameter par;
            if (r.Value == null)
            {
                par = new SqlParameter("@" + r.Key, DBNull.Value);
            }
            else
            {
                par = new SqlParameter("@" + r.Key, r.Value);
            }
            pars.Add(par);
        }
        return pars.ToArray();
    }

    #endregion

    #region ToJoinSqlInVal 将数组转为 '1','2' 这种格式的字符串 用于 where id in(  )
    /// <summary>
    /// 将数组转为 '1','2' 这种格式的字符串 用于 where id in(  )
    /// </summary>
    /// <param name="array"></param>
    /// <returns></returns>
    public static string ToJoinSqlInVal(this object[] array)
    {
        if (array == null || array.Length == 0)
        {
            return "";
        }
        else
        {
            return string.Join(",", array.Where(c => c != null).Select(c => "'" + c.ToSqlFilter() + "'"));//除止SQL注入
        }
    }

    /// <summary>
    /// 将数组转为 '1','2' 这种格式的字符串 用于 where id in(  )
    /// </summary>
    /// <param name="array"></param>
    /// <returns></returns>
    public static string ToJoinSqlInVal(this int[] array)
    {
        if (array == null || array.Length == 0)
        {
            return "";
        }
        else
        {
            return string.Join(",", array.Where(c => c != null).Select(c => "'" + c.ToSqlFilter() + "'"));//除止SQL注入
        }
    }

    /// <summary>
    /// 将数组转为 '1','2' 这种格式的字符串 用于 where id in(  )
    /// </summary>
    /// <param name="array"></param>
    /// <returns></returns>
    public static string ToJoinSqlInVal(this Guid[] array)
    {
        if (array == null || array.Length == 0)
        {
            return "";
        }
        else
        {
            return string.Join(",", array.Where(c => c != null).Select(c => "'" + c + "'"));//除止SQL注入
        }
    }
    #endregion

    #region 完美转换 可以将对象转成指定类型 如果为NULL则为默认值
    /// <summary>
    /// 完美转换 可以将对象转成指定类型 如果为NULL则为默认值
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="val"></param>
    /// <returns></returns>
    public static T PerfectConversion<T>(this object val)
    {
        Type typeInfos = typeof(T);
        object retNull = null;
        string ppTypeName = typeInfos.FullName;
        if (ppTypeName != null && ppTypeName.Contains("System."))
        {
            ppTypeName = ppTypeName.Replace("System.", "");
        }
        if (val != DBNull.Value && val != null)
        {
            if (ppTypeName == "Double")
            {
                val = Convert.ToDouble(val);
            }
            else if (ppTypeName.LastIndexOf("Int") != -1)
            {
                val = Convert.ToInt32(val);
            }
            else if (ppTypeName == "Decimal")
            {
                val = Convert.ToDecimal(val);
            }
            else if (ppTypeName == "Boolean")
            {
                val = Convert.ToBoolean(val);
            }
            else if (ppTypeName == "DateTime")
            {
                val = Convert.ToDateTime(val);
            }
            if (typeInfos.Name == "Nullable`1")
            {
                if (ppTypeName.LastIndexOf("Int") != -1)
                {
                    val = (int?)val;
                }
                else if (ppTypeName.LastIndexOf("DateTime") != -1)
                {
                    val = (DateTime?)val;
                }
                else if (ppTypeName.LastIndexOf("String") != -1)
                {
                    val = Convert.ToString(val);
                }
                else if (ppTypeName.LastIndexOf("Decimal") != -1)
                {
                    val = (Decimal?)val;
                }
            }
            return (T)val;
        }
        else
        {
            if (typeInfos.Name == "String")
            {
                retNull = string.Empty;
            }
            else if (typeInfos.Name == "Int32" || typeInfos.Name == "Int16" || typeInfos.Name == "Int64")
            {
                retNull = 0;
            }
            else if (typeInfos.Name == "Decimal")
            {
                retNull = Convert.ToDecimal(0);
            }
            else if (typeInfos.Name == "DateTime")
            {
                retNull = DateTime.MinValue;
            }
            else if (typeInfos.Name == "Boolean")
            {
                retNull = false;
            }
            else if (typeInfos.Name == "Double")
            {
                retNull = 0.00;
            }
            return (T)retNull;
        }

    }
    #endregion

    #region string 扩展方法
    /// <summary>
    /// 返回解码之后的字符串（+ 特殊处理 .net4 的小问题）
    /// http://blog.csdn.net/xingxing513234072/article/details/7865083
    /// </summary>
    /// <param name="o">字符串</param>
    /// <returns>转码后的值</returns>
    public static string ToDecode(this string o)
    {
        if (o != null)
        {
            o = o.Replace("+", "%2b");
            return HttpUtility.UrlDecode(o);
        }
        else
        {
            return null;
        }
    }
    /// <summary>
    /// 强转成string 如果失败返回 ""
    /// </summary>
    /// <param name="o"></param>
    /// <param name="i"></param>
    /// <returns></returns>
    public static string ToConvertString(this object o)
    {
        if (o != null) return o.ToString().Trim();
        return "";
    }
    /// <summary>
    /// 把字符串转换成GUID
    /// </summary>
    /// <param name="o">字符串</param>
    /// <returns>guid</returns>
    public static Guid ToGuid(this string o)
    {
        try
        {
            return new Guid(o);
        }
        catch (Exception)
        {
            return new Guid("00000000-0000-0000-0000-000000000000");
        }
    }
    /// <summary>
    /// 获取域账户的用户名
    /// </summary>
    /// <param name="domainName">域名</param>
    /// <returns>字符串</returns>
    public static string ToName(this string domainName)
    {
        string[] clientNames = domainName.Split('\\');
        if (clientNames.Length == 2)
        {
            return clientNames[1];
        }
        else
        {
            return domainName;
        }
    }

    /// <summary>
    /// 格式化时间
    /// </summary>
    /// <param name="o">字符串</param>
    /// <returns>时间</returns>
    public static DateTime ToDateTime(this string o)
    {
        DateTime reval = DateTime.Now;
        if (o != null && DateTime.TryParse(o.ToString(), out reval))
        {
            return reval;
        }
        else
        {
            return DateTime.Now;
        }
    }
    /// <summary>
    /// 返回带Null的字符串
    /// </summary>
    /// <param name="o">字符串</param>
    /// <returns>带Null的字符串</returns>
    public static string ToStringWithNull(this string o)
    {
        if (String.IsNullOrEmpty(o))
        {
            return "";
        }
        else
        {
            return o;
        }
    }
    #endregion

    #region 逻辑
    /// <summary>
    /// o==true 返回successVal否则返回errorVal
    /// </summary>
    /// <param name="o"></param>
    /// <param name="successVal"></param>
    /// <param name="errorVal"></param>
    /// <returns></returns>
    public static string IIF(this object o, string successVal, string errorVal)
    {
        return Convert.ToBoolean(o) ? successVal : errorVal;
    }

    /// <summary>
    /// o==true 返回successVal否则返回errorVal
    /// </summary>
    /// <param name="o"></param>
    /// <param name="successVal"></param>
    /// <param name="errorVal"></param>
    /// <returns></returns>
    public static string IIF(this object o, string successVal)
    {
        return Convert.ToBoolean(o) ? successVal : "";
    }

    /// <summary>
    /// o==true 执行success 否则执行 error
    /// </summary>
    /// <param name="o"></param>
    /// <param name="success"></param>
    /// <param name="error"></param>
    public static void IIF(this object o, Action<dynamic> success, Action<dynamic> error)
    {
        if (Convert.ToBoolean(o))
        {
            success(o);
        }
        else
        {
            error(error);
        }
    }
    /// <summary>
    /// 是否是null或""
    /// </summary>
    /// <param name="o">数据</param>
    /// <returns>true表示是null或者是""</returns>
    public static bool IsNE(this object o)
    {
        if (o == null) return true;
        return o.ToString() == "";
    }
    /// <summary>
    /// 是否不是null或""
    /// </summary>
    /// <returns>true表示不是</returns>
    public static bool IsntNE(this object o)
    {
        if (o == null) return false;
        return o.ToString() != "";
    }
    /// <summary>
    /// 是否是INT
    /// </summary>
    /// <param name="o">数据</param>
    /// <returns>true表示是Int</returns>
    public static bool IsInt(this object o)
    {
        if (o == null) return false;
        return Regex.IsMatch(o.ToString(), @"^\d+$");
    }
    /// <summary>
    /// Decimal数据类型验证
    /// </summary>
    /// <param name="data">验证数据</param>
    /// <returns>true表示装换成decimal类型成功</returns>
    public static bool DecimalFormatValidation(object data)
    {
        bool format = true;
        try
        {
            Convert.ToDecimal(data);
        }
        catch (Exception)
        {
            format = false;
        }
        return format;
    }

    /// <summary>
    /// 是否不是INT
    /// </summary>
    /// <param name="o">数据</param>
    /// <returns>true表示不是</returns>
    public static bool IsntInt(this object o)
    {
        if (o == null) return true;
        return !Regex.IsMatch(o.ToString(), @"^\d+$");
    }
    #endregion

    #region 将guidList字符串转换成List<Guid?>

    /// <summary>
    /// 将guidList字符串转换成List<Guid?>
    /// </summary>
    /// <param name="vguidList">字符串</param>
    /// <returns>list集合</returns>
    public static List<Guid?> ToGUIDList(string vguidList)
    {
        List<Guid?> list = new List<Guid?>();
        if (vguidList != null && vguidList.Length > 0)
        {
            string[] str = vguidList.Split(',');

            for (int i = 0; i < str.Length; i++)
            {
                list.Add(new Guid(str[i]));
            }
        }
        return list;
    }

    /// <summary>
    /// 将guidList字符串转换成List<Guid>
    /// </summary>
    /// <param name="vguidList">字符串</param>
    /// <returns>list集合，不为空</returns>
    public static List<Guid> ToGUIDListNotNull(string vguidList)
    {
        List<Guid> list = new List<Guid>();
        if (vguidList != null && vguidList.Length > 0)
        {
            string[] str = vguidList.Split(',');

            for (int i = 0; i < str.Length; i++)
            {
                list.Add(new Guid(str[i]));
            }
        }
        return list;
    }

    #endregion

    #region JSON 扩展
    /// <summary>
    /// 把JSon格式数据转换成LIst
    /// </summary>
    /// <typeparam name="T">类型</typeparam>
    /// <param name="jsonString">json</param>
    /// <returns>List</returns>
    public static List<T> JsonToList<T>(this string jsonString) where T : class
    {
        JavaScriptSerializer Serializer = new JavaScriptSerializer();
        List<T> objs = Serializer.Deserialize<List<T>>(jsonString);
        return objs;
    }
    /// <summary>
    /// 对象序列化
    /// </summary>
    /// <param name="obj">数据</param>
    /// <returns>json格式的字符串</returns>
    public static string ToJsonResult(this object obj)
    {
        JavaScriptSerializer jsSerializer = new JavaScriptSerializer();
        return jsSerializer.Serialize(obj);
    }
    /// <summary>
    /// 配合form插件实现数据转换
    /// </summary>
    /// <param name="obj">数据</param>
    /// <returns>json格式的字符串</returns>
    public static string ArrayListToJson(this ArrayList arryList)
    {
        string arryListJson = string.Empty;
        JavaScriptSerializer jsSerializer = new JavaScriptSerializer();
        arryListJson = jsSerializer.Serialize(arryList);
        return arryListJson.Substring(1, arryListJson.Length - 2);
    }
    /// <summary>
    /// Datatable 转 JSON
    /// </summary>
    /// <param name="dt">表</param>
    /// <returns>json格式的结果</returns>
    public static string DTToJson(this DataTable dt)
    {
        JavaScriptSerializer serializer = new JavaScriptSerializer();
        List<Dictionary<string, object>> list = new List<Dictionary<string, object>>();
        foreach (DataRow dr in dt.Rows)
        {
            Dictionary<string, object> result = new Dictionary<string, object>();
            foreach (DataColumn dc in dt.Columns)
            {
                result.Add(dc.ColumnName, dr[dc].ToString());
            }
            list.Add(result);
        }
        return serializer.Serialize(list);
    }


    #endregion


}

