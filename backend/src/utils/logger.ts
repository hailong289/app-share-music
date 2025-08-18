import winston from 'winston';
import path from 'path';
import 'winston-mongodb';

const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const logger = winston.createLogger({
  level: process.env.APP_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  defaultMeta: { service: 'mern-backend' },
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs/error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs/combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),

    // new winston.transports.MongoDB({
    //   db: 'mongodb+srv://longdh2dev:hailong30100128@longdev.yxk8xva.mongodb.net/app-share-music',
    //   collection: 'logs',
    //   level: 'error',
    //   options: {
    //      useUnifiedTopology: true,
    //       useNewUrlParser: true,
    //   },
    //   metaKey: 'metadata',
    //   expireAfterSeconds: 2592000, // 30 days
    // }),
  ],
});
// phải có logger.error, logger.warn, logger.info, logger.http, logger.verbose
if (process.env.APP_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

export default logger;
