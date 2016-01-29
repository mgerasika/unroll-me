using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Diagnostics;
using SharpKit.Html;
using SharpKit.JavaScript;
using SharpKit.jQuery;
using SharpKitWebApp.core;
using SharpKitWebApp.data;

namespace SharpKitWebApp
{

    public delegate void EventListenerEx(objectEx e);

    [JsType(JsMode.Prototype, Filename = "gen/default.js")]
    public class client
    {
        private string _turnClientId;
        private HtmlTableElement _table;
        private EState _figure;
        private HtmlDivElement _turn;

        public string ClientId
        {
            get
            {
                JsString url = HtmlContext.window.document.location.href;
                int idx = url.lastIndexOf('?') + 1;
                JsString name = url.substring(idx);
                JsArray arr = name.split('=');
                name = arr[1].ToString();
                return name;
            }
        }
        
        public client()
        {
            init();
        }

        [JsMethod]
        private void init()
        {
            commet.subscribe(delegate(objectEx e)
            {
                response r = e.As<response>();
                if (r is startGameResponse)
                {
                    startGameResponse response = r as startGameResponse;
                    OnStartGame(response);
                }
                if (r is messageResponse)
                {
                    messageResponse response = r as messageResponse;
                    //_div.innerHTML += "Message From:" + response.From + " Message:" + response.Message + "<br/>";
                }
                if (r is turnResponse)
                {
                    turnResponse response = r as turnResponse;
                    if (response.message == "")
                    {
                        HtmlTableRowElement row = _table.rows[response.y].As<HtmlTableRowElement>();
                        HtmlTableCellElement cell = row.cells[response.x].As<HtmlTableCellElement>();
                        cell.innerHTML = (response.figure == EState.x) ? "x" : "o";
                        if((response.figure == EState.x))
                        {
                            js.addClass(cell,"tableCellX");
                        }
                        else
                        {
                            js.addClass(cell, "tableCell0");
                        }

                        _turnClientId = response.nextClientId;
                        RefreshTurn();
                    }
                    else if (response.message == "turn again")
                    {
                        
                    }
                    else if (response.message == "winn")
                    {
                        HtmlContext.window.alert("You winn");
                    }
                    else if (response.message == "loss")
                    {
                        HtmlContext.window.alert("You loss");
                    }
                    else if (response.message == "equal")
                    {
                        HtmlContext.window.alert("equal");
                    }

                }
                if (r is connectResponse)
                {
                    OnConnectResponse(r as connectResponse);
                }
                if (r is disconnectResponse)
                {
                    disconnectResponse response = r as disconnectResponse;
                    //_div.innerHTML += "Disconnect ID = " + response.ClientID + "<br/>";
                }
            });

            HtmlDivElement myButton = new HtmlDivElement();
            js.addClass(myButton, "button");
            myButton.innerHTML = "[Connect]";
            myButton.addEventListener("click", OnConnectClick);
            HtmlContext.document.body.appendChild(myButton);

            HtmlContext.window.addEventListener("unload", OnBeforeUnload);
        }


        private void OnStartGame(startGameResponse response)
        {
            //_div.innerHTML += "Start Game ID = " + response.GameId + "<br/>";
            _figure = (response.FirstClientId == this.ClientId) ? EState.x : EState.o;
            //_div.innerHTML += "You are " + _figure + "<br/>";

            _turnClientId = response.FirstClientId;

            RefreshTurn();
        }

        private void RefreshTurn()
        {
            if (_turnClientId == this.ClientId)
            {
                js.removeClass(_turn, "notMyTurn");
                js.addClass(_turn, "myTurn");
            }
            else
            {
                js.removeClass(_turn, "myTurn");
                js.addClass(_turn, "notMyTurn");
            }
        }

        private void OnConnectClick(DOMEvent evt)
        {
            commet.connect(this.ClientId);
        }

        private void OnConnectResponse(connectResponse response)
        {
            _turn = new HtmlDivElement();
            js.addClass(_turn,"turn");
            HtmlContext.document.body.appendChild(_turn);

            _table = new HtmlTableElement();
            js.attach(_table, "click", onTableClick);
            js.addClass(_table, "table");
            for (int y = 0; y < 3; ++y)
            {
                HtmlTableRowElement row = new HtmlTableRowElement();
                _table.appendChild(row);
                for (int x = 0; x < 3; ++x)
                {
                    HtmlTableCellElement cell = new HtmlTableCellElement();
                    row.appendChild(cell);
                    js.addClass(cell,"tableCell");
                }
            }
            HtmlContext.document.body.appendChild(_table);
        }

        private void onTableClick(DOMEvent evt)
        {
            if (_turnClientId == this.ClientId)
            {
                HtmlElement el = evt.target.As<HtmlElement>();
                if (el is HtmlTableCellElement)
                {
                    HtmlTableCellElement cell = el.As<HtmlTableCellElement>();
                    HtmlTableRowElement row = cell.parentNode.As<HtmlTableRowElement>();
                    //el.innerHTML = _figure;
                    
                    turnRequest request = new turnRequest();
                    request.x = cell.cellIndex;
                    request.y = row.rowIndex;
                    request.clientId = this.ClientId;
                    request.figure = _figure;
                    server.send(request);
                }
            }
        }

        private void OnBeforeUnload(DOMEvent evt)
        {
            commet.disconnect();
        }
    }
}