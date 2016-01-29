using SharpKit.Html;
using SharpKit.JavaScript;

namespace SharpKitWebApp
{
    [JsType(JsMode.Prototype, Filename = "gen/point.js")]
    public class point
    {
        [JsProperty]
        public int x { get; set; }

        [JsProperty]
        public int y { get; set; }

        [JsProperty]
        public ESlide inSide { get; set; }

        public point()
        {
            this.inSide = ESlide.none;
        }

    }
}