using SharpKit.JavaScript;

namespace SharpKitClient
{
    [JsType(JsMode.Global, Filename = "gen/program.js")]
    public class Program
    {
        private static void DefaultClient_Load() {
            client.inst.init();
        }

        
    }
}