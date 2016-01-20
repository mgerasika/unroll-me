<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Index.aspx.cs" Inherits="Index" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
    <head id="Head1" runat="server">
        <title></title>
        <link href="app.css" rel="stylesheet" />
        <meta name="viewport" content="width=device-width,user-scalable=no">
        <script src="framework.js" type="text/javascript"></script>
        <script src="object.js" type="text/javascript"></script>
        <script src="item.js" type="text/javascript"></script>
        <script src="map.js" type="text/javascript"></script>
        <script src="ball.js" type="text/javascript"></script>
        <script src="level.js" type="text/javascript"></script>
        <script src="app.js" type="text/javascript"></script>
    </head>
    <body>
        <form id="form1" runat="server">
            <div id="res" class="bg" >
            </div>
        </form>
    </body>
    <script type="text/javascript">
        $app.init();
        $map.load(level5);
        var item1 = $map.getItems()[0];
        $app.setItem(item1);


        var ball1 = new ball();
        ball1.setInSide(item1.getSides()[0]);
        item1.showBall(ball1);


        /*
        var item2 = $map.getItems()[3];
        var ball2 = new ball();
        ball2.setInSide(item2.getSides()[1]);
        item2.showBall(ball2);
        */

        window.setTimeout(js.bind(function() {
            item1.moveBall(ball1, js.bind($app.moveBallComplete, $app));
            //item2.moveBall(ball2, js.bind(this.moveBallComplete, this));
        }, this), 4000);
    </script>
</html>