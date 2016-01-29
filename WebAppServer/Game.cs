using System;
using System.Collections.Generic;
using SharpKitWebApp.data;

namespace WebAppServer
{
    public class Game
    {
        public string ClientId1 { get; set; }
        public string ClientId2 { get; set; }
        public string GameId { get; set; }
        private EState[][] _items = new EState[3][]; 

        public Game()
        {
            this.GameId = Guid.NewGuid().ToString();
            
            _items[0] = new EState[3];
            _items[1] = new EState[3];
            _items[2] = new EState[3];
        }

        internal bool ContainsClient(string clientId)
        {
            bool res = false;
            if (!string.IsNullOrEmpty(this.ClientId1) && this.ClientId1.Equals(clientId))
            {
                res = true;
            }
            else if (!string.IsNullOrEmpty(this.ClientId2) && this.ClientId2.Equals(clientId))
            {
                res = true;
            }
            return res;
        }

        public string SetPoint(string clientId, int x, int y,EState newState)
        {
            string res = "";

            EState state = _items[y][x];
            if (state == EState.empty)
            {
                _items[y][x] = newState;

                for (int y1 = 0; y1 < 3; ++y1)
                {
                    if (Equals(_items[y1][0], _items[y1][1], _items[y1][2]))
                    {
                        res = (newState == _items[y1][0]) ? "winn" : "loss";
                        break;
                    }
                }
                for (int x1 = 0; x1 < 3; ++x1)
                {
                    if (Equals(_items[0][x1], _items[1][x1], _items[2][x1]))
                    {
                        res = (newState == _items[0][x1]) ? "winn" : "loss";
                        break;
                    }
                }

                if (Equals(_items[0][0], _items[1][1], _items[2][2]))
                {
                    res = (newState == _items[0][0]) ? "winn" : "loss";
                }

                if (Equals(_items[0][2], _items[1][1], _items[2][0]))
                {
                    res = (newState == _items[0][2]) ? "winn" : "loss";
                }
            }
            else
            {

                bool hasEmptyItem = false;
                for (int y1 = 0; y1 < 3; ++y1)
                {
                    for (int x1 = 0; x1 < 3; ++x1)
                    {
                        if (_items[y1][x1] == EState.empty)
                        {
                            hasEmptyItem = true;
                            break;
                        }
                    }
                }
                if (!hasEmptyItem)
                {
                    res = "equal";
                }
                else
                {
                    res = "turn again";
                }
            }

            return res;
        }

        private bool Equals(EState a, EState b, EState c)
        {
            return ((a == b) && (b == c) && (EState.x == c)) || ((a == b) && (b == c) && (EState.o == c));
        }
    }
}