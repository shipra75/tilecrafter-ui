export function healthCheck(req, res) {
    const healthData = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: Date.now()
    };
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(healthData));
}