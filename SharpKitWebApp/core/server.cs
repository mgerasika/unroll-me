using System;
using SharpKit.JavaScript;
using SharpKitLibrary;

namespace SharpKitClient.core
{
    [JsType(JsMode.ExtJs, Export = false, Name = "server")]
    public class server
    {
        [JsMethod(Name = "connect")]
        public static void connect()
        {

        }

        [JsMethod(Name = "disconnect")]
        public static void disconnect()
        {

        }

        [JsMethod(Name = "send")]
        public static void send(IRequest request)
        {

        }

        [JsMethod(Name = "subscribe")]
        public static void subscribe(Action<object> action)
        {
        }
    }
}