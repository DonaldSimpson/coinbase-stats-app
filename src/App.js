import React from 'react';
import CoinStats from './components/CoinStats';
import './styles/App.css';

function App() {
  return (
    <div className="App">
      <h1>Coinbase Real-Time Stats</h1>
      <CoinStats />
    </div>
  );
}

export default App;