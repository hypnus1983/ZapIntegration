using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TemplateTool
{
    public class TemplateInfo
    {
        public int Id { get; set; }
        public string Summary { get; set; }
        public string AppName { get; set; }
        public string AppIcon { get; set; }
        public string Link { get; set; }
        public bool IfShownByDefault { get; set; }
        public int SortOrder { get; set; }
    }
}
