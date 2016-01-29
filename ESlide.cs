using SharpKit.JavaScript;

namespace SharpKitWebApp
{
    [JsType(JsMode.Prototype, Filename = "gen/enum.js")]
    public enum ESlide
    {
        none = -1,
        left = 1,
        right,
        top,
        bottom,
        center,
    }
}