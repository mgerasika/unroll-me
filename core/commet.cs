using System;
using SharpKit.JavaScript;
using SharpKitWebApp.data;

namespace SharpKitWebApp.core
{
    [JsType(JsMode.ExtJs, Export = false, Name = "commet")]
    public class commet
    {
        [JsMethod]
        public static void connect(string id)
        {

        }

        [JsMethod]
        public static void disconnect()
        {

        }

        [JsMethod]
        public static bool isConnected()
        {
           throw new Exception();
        }

        [JsMethod(Name = "subscribe")]
        public static void subscribe(EventListenerEx handler)
        {
            
        }
    }

    [JsType(JsMode.ExtJs, Export = false, Name = "server")]
    public class server
    {
        [JsMethod(Name = "send")]
        public static void send(request request)
        {

        }
    }
}