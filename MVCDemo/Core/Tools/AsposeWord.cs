using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Aspose.Words;

namespace Common.Tools
{

    public class ReplaceAndInsertImage : IReplacingCallback
    {
        /// <summary>
        /// 需要插入的图片路径
        /// </summary>
        public string url { get; set; }
        public int width { get; set; }
        public int height { get; set; }
        public ReplaceAndInsertImage(string url)
        {
            this.url = url;
        }
        public ReplaceAndInsertImage(string url, int width, int height)
        {
            this.url = url;
            this.width = width;
            this.height = height;
        }

        public ReplaceAction Replacing(ReplacingArgs e)
        {
            //获取当前节点
            var node = e.MatchNode;
            //获取当前文档
            Document doc = node.Document as Document;
            DocumentBuilder builder = new DocumentBuilder(doc);
            //将光标移动到指定节点
            builder.MoveTo(node);
            //插入图片
            builder.InsertImage(url);
            return ReplaceAction.Replace;
        }
        public ReplaceAction Replacing(ReplacingArgs e, int width, int height)
        {
            //获取当前节点
            var node = e.MatchNode;
            //获取当前文档
            Document doc = node.Document as Document;
            DocumentBuilder builder = new DocumentBuilder(doc);
            //将光标移动到指定节点
            builder.MoveTo(node);
            //插入图片
            builder.InsertImage(url, width, height);
            return ReplaceAction.Replace;
        }
    }
    public class ReplaceAndInsertHtml : IReplacingCallback
    {
        /// <summary>
        /// 需要插入的图片路径
        /// </summary>
        public string html { get; set; }
        public ReplaceAndInsertHtml(string html)
        {
            this.html = html;
        }
        public ReplaceAction Replacing(ReplacingArgs e)
        {
            //获取当前节点
            var node = e.MatchNode;
            //获取当前文档
            Document doc = node.Document as Document;
            DocumentBuilder builder = new DocumentBuilder(doc);
            //将光标移动到指定节点
            builder.MoveTo(node);
            //插入图片
            builder.InsertHtml(html);
            return ReplaceAction.Replace;
        }
    }
}
