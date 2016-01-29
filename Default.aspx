<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="SharpKitWebApp.Default" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title>SharpKitWebApp</title>     
        <link rel="stylesheet" href="style.css"/>
    
        <script src="res/framework.js"></script>
        <script src="res/jquery-1.8.2.min.js"></script> 
        <script src="res/level.js"></script>                                    
        <script src="res/commet.js"></script> 
    
        <script src="gen/default.js"></script>
        <script src="gen/app.js"></script> 
        <script src="gen/ball.js"></script> 
        <script src="gen/base.js"></script> 
        <script src="gen/enum.js"></script> 
        <script src="gen/item.js"></script>  
        <script src="gen/map.js"></script> 
        <script src="gen/point.js"></script>   

        <script src="gen/objectEx.js"></script>
        <script src="gen/request.js"></script> 
        <script src="gen/response.js"></script> 
        <script src="gen/program.js"></script>
    
        <script> $(DefaultClient_Load); </script>
    </head>
    <body style="font-size: 12px;">
        <div class="checkFontSize item" id="checkFontSize"></div>
        <div id="res" class="bg" >
        </div>
    </body>
</html>