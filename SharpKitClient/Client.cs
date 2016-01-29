using System;
using System.Diagnostics;
using System.Reflection;
using System.Web;
using SharpKit.Html;
using SharpKit.JavaScript;
using SharpKitClient.core;
using SharpKitLib;
using SharpKitLib.entity;

namespace SharpKitClient
{
    public delegate void EventListenerEx(Object e);

    [JsType(JsMode.Prototype, Filename = "gen/client.js")]
    public class Client
    {
        public static Client inst = new Client();
        private string _clientId;
        private HtmlDivElement _div;
        private EState _figure;
        private HtmlTableElement _table;
        private HtmlSpanElement _tableCnt;
        private HtmlDivElement _turn;
        private string _turnClientId;
        private HtmlDivElement _welcomeDiv;

        private Client() {
        }

        public string ClientId { get; set; }

        public void init() {

            _div = new HtmlDivElement();
            HtmlContext.document.body.appendChild(_div);
            _welcomeDiv = new HtmlDivElement();
            _div.appendChild(_welcomeDiv);

            Server.Connect();

            /*
            Server.Subscribe(delegate(Object e) {
                Data data = e.As<Data>();
                if (null != data)
                {
                    string methodName = data._cstype.Replace("Data", "");
                    Type type = MvcHlp.Inst.GetType();
                    MethodInfo method = type.GetMethod(methodName);
                    Debug.Assert(null != method);
                    method.Invoke(MvcHlp.Inst, new object[] { data });
                    //request.Send();
                }
            });
             * */

            HtmlContext.window.addEventListener("unload", OnBeforeUnload);
        }

        public void onConnected(ConnectData data) {
            this.ClientId = data.ClientId;
            _welcomeDiv.innerHTML = "Connected.";

            StartGameData startGameData = new StartGameData(this.ClientId);
            startGameData.ClientId = this.ClientId;
            Server.Send(startGameData);
        }

        public void onDisconected(DisconnectData disconnectData) {
            _welcomeDiv.innerHTML = "Disconected.";
        }

        public void onStartGame(StartGameData data)
        {
            _turnClientId = "";
            _figure = EState.empty;

            _welcomeDiv.innerHTML = "";
            if (_welcomeDiv.parentNode != null)
            {
                _welcomeDiv.parentNode.removeChild(_welcomeDiv);
            }

            if (null != _tableCnt && _tableCnt.parentNode != null)
            {
                _tableCnt.parentNode.removeChild(_tableCnt);
            }

            if (null != _turn && _turn.parentNode != null)
            {
                _turn.parentNode.removeChild(_turn);
            }

            _turn = new HtmlDivElement();
            js.addClass(_turn, "turn");
            _div.appendChild(_turn);

            _tableCnt = new HtmlSpanElement();
            js.addClass(_tableCnt, "tableCnt");

            _table = new HtmlTableElement();
            _tableCnt.appendChild(_table);
            js.attach(_table, "click", onTableClick);
            js.attach(_table, "touchstart", onTableClick);
            js.addClass(_table, "table");
            for (int y = 0; y < 3; ++y)
            {
                var row = new HtmlTableRowElement();
                _table.appendChild(row);
                row.setAttribute("rowIdx", y.ToString());
                for (int x = 0; x < 3; ++x)
                {
                    var cell = new HtmlTableCellElement();
                    row.appendChild(cell);
                    js.addClass(cell, "tableCell");
                }
            }
            _div.appendChild(_tableCnt);


            //_div.innerHTML += "Start Game ID = " + response.GameId + "<br/>";
            _figure = (data.FirstClientId == ClientId) ? EState.blue : EState.red;
            //_div.innerHTML += "You are " + _figure + "<br/>";

            _turnClientId = data.FirstClientId;

            RefreshTurn();
        }

        public void onTurn(TurnData turnData) {
            JsString message = turnData.message;
            if (turnData.message == "") {
                renderFigure(turnData);

                _turnClientId = turnData.nextClientId;
                RefreshTurn();
            }
            else if (turnData.message == "turn again") {
            }
            else if (message.indexOf("winn") == 0) {
                js.addClass(_table, turnData.message);

                renderFigure(turnData);

                if (turnData.ClientId == ClientId) {
                    HtmlContext.window.alert("You winn");
                }
                else {
                    HtmlContext.window.alert("You loss");
                }

                ResetGameData resetGameData = new ResetGameData(ClientId);
                resetGameData.GameId = turnData.GameId;
                Server.Send(resetGameData);
            }
            else if (turnData.message == "equal") {
                renderFigure(turnData);

                HtmlContext.window.alert("equal");
            }
        }

        public void onResetGame(ResetGameData resetGameData)
        {
            HtmlContext.console.log("reset game");

            StartGameData data = new StartGameData(ClientId);
            data.GameId = resetGameData.GameId;
            Server.Send(data);
        }

        private void renderFigure(TurnData data) {
            var row = _table.rows[data.y].As<HtmlTableRowElement>();
            var cell = row.cells[data.x].As<HtmlTableCellElement>();
            if ((data.figure == EState.blue)) {
                js.addClass(cell, "tableCellX");
            }
            else {
                js.addClass(cell, "tableCell0");
            }
        }

        private void ensureClientId() {
            JsString url = HtmlContext.window.document.location.href;
            int idx = url.lastIndexOf('?') + 1;
            if (idx > 0) {
                JsString name = url.substring(idx);
                JsArray arr = name.split('=');
                _clientId = arr[1].ToString();
            }
            else if (HtmlContext.localStorage.getItem("clientId") != null) {
                _clientId = HtmlContext.localStorage.getItem("clientId");
            }
            else {
                _clientId = js.createGuid();
            }
            HtmlContext.localStorage.setItem("clientId", _clientId);
        }

        private void RefreshTurn() {
            if (_turnClientId == ClientId) {
                js.removeClass(_turn, "notMyTurn");
                js.addClass(_turn, "myTurn");
            }
            else {
                js.removeClass(_turn, "myTurn");
                js.addClass(_turn, "notMyTurn");
            }
        }

        private void onTableClick(DOMEvent evt) {
            if (_turnClientId == ClientId) {
                var el = evt.target.As<HtmlElement>();
                if (el is HtmlTableCellElement) {
                    var cell = el.As<HtmlTableCellElement>();
                    var row = cell.parentNode.As<HtmlTableRowElement>();
                    //el.innerHTML = _figure;

                    TurnData data = new TurnData(ClientId);
                    data.x = cell.cellIndex;
                    data.y = JsContext.parseInt(row.getAttribute("rowIdx"), 10);
                    data.figure = _figure;
                    
                    Server.Send(data);
                }
            }
        }

        private void OnBeforeUnload(DOMEvent evt) {
            Server.Disconnect();
        }

        
    }
}