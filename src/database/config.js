
module.exports = {
    development: {
      dialect: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'psp',
      define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true,
  
      },
    },
    test: {
      dialect: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'psp',
      define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true,
  
      },
    },
    production: {
      dialect: 'postgres',
      host: process.env.DB_HOST,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true,
  
      },
    },
  };
  