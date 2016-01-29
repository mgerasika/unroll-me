using SharpKit.JavaScript;

namespace SharpKitWebApp.data
{
    [JsType(JsMode.Prototype, Filename = "../gen/response.js")]
    public abstract class response : objectEx
    {
        [JsProperty]
        public string clientID { get; set; }
    }

    [JsType(JsMode.Prototype, Filename = "../gen/response.js")]
    public class connectResponse : response
    {
        

        public override string Type
        {
            get { return "connectResponse"; }
        }

       
    }

    [JsType(JsMode.Prototype, Filename = "../gen/response.js")]
    public class messageResponse : response
    {
        [JsProperty]
        public string Message { get; set; }

        public override string Type
        {
            get { return "messageResponse"; }
        }

        [JsProperty]
        public string From { get; set; }
    }

    [JsType(JsMode.Prototype, Filename = "../gen/response.js")]
    public class disconnectResponse : response
    {
        [JsProperty]
        public string ClientID { get; set; }

        public override string Type
        {
            get { return "disconnectResponse"; }
        }
    }

    [JsType(JsMode.Prototype, Filename = "../gen/response.js")]
    public class startGameResponse : response
    {
        public string GameId { get; set; }

        public override string Type
        {
            get { return "startGameResponse"; }
        }

        public string FirstClientId { get; set; }
    }

    [JsType(JsMode.Prototype, Filename = "../gen/response.js")]
    public class turnResponse : response
    {
        public string GameId { get; set; }
        public int x { get; set; }
        public int y { get; set; }
        public string nextClientId { get; set; }

        public override string Type
        {
            get { return "turnResponse"; }
        }


        public EState figure { get; set; }

        public string message { get; set; }
    }
}