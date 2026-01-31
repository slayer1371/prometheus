import { Request, Response, NextFunction } from "express";
import { requestCount } from "./requestCount";
import { activeRequestsGauge, httpRequestDurationMicroseconds } from "./activeRequests";


export const metricsmiddleware = (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    activeRequestsGauge.inc();


    res.on('finish', () => {
        const endTime = Date.now();
        console.log(`Request took ${endTime - startTime}ms`);

        // Increment request counter
        requestCount.inc({
            method: req.method,
            route: req.route ? req.route.path : req.path,
            status_code: res.statusCode
        });

        httpRequestDurationMicroseconds.observe({
            method: req.method,
            route: req.route ? req.route.path : req.path,
            code: res.statusCode
        }, endTime - startTime  )

        activeRequestsGauge.dec();

    });

    next();
};