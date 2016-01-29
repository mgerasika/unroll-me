using SharpKit.JavaScript;
using SharpKitLibrary;

namespace SharpKitClient.entity
{
    public abstract class Response : IResponse
    {
        public string ClientId { get; set; }
        public abstract string _cstype { get; }

        public abstract void Analise();
    }

    [JsType(JsMode.Prototype, Filename = "../gen/response.js")]
    public class ConnectResponse : Response
    {
        public string ClientId { get; set; }

        public override string _cstype {
            get { return "ConnectResponse"; }
        }

        public override void Analise() {
            client.inst.onConnected(this);
        }
    }

    [JsType(JsMode.Prototype, Filename = "../gen/response.js")]
    public class DisconnectResponse : Response
    {
        public string ClientId { get; set; }

        public override string _cstype
        {
            get { return "DisconnectResponse"; }
        }

        public override void Analise() {
            client.inst.onDisconected(this);
        }
    }

    [JsType(JsMode.Prototype, Filename = "../gen/response.js")]
    public class StartGameResponse : Response
    {
        public string GameId { get; set; }

        public string ClientId { get; set; }

        public override string _cstype
        {
            get { return "StartGameResponse"; }
        }


        public string FirstClientId { get; set; }

        public override void Analise() {
            client.inst.onStartGame(this);
        }
    }

    [JsType(JsMode.Prototype, Filename = "../gen/response.js")]
    public class ResetGameResponse : Response
    {
        public string GameId { get; set; }

        public string ClientId { get; set; }

        public override string _cstype
        {
            get { return "ResetGameResponse"; }
        }

        public override void Analise()
        {
            client.inst.onResetGame(this);
        }
    }

    [JsType(JsMode.Prototype, Filename = "../gen/response.js")]
    public class TurnResponse : Response
    {
        public string GameId { get; set; }
        public int x { get; set; }
        public int y { get; set; }
        public string nextClientId { get; set; }

        public string ClientId { get; set; }

        public override string _cstype
        {
            get { return "TurnResponse"; }
        }

        public EState figure { get; set; }
        public string message { get; set; }

        public override void Analise() {
            client.inst.onTurn(this);
        }
    }
}