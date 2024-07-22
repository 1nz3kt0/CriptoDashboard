Desarrollar el frontend de una aplicación de monitoreo de criptomonedas puede ser un proyecto interesante y educativo. Aquí te dejo una guía inicial para configurar el frontend usando React.js.

### Paso 1: Configurar el Proyecto

1. **Crear el proyecto con Create React App:**
   ```bash
   npx create-react-app cripto-dashboard
   cd cripto-dashboard
   ```

2. **Instalar dependencias necesarias:**
   - Axios para las solicitudes HTTP:
     ```bash
     npm install axios
     ```
   - Chart.js para los gráficos:
     ```bash
     npm install chart.js react-chartjs-2
     ```

### Paso 2: Estructura del Proyecto

Organiza tu proyecto en carpetas para mantenerlo limpio y manejable:

```
cripto-dashboard/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── Header.js
│   │   ├── CryptoTable.js
│   │   ├── CryptoChart.js
│   │   └── ...
│   │
│   ├── services/
│   │   └── cryptoService.js
│   │
│   ├── App.js
│   ├── index.js
│   └── ...
│
├── package.json
└── ...
```

### Paso 3: Crear los Componentes

1. **Header.js:**
   ```jsx
   import React from 'react';

   const Header = () => {
     return (
       <header>
         <h1>CriptoDashboard</h1>
       </header>
     );
   };

   export default Header;
   ```

2. **CryptoTable.js:**
   ```jsx
   import React, { useState, useEffect } from 'react';
   import axios from 'axios';

   const CryptoTable = () => {
     const [cryptos, setCryptos] = useState([]);

     useEffect(() => {
       const fetchData = async () => {
         const result = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
           params: {
             vs_currency: 'usd',
             order: 'market_cap_desc',
             per_page: 10,
             page: 1,
             sparkline: false
           }
         });
         setCryptos(result.data);
       };

       fetchData();
     }, []);

     return (
       <table>
         <thead>
           <tr>
             <th>Nombre</th>
             <th>Precio</th>
             <th>Cap. de Mercado</th>
           </tr>
         </thead>
         <tbody>
           {cryptos.map(crypto => (
             <tr key={crypto.id}>
               <td>{crypto.name}</td>
               <td>${crypto.current_price}</td>
               <td>${crypto.market_cap}</td>
             </tr>
           ))}
         </tbody>
       </table>
     );
   };

   export default CryptoTable;
   ```

3. **CryptoChart.js:**
   ```jsx
   import React, { useEffect, useState } from 'react';
   import { Line } from 'react-chartjs-2';
   import axios from 'axios';

   const CryptoChart = ({ coinId }) => {
     const [chartData, setChartData] = useState({});

     useEffect(() => {
       const fetchChartData = async () => {
         const result = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`, {
           params: {
             vs_currency: 'usd',
             days: '7'
           }
         });

         const prices = result.data.prices.map(price => ({
           x: new Date(price[0]).toLocaleDateString(),
           y: price[1]
         }));

         setChartData({
           labels: prices.map(price => price.x),
           datasets: [
             {
               label: 'Precio (USD)',
               data: prices.map(price => price.y),
               borderColor: 'rgba(75,192,192,1)',
               fill: false
             }
           ]
         });
       };

       fetchChartData();
     }, [coinId]);

     return (
       <div>
         <h2>Gráfico de {coinId}</h2>
         <Line data={chartData} />
       </div>
     );
   };

   export default CryptoChart;
   ```

### Paso 4: Servicio para API

**cryptoService.js:**
```js
import axios from 'axios';

const getMarketData = () => {
  return axios.get('https://api.coingecko.com/api/v3/coins/markets', {
    params: {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: 10,
      page: 1,
      sparkline: false
    }
  });
};

export { getMarketData };
```

### Paso 5: Integrar Componentes en App.js

```jsx
import React from 'react';
import Header from './components/Header';
import CryptoTable from './components/CryptoTable';
import CryptoChart from './components/CryptoChart';

const App = () => {
  return (
    <div className="App">
      <Header />
      <CryptoTable />
      <CryptoChart coinId="bitcoin" />
    </div>
  );
};

export default App;
```

### Paso 6: Estilos y Ajustes Finales

Puedes agregar estilos en un archivo CSS separado o usar una biblioteca de estilos como Bootstrap o Material-UI para mejorar la apariencia de tu aplicación.

**styles.css:**
```css
body {
  font-family: Arial, sans-serif;
}

header {
  background-color: #282c34;
  padding: 20px;
  color: white;
  text-align: center;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}
```

### Paso 7: Ejecutar la Aplicación

Finalmente, ejecuta la aplicación para ver tu proyecto en acción:
```bash
npm start
```

¡Y eso es todo! Tienes un frontend básico para un tablero de criptomonedas. Puedes continuar expandiéndolo añadiendo más características, mejorando la UI y optimizando el rendimiento.
