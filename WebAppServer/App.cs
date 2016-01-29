using System;
using System.Collections.Generic;
using System.Threading;
using SharpKitWebApp.data;
using WebAppServer.comet;

namespace WebAppServer
{
    public delegate void MyDelegate();
    public class App
    {
        private static readonly App _inst = new App();
        private readonly List<Game> _games = new List<Game>();

        private App()
        {
            Init();
        }

        public static App Inst
        {
            get { return _inst; }
        }

        public void Init()
        {
            CometClientProcessor.Inst.AddClient += OnAddClient;
            CometClientProcessor.Inst.RemoveClient += OnRemoveClient;
        }

        private void OnAddClient(CometAsyncRequestState state, CometEventArgs e)
        {
            if (!IsClientUsed(state.ClientId))
            {
                int lastIdx = Math.Max(_games.Count - 1, 0);
                Game game = _games.Count > lastIdx ? _games[lastIdx] : null;
                if (null == game || (!string.IsNullOrEmpty(game.ClientId1) && !string.IsNullOrEmpty(game.ClientId2)))
                {
                    game = new Game();
                    _games.Add(game);
                }
                
                if (string.IsNullOrEmpty(game.ClientId1))
                {
                    game.ClientId1 = state.ClientId;
                }
                else if (string.IsNullOrEmpty(game.ClientId2))
                {
                    game.ClientId2 = state.ClientId;

                    startGameResponse response = new startGameResponse();
                    response.GameId = game.GameId;
                    response.FirstClientId = (new Random().Next(100)) > 50 ? game.ClientId1 : game.ClientId2;

                    CometClientProcessor.Inst.SendToClient(game.ClientId1, response);
                    CometClientProcessor.Inst.SendToClient(game.ClientId2, response);
                }
            }
        }

        private bool IsClientUsed(string clientId)
        {
            bool res = null != FindGameByClientId(clientId);
            return res;
        }

        private void OnRemoveClient(CometAsyncRequestState state, CometEventArgs e)
        {
        }

        public Game FindGameByClientId(string clientId)
        {
            Game res = null;
            foreach (Game game in _games)
            {
                if (game.ContainsClient(clientId))
                {
                    res = game;
                    break;
                }
            }
            return res;
        }
    }
}