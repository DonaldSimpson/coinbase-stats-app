import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CoinStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('https://api.coinbase.com/v2/accounts', {
          headers: {
            'CB-ACCESS-KEY': process.env.REACT_APP_COINBASE_API_KEY,
            'CB-ACCESS-SIGN': process.env.REACT_APP_COINBASE_API_SECRET,
            'CB-VERSION': '2021-03-05'
          }
        });
        setStats(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Coinbase Stats</h1>
      <pre>{JSON.stringify(stats, null, 2)}</pre>
    </div>
  );
};

export default CoinStats;