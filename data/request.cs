using System;
using System.Threading;
using SharpKit.JavaScript;

namespace SharpKitWebApp.data
{
    [JsType(JsMode.Prototype, Filename = "../gen/request.js")]
    public abstract class request : objectEx
    {
        [JsMethod(Export = false)]
        public abstract response send();

        public string clientId { get; set; }
    }

    [JsType(JsMode.Prototype, Filename = "../gen/request.js")]
    public class loginRequest : request
    {
        public override string Type
        {
            get { return "loginRequest"; }
        }

        public override response send()
        {
            throw new NotImplementedException();
        }
    }

    [JsType(JsMode.Prototype, Filename = "../gen/request.js")]
    public class messageRequest : request
    {
        public string Message { get; set; }

        public override string Type
        {
            get { return "messageRequest"; }
        }

        [JsMethod(Export = false)]
        public override response send()
        {
            messageResponse r = new messageResponse();
            r.Message = String.Format("{0}:[{1}] {2}",this.clientId,DateTime.Now, this.Message);
            r.From = this.clientId;

            //CometClientProcessor.Inst.SendToClient(null, r);
            
            return r;
        }
    }


    [JsType(JsMode.Prototype, Filename = "../gen/request.js")]
    public class turnRequest : request
    {
        public int x { get; set; }
        public int y { get; set; }

        public override string Type
        {
            get { return "turnRequest"; }
        }

        [JsMethod(Export = false)]
        public override response send()
        {
            turnResponse response = new turnResponse();
            response.x = this.x;
            response.y = this.y;
            response.clientID = this.clientId;
            response.figure = this.figure;

            return response;
        }

        public EState figure { get; set; }
    }
}