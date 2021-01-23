const defaultSettings = {
  dialect: 'postgres',
  host: process.env.DATABASE_HOST,
  post: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  logging: false,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,

  },
  pool: {
    max: 50,
    min: 1,
  },
};

module.exports = {
  development: defaultSettings,
  test: defaultSettings,
  production: defaultSettings,
};
