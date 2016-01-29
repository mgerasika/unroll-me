using SharpKit.JavaScript;

namespace SharpKitClient.entity
{
    [JsType(JsMode.Prototype, Filename = "../gen/enum.js")]
    public enum EState
    {
        empty = 0,
        red,
        blue,
    };
}