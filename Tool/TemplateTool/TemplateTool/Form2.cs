using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace TemplateTool
{
    public partial class Form2 : Form
    {
        public Form2()
        {
            InitializeComponent();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            var data = Form1.DownloadData(textBox1.Text);
            richTextBox1.Text = "0x" + string.Join("", data.Select(x => x.ToString("X2")));
            Clipboard.SetText(richTextBox1.Text, TextDataFormat.Text);
        }

        private void button2_Click(object sender, EventArgs e)
        {
            OpenFileDialog dialog = new OpenFileDialog();
            dialog.ShowDialog();
            var data = File.ReadAllBytes(dialog.FileName);
            richTextBox1.Text = "0x" + string.Join("", data.Select(x => x.ToString("X2")));
            Clipboard.SetText(richTextBox1.Text, TextDataFormat.Text);
        }
    }
}
