using SharpKit.JavaScript;
using SharpKitLibrary;

namespace SharpKitClient.entity
{
    [JsType(JsMode.Prototype, Filename = "../gen/request.js")]
    public class LoginRequest : IRequest
    {
        public string ClientId { get; set; }

        public string _cstype
        {
            get { return "LoginRequest"; }
        }
    }

    [JsType(JsMode.Prototype, Filename = "../gen/request.js")]
    public class MessageRequest : IRequest
    {
        public string Message { get; set; }

        public string _cstype
        {
            get { return "MessageRequest"; }
        }

        public string ClientId { get; set; }
    }

    [JsType(JsMode.Prototype, Filename = "../gen/request.js")]
    public class StartGameRequest : IRequest
    {
        public string _cstype
        {
            get { return "StartGameRequest"; }
        }

        public string GameId { get; set; }

        public string ClientId { get; set; }
    }

    [JsType(JsMode.Prototype, Filename = "../gen/request.js")]
    public class ResetGameRequest : IRequest
    {
        public string _cstype
        {
            get { return "ResetGameRequest"; }
        }

        public string GameId { get; set; }

        public string ClientId { get; set; }
    }


    [JsType(JsMode.Prototype, Filename = "../gen/request.js")]
    public class TurnRequest : IRequest
    {
        public int x { get; set; }
        public int y { get; set; }

        public string _cstype
        {
            get { return "TurnRequest"; }
        }

        public string ClientId { get; set; }

        public EState figure { get; set; }
    }
}