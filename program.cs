using System;
using System.Collections.Generic;
using System.Diagnostics;
using SharpKit.Html;
using SharpKit.JavaScript;
using SharpKit.jQuery;

namespace SharpKitWebApp
{
    [JsType(JsMode.Global, Filename = "gen/program.js")]
    public class Program
    {
        private static void DefaultClient_Load()
        {
             client client = new client();

            /*
            loginRequest request = new loginRequest();
            commet.send(request);

            commet.disconnect();
            /*
            var app = new app();
            app.init();

            map.inst().load(level.level4);
            itemBase item1 = map.inst().getItems()[0];
            app.setItem(item1);

            ball ball1 = new ball();
            ball1.setInSide(item1.getSlides()[0]);
            item1.showBall(ball1,null);

            HtmlContext.window.setTimeout(js.bind(
                delegate(DOMEvent ev)
                {
                   item1.moveBall(ball1, js.bind(delegate(DOMEvent evt) { app.moveBallComplete(item1, ball1); }, app)); 
                }, app), 4000);
           */
        }

        
    }
}