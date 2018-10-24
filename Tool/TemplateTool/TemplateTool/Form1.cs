using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using Newtonsoft.Json;
using System.Threading;
using System.Net;
using System.Diagnostics;
using System.IO;
using System.Text.RegularExpressions;

namespace TemplateTool
{
    public partial class Form1 : Form
    {
        List<TemplateInfo> _list = new List<TemplateInfo>();
        Dictionary<string, string> _logodic = new Dictionary<string, string>();
        const string History = "history";

        public Form1()
        {
            InitializeComponent();
            richTextBox1.MaxLength = int.MaxValue;
        }

        protected override void OnShown(EventArgs e)
        {
            base.OnShown(e);
            this.Enabled = false;

            try
            {
                var data = Encoding.ASCII.GetBytes("{\n\t\"query\": \"query zapTemplates($status: String, $ids: [String], $addedById: String, $limit: Int, $offset: Int) {  zapTemplates(status: $status, ids: $ids, addedById: $addedById, limit: $limit, offset: $offset) {    id    descriptionHtml    title    slug    url    status    steps    ...zapTemplateServices    templateRootNodeId    __typename  }}fragment serviceInfo on Service {  id  key: id  name  slug  __typename}fragment zapTemplateServices on ZapTemplate {  headService {    ...serviceInfo    __typename  }  tailService {    ...serviceInfo    __typename  }  __typename}\",\n\t\"variables\": {\n\t\t\"addedById\": 3763044,\n\t\t\"limit\": 300\n\t},\n\t\"operationName\": \"zapTemplates\"\n}");
                HttpWebRequest req = (HttpWebRequest)HttpWebRequest.Create("https://zapier.com/api/graphql");
                req.Method = "POST";
                req.ContentType = "application/json";
                req.ContentLength = data.Length;
                req.Timeout = 3 * 60 * 1000;
                req.ReadWriteTimeout = 3 * 60 * 1000;
                using (Stream reqStream = req.GetRequestStream())
                {
                    reqStream.Write(data, 0, data.Length);
                }
                using (var response = req.GetResponse().GetResponseStream())
                {
                    using (var reader = new StreamReader(response, Encoding.UTF8))
                    {
                        richTextBox1.Text = reader.ReadToEnd();
                    }
                }
            }
            catch { }

            this.Enabled = true;
        }

        private void btnSave_Click(object sender, EventArgs e)
        {
            saveFileDialog1.FileName = "02_insert_t_LiveChat_ZapTemplate.sql";
            saveFileDialog1.InitialDirectory = Path.GetDirectoryName(Process.GetCurrentProcess().MainModule.FileName);
            if (saveFileDialog1.ShowDialog() != System.Windows.Forms.DialogResult.OK) return;
            try
            {
                StringBuilder sb = new StringBuilder();
                foreach (var template in _list.OrderBy(x=>x.SortOrder))
                {
                    sb.AppendLine(string.Format("IF NOT EXISTS( select Link from t_LiveChat_ZapTemplate where Link='{0}' ) ", template.Link));
                    sb.AppendLine("INSERT INTO t_LiveChat_ZapTemplate ");
                    sb.AppendLine("( Summary, AppName, AppIcon, Link, IfShownByDefault, SortOrder ) ");
                    sb.AppendLine("VALUES ( ");
                    sb.AppendLine(string.Format("'{0}',", template.Summary.Replace("'","''")));
                    sb.AppendLine(string.Format("'{0}',", template.AppName.Replace("'", "''")));
                    sb.AppendLine(string.Format("'{0}',", template.AppIcon));
                    sb.AppendLine(string.Format("'{0}',", template.Link));
                    sb.AppendLine(string.Format("{0},", template.IfShownByDefault ? 1 : 0));
                    sb.AppendLine(string.Format("{0}", template.SortOrder));
                    sb.AppendLine(")");
                    sb.AppendLine();
                }

                File.WriteAllText(saveFileDialog1.FileName, sb.ToString(), Encoding.UTF8);
                File.WriteAllText(History, string.Join(",", _list.Where(x => x.IfShownByDefault).Select(x => x.Id)));
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
        }

        private void Fetch(dynamic templates)
        {
            _list = new List<TemplateInfo>();
            IEnumerable<int> _histor = Enumerable.Empty<int>();
            try
            {
                var logos = GetLogos();

                if (File.Exists(History))
                {
                    _histor = File.ReadAllText(History).Split(new char[] { ',' }).Select(x => int.Parse(x));
                }

                foreach (var template in templates)
                {
                    var info = new TemplateInfo();
                    info.Id = template.id;
                    info.AppName = template.tailService.name;
                    info.Summary = template.title;
                    info.Link = string.Format("https://zapier.com/app/editor/template/{0}", template.id);
                    info.IfShownByDefault = _histor.Any(x => x == info.Id);

                    string key = template.tailService.key;
                    if (_logodic.ContainsKey(key))
                    {
                        info.AppIcon = _logodic[key];
                    }
                    else
                    {
                        info.AppIcon = GetLogoData(logos,key);
                        _logodic.Add(key, info.AppIcon);
                    }

                    _list.Add(info);
                }
                this.Invoke(new Action(() =>
                {
                    BuildTree();
                    btnSave.Visible = true;
                    button1.Visible = false;
                    MessageBox.Show("Select 10 templates for default show, and click [Save] to save sql script.");
                }));
            }
            catch (Exception ex)
            {
                this.Invoke(new Action(() =>
                {
                    MessageBox.Show(ex.Message);
                }));
            }
            finally
            {
                this.Invoke(new Action(()=>{
                    btnSave.Enabled = true;
                }));
            }
        }

        private void BuildTree()
        {
            treeView1.Nodes.Clear();
            int sortOrder = 1;
            foreach (var group in _list.GroupBy(x => x.AppName))
            {
                TreeNode node = new TreeNode(group.Key);                
                foreach (var template in group.OrderBy(x => x.Id))
                {
                    TreeNode child = new TreeNode(String.Format("{0} - {1}", template.Id, template.Summary));
                    child.Tag = template;
                    child.Checked = template.IfShownByDefault;
                    node.Nodes.Add(child);
                    template.SortOrder = sortOrder++;
                    if (template.IfShownByDefault)
                    {
                        child.BackColor = Color.LightGreen;
                    }
                }
                treeView1.Nodes.Add(node);
            }
            treeView1.Visible = true;
            richTextBox1.Visible = false;
        }

        private string GetLogoData(IEnumerable<String> logos, string key)
        {
            key = key.Split(new char[] { '@' }).First();
            var line = logos.FirstOrDefault(x => x.Contains(key + "16x16") || x.Contains(key + "32x32") || x.Contains(key + "64x64"));
            if (!string.IsNullOrWhiteSpace(line))
            {
                var m = Regex.Match(line, "url[(]\"(?<url>https://.+)\"[)]", RegexOptions.IgnoreCase);
                if (m.Success)
                {
                    var data = DownloadData(m.Groups["url"].Value);
                   // return "0x" + string.Join("", data.Select(x => x.ToString("X2")));
                    return "data:image/png;base64," + Convert.ToBase64String(data);
                }
            }

            return null;
        }

        private IEnumerable<String> GetLogos()
        {
            var logos = DownloadString("https://zapier.com/generated/global-logos.css");
            return logos.Split(Environment.NewLine.ToCharArray()).Where(x => !string.IsNullOrWhiteSpace(x));
        }

        private string DownloadString(string url)
        {
            using (var stream = GetRequest(url))
            {
                using (var reader = new StreamReader(stream, Encoding.UTF8))
                {
                    return reader.ReadToEnd();
                }
            }
        }

        public static byte[] DownloadData(string url)
        {
            using (var stream = GetRequest(url))
            {
                using (MemoryStream ms = new MemoryStream())
                {
                    stream.CopyTo(ms);
                    return ms.ToArray();
                }
            }
        }

        public static Stream GetRequest(string url)
        {
            HttpWebRequest req = (HttpWebRequest)HttpWebRequest.Create(url);
            req.Method = "GET";
            req.Timeout = 5 * 60 * 1000;
            req.ReadWriteTimeout = 5 * 60 * 1000;
            var response = req.GetResponse().GetResponseStream();
            return response;
        }

        private void treeView1_AfterCheck(object sender, TreeViewEventArgs e)
        {
            var template = e.Node.Tag as TemplateInfo;
            if (template != null)
            {
                template.IfShownByDefault = e.Node.Checked;
                e.Node.BackColor = template.IfShownByDefault ? Color.LightGreen : Color.White;
            }
            else
            {
                foreach (TreeNode child in e.Node.Nodes)
                {
                    child.Checked = e.Node.Checked;
                    template = child.Tag as TemplateInfo;
                    template.IfShownByDefault = e.Node.Checked;
                    child.BackColor = template.IfShownByDefault ? Color.LightGreen : Color.White;
                }
            }
        }

        private void button1_Click(object sender, EventArgs e)
        {
            if (String.IsNullOrWhiteSpace(richTextBox1.Text)) return;
            try
            {
                dynamic json = JsonConvert.DeserializeObject<dynamic>(richTextBox1.Text);
                Thread th = new Thread(Fetch);
                th.IsBackground = true;
                th.Start(json.data.zapTemplates);
                button1.Enabled = false;
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
                button1.Enabled = true;
            }
        }
    }
}
