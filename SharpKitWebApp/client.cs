using System;
using System.Web;
using SharpKit.Html;
using SharpKit.JavaScript;
using SharpKitClient.core;
using SharpKitClient.entity;

namespace SharpKitClient
{
    public delegate void EventListenerEx(Object e);

    [JsType(JsMode.Prototype, Filename = "gen/client.js")]
    public class client
    {
        public static client inst = new client();
        private string _clientId;
        private HtmlDivElement _div;
        private EState _figure;
        private HtmlTableElement _table;
        private HtmlSpanElement _tableCnt;
        private HtmlDivElement _turn;
        private string _turnClientId;
        private HtmlDivElement _welcomeDiv;

        private client() {
        }

        public string ClientId { get; set; }

        public void init() {

            _div = new HtmlDivElement();
            HtmlContext.document.body.appendChild(_div);
            _welcomeDiv = new HtmlDivElement();
            _div.appendChild(_welcomeDiv);

            server.connect();

            server.subscribe(delegate(Object e) {
                var response = e.As<Response>();
                response.Analise();
            });

            HtmlContext.window.addEventListener("unload", OnBeforeUnload);
        }

        public void onConnected(ConnectResponse response) {
            this.ClientId = response.ClientId;
            _welcomeDiv.innerHTML = "Connected.";

            StartGameRequest request = new StartGameRequest();
            request.ClientId = this.ClientId;
            server.send(request);
        }

        public void onDisconected(DisconnectResponse disconnectResponse) {
            _welcomeDiv.innerHTML = "Disconected.";
        }

        public void onStartGame(StartGameResponse response)
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
            _figure = (response.FirstClientId == ClientId) ? EState.blue : EState.red;
            //_div.innerHTML += "You are " + _figure + "<br/>";

            _turnClientId = response.FirstClientId;

            RefreshTurn();
        }

        public void onTurn(TurnResponse response) {
            JsString message = response.message;
            if (response.message == "") {
                renderFigure(response);

                _turnClientId = response.nextClientId;
                RefreshTurn();
            }
            else if (response.message == "turn again") {
            }
            else if (message.indexOf("winn") == 0) {
                js.addClass(_table, response.message);

                renderFigure(response);

                if (response.ClientId == ClientId) {
                    HtmlContext.window.alert("You winn");
                }
                else {
                    HtmlContext.window.alert("You loss");
                }

                var request = new ResetGameRequest();
                request.ClientId = ClientId;
                request.GameId = response.GameId;
                server.send(request);
            }
            else if (response.message == "equal") {
                renderFigure(response);

                HtmlContext.window.alert("equal");
            }
        }

        public void onResetGame(ResetGameResponse resetGameResponse)
        {
            HtmlContext.console.log("reset game");

            var request = new StartGameRequest();
            request.ClientId = ClientId;
            request.GameId = resetGameResponse.GameId;
            server.send(request);
        }

        private void renderFigure(TurnResponse response) {
            var row = _table.rows[response.y].As<HtmlTableRowElement>();
            var cell = row.cells[response.x].As<HtmlTableCellElement>();
            if ((response.figure == EState.blue)) {
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

                    var request = new TurnRequest();
                    request.x = cell.cellIndex;
                    request.y = JsContext.parseInt(row.getAttribute("rowIdx"), 10);
                    request.ClientId = ClientId;
                    request.figure = _figure;
                    
                    server.send(request);
                }
            }
        }

        private void OnBeforeUnload(DOMEvent evt) {
            server.disconnect();
        }

        
    }
}