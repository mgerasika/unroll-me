using System;
using SharpKit.JavaScript;
using SharpKitLib.entity;

namespace SharpKitClient.core
{
    [JsType(JsMode.ExtJs, Export = false, Name = "$server")]
    public class Server
    {
        [JsMethod(Name = "connect")]
        public static void Connect()
        {

        }

        [JsMethod(Name = "disconnect")]
        public static void Disconnect()
        {

        }

        [JsMethod(Name = "send")]
        public static void Send(Data request)
        {

        }

        [JsMethod(Name = "subscribe")]
        public static void Subscribe(Action<object> action)
        {
        }
    }
}