import client from "prom-client";

export const requestCount = new client.Counter({
    name: "http_request_count",
    help: "Total number of HTTP requests",
    labelNames: ["method", "route", "status_code"],
})

