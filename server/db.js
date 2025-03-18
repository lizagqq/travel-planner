const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',       // Твой пользователь базы данных
    host: 'localhost',      // Адрес сервера базы данных
    database: 'travel_planner', // Имя базы данных
    password: '1111',  // Пароль пользователя
    port: 5432,             // Порт подключения (по умолчанию 5432)
});

module.exports = pool;
