using SharpKit.Html;
using SharpKit.JavaScript;

namespace SharpKitWebApp
{
    [JsType(JsMode.ExtJs, Export = false, Name = "level")]
    public class level
    {
        [JsField]
        public static JsArray<JsObject> level1;

        [JsField]
        public static JsArray<JsObject> level2;

        [JsField]
        public static JsArray<JsObject> level3;

        [JsField]
        public static JsArray<JsObject> level4;

        [JsField]
        public static JsArray<JsObject> level5;
    };
}