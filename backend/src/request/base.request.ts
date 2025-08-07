import { Request, Response, NextFunction } from 'express';

class BaseRequest {
    public rule: () => any[];
    constructor(rule: () => any[]) {
        this.rule = rule;
    }
    /**
     * Validates the request data against the defined schema.
     * @returns {Function} Middleware function for validation.
     */
    public validate() {
        return async (req: Request, res: Response, next: NextFunction) => {
            let errors: string | any[] = []
            for (const validation of this.rule()) {
                const result = await validation.run(req);
                if (!result.isEmpty()) {
                    errors = [...errors, ...result.array()];
                }
            }

            if (errors.length > 0) {
                return res.status(400).json({ errors });
            }

            next();
        };
    }
}

export default BaseRequest;