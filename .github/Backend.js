Desarrollar el backend para el CriptoDashboard implicará crear una API que proporcione datos sobre criptomonedas y permita a los usuarios gestionar sus portafolios. Vamos a utilizar Node.js con Express para esto.

### Paso 1: Configurar el Proyecto

1. **Crear una nueva carpeta para el backend:**
   ```bash
   mkdir backend
   cd backend
   ```

2. **Inicializar el proyecto de Node.js:**
   ```bash
   npm init -y
   ```

3. **Instalar dependencias necesarias:**
   ```bash
   npm install express axios mongoose dotenv
   ```

### Paso 2: Estructura del Proyecto

Organiza tu proyecto en carpetas:

```
backend/
│
├── config/
│   └── db.js
│
├── controllers/
│   └── cryptoController.js
│
├── models/
│   └── User.js
│
├── routes/
│   └── cryptoRoutes.js
│
├── .env
├── app.js
└── package.json
```

### Paso 3: Configurar la Base de Datos

1. **Crear el archivo de configuración de la base de datos:**

**config/db.js:**
```js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
```

2. **Configurar variables de entorno:**

**.env:**
```
MONGO_URI=your_mongodb_connection_string
```

### Paso 4: Definir el Modelo de Usuario

**models/User.js:**
```js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  portfolio: {
    type: Map,
    of: Number,
    default: {}
  }
});

module.exports = mongoose.model('User', UserSchema);
```

### Paso 5: Crear Controladores

**controllers/cryptoController.js:**
```js
const axios = require('axios');

const getCryptoData = async (req, res) => {
  try {
    const result = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 10,
        page: 1,
        sparkline: false
      }
    });
    res.json(result.data);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getCryptoData
};
```

### Paso 6: Definir Rutas

**routes/cryptoRoutes.js:**
```js
const express = require('express');
const { getCryptoData } = require('../controllers/cryptoController');

const router = express.Router();

router.get('/cryptos', getCryptoData);

module.exports = router;
```

### Paso 7: Configurar la Aplicación Principal

**app.js:**
```js
const express = require('express');
const connectDB = require('./config/db');
const cryptoRoutes = require('./routes/cryptoRoutes');
require('dotenv').config();

const app = express();

// Conectar a la base de datos
connectDB();

// Middleware para parsear JSON
app.use(express.json());

// Rutas
app.use('/api', cryptoRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

### Paso 8: Ejecutar el Backend

1. **Inicia el servidor:**
   ```bash
   node app.js
   ```

### Paso 9: Probar la API

Puedes usar herramientas como Postman para hacer solicitudes a tu API y verificar que todo funciona correctamente. Por ejemplo, una solicitud GET a `http://localhost:5000/api/cryptos` debería devolver datos sobre las criptomonedas.

### Paso 10: Conectar Frontend y Backend

Finalmente, en el frontend, cambia las solicitudes para que apunten a tu backend en lugar de directamente a la API de CoinGecko. Aquí tienes un ejemplo:

**Actualizar CryptoTable.js en el frontend:**
```jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CryptoTable = () => {
  const [cryptos, setCryptos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get('/api/cryptos');
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

Asegúrate de configurar los proxies en el frontend para evitar problemas con CORS:

**package.json del frontend:**
```json
{
  "name": "cripto-dashboard",
  "version": "1.0.0",
  "proxy": "http://localhost:5000",
  ...
}
```

¡Y eso es todo! Ahora tienes un backend funcional que proporciona datos sobre criptomonedas y un frontend que consume esos datos. Puedes continuar expandiendo el proyecto añadiendo más características y mejorando la funcionalidad.
