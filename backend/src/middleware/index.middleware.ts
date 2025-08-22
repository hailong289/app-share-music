import { corsOptions } from "../config/cors";
import { BodyParsingMiddleware } from "@middleware/body-parsing.middleware";
import { LoggingMiddleware } from "@middleware/logging.middleware";
import { RateLimitMiddleware } from "@middleware/ratelimit.middleware";
import cors from 'cors';
import helmet from 'helmet';
import { StaticFileMiddleware } from "./staticfile.middleware";

class MiddlewareSetup {

    public static init(app: any): void {
        // Bảo mật middleware
        app.use(helmet());

        // CORS
        app.use(cors(corsOptions));
        // 🔹 Cho phép Express tin header X-Forwarded-For từ reverse proxy (Vercel, Nginx, Cloudflare...)
        app.set('trust proxy', 1);

        // Rate limiting
        app.use('/api', RateLimitMiddleware.applyRateLimit());

        // get static file
        app.use('/uploads', StaticFileMiddleware.serveUploads(), StaticFileMiddleware.handleFileNotFound());

        // Body parsing
        app.use(BodyParsingMiddleware.handleBodyParsing);

        // Request logging
        app.use(LoggingMiddleware.logRequest);
    }
}

export default MiddlewareSetup;
