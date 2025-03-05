import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';

const CoinStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const timestamp = Math.floor(Date.now() / 1000);
      const method = 'GET';
      const requestPath = '/v2/accounts';
      const body = '';
      const prehash = timestamp + method + requestPath + body;
      const key = process.env.REACT_APP_COINBASE_API_SECRET;
      const sign = CryptoJS.HmacSHA256(prehash, key).toString(CryptoJS.enc.Hex);

      console.log('API Key:', process.env.REACT_APP_COINBASE_API_KEY);
      console.log('API Secret:', process.env.REACT_APP_COINBASE_API_SECRET);
      console.log('Signature:', sign);

      try {
        const response = await axios.get(`https://cors-anywhere.herokuapp.com/https://api.coinbase.com${requestPath}`, {
          headers: {
            'CB-ACCESS-KEY': process.env.REACT_APP_COINBASE_API_KEY,
            'CB-ACCESS-SIGN': sign,
            'CB-ACCESS-TIMESTAMP': timestamp,
            'CB-VERSION': '2021-03-05'
          }
        });
        setStats(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError({
          message: err.message,
          status: err.response ? err.response.status : 'Network Error',
          details: err.response ? err.response.data : null
        });
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return (
    <div>
      <h1>Error: {error.message}</h1>
      <p>Status: {error.status}</p>
      {error.details && <pre>{JSON.stringify(error.details, null, 2)}</pre>}
    </div>
  );

  return (
    <div>
      <h1>Coinbase Stats</h1>
      <pre>{JSON.stringify(stats, null, 2)}</pre>
    </div>
  );
};

export default CoinStats;