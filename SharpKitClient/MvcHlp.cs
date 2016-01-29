using SharpKit.JavaScript;
using SharpKitLib;
using SharpKitLib.entity;

namespace SharpKitClient
{
    [JsType(JsMode.Prototype, Filename = "gen/client.js", Name = "$mvcHlp")]
    internal class MvcHlp : IMvc
    {
        private MvcHlp() {
            
        }

        public void Connect(ConnectData data) {
            Client.inst.onConnected(data);
        }

        public void Disconnect(DisconnectData data) {
            Client.inst.onDisconected(data);
        }

        public void StartGame(StartGameData data) {
            Client.inst.onStartGame(data);
        }

        public void ResetGame(ResetGameData data) {
            Client.inst.onResetGame(data);
        }

        public void Turn(TurnData data) {
            Client.inst.onTurn(data);
        }

       
    }
}