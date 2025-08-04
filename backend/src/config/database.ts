type EnvType = 'local' | 'production';

const configDatabase = {
  local: {
    connection: process.env.DB_CONNECTION || 'mongodb',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 27017, 
    name: process.env.DB_NAME || 'app-share-music',
    pass: process.env.DB_PASS || '',
    dns: process.env.DB_DNS || '',
  },
  production: {
    connection: process.env.DB_CONNECTION_PROD || 'mongodb',
    host: process.env.DB_HOST_PROD || 'localhost',
    port: process.env.DB_PORT_PROD || 27017,
    name: process.env.DB_NAME_PROD || 'app-share-music',
    pass: process.env.DB_PASS_PROD || '',
    dns: process.env.DB_DNS_PROD || '',
  },
}


const getDatabaseConfig = () => {
  const env = (process.env.NODE_ENV === 'production' ? 'production' : 'local') as EnvType;
  return configDatabase[env];
}

export default getDatabaseConfig;