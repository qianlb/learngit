using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using System.IO;
using Aspose.Cells;
using System.Diagnostics;
using System.Reflection;
using System.Web;

namespace Common.Tools
{
    /// <summary>
    /// jailall.sun asposecell组件
    /// </summary>
    public class AsposeExcel
    {

        /// <summary>
        /// aspose.cell导出
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="data"></param>
        /// <param name="response"></param>
        public static void Export<T>(IEnumerable<T> data, HttpResponse response, string name)
        {
            Workbook workbook = new Workbook();
            Worksheet sheet = (Worksheet)workbook.Worksheets[0];
            sheet.Cells.SetColumnWidth(0, 30);
            sheet.Cells.SetColumnWidth(1, 30);
            sheet.Cells.SetColumnWidth(2, 30);
            PropertyInfo[] ps = typeof(T).GetProperties();
            var colIndex = "A";

            foreach (var p in ps)
            {
                var headCell = sheet.Cells[colIndex + 1];
                Style s = new Style();
                s.Font.IsBold = true;
                s.Font.Size = 12;
                headCell.SetStyle(s);
                headCell.PutValue(p.Name);
                int i = 2;
                foreach (var d in data)
                {
                    sheet.Cells[colIndex + i].PutValue(p.GetValue(d, null));
                    i++;
                }

                colIndex = ((char)(colIndex[0] + 1)).ToString();
            }

            response.Clear();
            response.Buffer = true;
            response.Charset = "utf-8";
            response.AppendHeader("Content-Disposition", "attachment;filename=" + name + ".xls");
            response.ContentEncoding = System.Text.Encoding.UTF8;
            response.ContentType = "application/ms-excel";
            response.BinaryWrite(workbook.SaveToStream().ToArray());
            response.End();
        }


        /// <summary>
        /// aspose.cell导出
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="data"></param>
        /// <param name="response"></param>
        public static void Export<T>(IEnumerable<T> data, HttpResponse response, string name, int[] colWidth)
        {
            Workbook workbook = new Workbook();
            Worksheet sheet = (Worksheet)workbook.Worksheets[0];
            for (int i = 0; i < colWidth.Length; i++)
            {
                sheet.Cells.SetColumnWidth(i, colWidth[i]);
            }

            PropertyInfo[] ps = typeof(T).GetProperties();
            var colIndex = "A";

            foreach (var p in ps)
            {
                var headCell = sheet.Cells[colIndex + 1];
                Style s = new Style();
                s.Font.IsBold = true;
                s.Font.Size = 12;
                headCell.SetStyle(s);
                headCell.PutValue(p.Name);
                int i = 2;
                foreach (var d in data)
                {
                    sheet.Cells[colIndex + i].PutValue(p.GetValue(d, null));
                    i++;
                }

                colIndex = ((char)(colIndex[0] + 1)).ToString();
            }

            response.Clear();
            response.Buffer = true;
            response.Charset = "utf-8";
            response.AppendHeader("Content-Disposition", "attachment;filename=" + HttpContext.Current.Server.UrlEncode(name) + ".xls");
            response.ContentEncoding = System.Text.Encoding.UTF8;
            response.ContentType = "application/ms-excel";
            response.BinaryWrite(workbook.SaveToStream().ToArray());
            response.End();
        }

        /// <summary>
        /// aspose.cell导入
        /// </summary>
        /// <param name="strFileName"></param>
        /// <returns></returns>
        public static System.Data.DataTable ReadExcel(String strFileName)
        {
            Workbook book = new Workbook();
            book.Open(strFileName);
            Worksheet sheet = book.Worksheets[0];
            Cells cells = sheet.Cells;
            return cells.ExportDataTableAsString(0, 0, cells.MaxDataRow + 1, cells.MaxDataColumn + 1, true);
        }
    }
}
