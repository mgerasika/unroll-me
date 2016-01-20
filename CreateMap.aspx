<%@ Page Language="C#" AutoEventWireup="true" CodeFile="CreateMap.aspx.cs" Inherits="Index" %>

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
        
        <script type="text/javascript">

            function addItemClick(type) {
                var item = new window[type](type, 0, 0);
                $map.addItem(item);
                $app.setItem(item);
                item.invalidate();
            };

            function addFixedItemClick(type) {
                var item = new window[type](type, 0, 0,true);
                $map.addItem(item);
                $app.setItem(item);
                item.invalidate();
            };

            function addStartItemClick(type) {
                var item = new window[type](type, 0, 0, true);
                $map.addItem(item);
                $app.setItem(item);
                item.invalidate();
            };

            function addFinishItemClick(type) {
                var item = new window[type](type, 0, 0, true);
                $map.addItem(item);
                $app.setItem(item);
                item.invalidate();
            };
            
        </script>
    
    </head>
    <body>
        <form id="form1" runat="server">
            <div style="float: right; width: 400px;"><textarea id="ta"></textarea></div>
            <div style="height: 60px;">
                <div class="button leftToBottomItem" onclick=" addItemClick('leftToBottomItem') "></div>
                <div class="button leftToRightItem" onclick=" addItemClick('leftToRightItem') "></div>
                <div class="button rightToBottomItem" onclick=" addItemClick('rightToBottomItem') "></div>
                <div class="button topToBottomItem" onclick=" addItemClick('topToBottomItem') "></div>
                <div class="button topToLeftItem" onclick=" addItemClick('topToLeftItem') "></div>
                <div class="button topToRightItem" onclick=" addItemClick('topToRightItem') "></div>
                
                <div class="button leftToBottomItemFixed" onclick=" addFixedItemClick('leftToBottomItem') "></div>
                <div class="button leftToRightItemFixed"  onclick=" addFixedItemClick('leftToRightItem') "></div>
                <div class="button rightToBottomItemFixed"  onclick=" addFixedItemClick('rightToBottomItem') "></div>
                <div class="button topToBottomItemFixed"  onclick=" addFixedItemClick('topToBottomItem') "></div>
                <div class="button topToLeftItemFixed"  onclick=" addFixedItemClick('topToLeftItem') "></div>
                <div class="button topToRightItemFixed"  onclick=" addFixedItemClick('topToRightItem') "></div> 
                
                <div class="button startItem startTopItem" onclick=" addStartItemClick('startTopItem') "></div> 
                <div class="button startItem startRightItem" onclick=" addStartItemClick('startRightItem') "></div> 
                <div class="button startItem startBottomItem" onclick=" addStartItemClick('startBottomItem') "></div> 
                <div class="button startItem startLeftItem" onclick=" addStartItemClick('startLeftItem') "></div> 
                
                <div class="button finishItem finishTopItem" onclick=" addFinishItemClick('finishTopItem') "></div> 
                <div class="button finishItem finishRightItem" onclick=" addFinishItemClick('finishRightItem') "></div> 
                <div class="button finishItem finishBottomItem" onclick=" addFinishItemClick('finishBottomItem') "></div> 
                <div class="button finishItem finishLeftItem" onclick=" addFinishItemClick('finishLeftItem') "></div> 
    
                <div class="button" onclick=" document.getElementById('ta').value = $map.save(); ">Save</div>    
                <div class="button" onclick=" var item = $app.getItem();$map.removeItem(item); ">Remove</div> 
                   
            </div>
            <div id="res" class="bg" >
    
            </div>
    
    
        </form>
    </body>
     <script type="text/javascript">
         $app.init();
         $app.setIsDesignMode(true);
     </script>
</html>