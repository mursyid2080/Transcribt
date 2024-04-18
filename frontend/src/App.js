import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get('/get-data/');
      setData(response.data);
    }
    fetchData();
  }, []);

  return (
    <div>
      <h1>Data from Django Backend</h1>
      <ul>
        {data.map(item => (
          <li key={item.id}>
            <strong>{item.name}</strong>: {item.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

