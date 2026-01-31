"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metricsmiddleware = void 0;
const requestCount_1 = require("./requestCount");
const activeRequests_1 = require("./activeRequests");
const metricsmiddleware = (req, res, next) => {
    const startTime = Date.now();
    activeRequests_1.activeRequestsGauge.inc();
    res.on('finish', () => {
        const endTime = Date.now();
        console.log(`Request took ${endTime - startTime}ms`);
        // Increment request counter
        requestCount_1.requestCount.inc({
            method: req.method,
            route: req.route ? req.route.path : req.path,
            status_code: res.statusCode
        });
        activeRequests_1.httpRequestDurationMicroseconds.observe({
            method: req.method,
            route: req.route ? req.route.path : req.path,
            code: res.statusCode
        }, endTime - startTime);
        activeRequests_1.activeRequestsGauge.dec();
    });
    next();
};
exports.metricsmiddleware = metricsmiddleware;
