using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.Script.Serialization;
using SharpKit.JavaScript;

namespace SharpKitWebApp.data
{
    [JsType(JsMode.Prototype, Filename = "../gen/objectEx.js")]
    public abstract class objectEx
    {
        public string _cstype;
        public abstract string Type { get; }

        public objectEx()
        {
            _cstype = this.Type;
        }

        [JsMethod(Export = false)]
        public string toJson()
        {
            JavaScriptSerializer serealizer = new JavaScriptSerializer();
            string json = serealizer.Serialize(this);
            return json;
        }
    }

    public enum EState
    {
        empty = 0,
        x,
        o,
    };
}
