import { createLogger, format, transports, } from 'winston';

const { combine, timestamp, simple, prettyPrint } = format;

const defaultFormat = combine(simple(), timestamp(), prettyPrint())

const logger = createLogger({
    level: 'info',
    format: defaultFormat,
    silent: process.env.ENV === 'test',
    transports: [
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/combined.log' }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({ format: defaultFormat }));
}

export default logger;
