
export const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        if (!origin || origin === 'null') {
            return callback(null, true);
        }

        // List of allowed origins
        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:5001',
            'https://app-share-music.vercel.app'
        ];

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow cookies to be sent
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
        'X-CSRF-Token'
    ],
    exposedHeaders: [
        'Content-Length',
        'X-JSON',
        'X-Requested-With',
        'Authorization'
    ],
    maxAge: 3600, // Cache preflight response for 1 hour
    preflightContinue: false, // Pass the CORS preflight response to the next handler
    optionsSuccessStatus: 204 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};
