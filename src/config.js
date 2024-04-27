const config = {
    port: 3000,
    database: {
        user: 'postgres',
        host: 'localhost',
        password: 'postgres',
        port: 5432,
    },
    JWT_SECRET_KEY: "~!@#$%`12345",
    PBKDF2_SALT: "~!@#$%0123456789"
  }
  
  export default config;