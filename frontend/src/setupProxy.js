const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        createProxyMiddleware('/irdip/',{
            target: 'http://10.236.101.25:8000',
            changeOrigin: true,
        }),
        createProxyMiddleware('/ws/place/v1/suggestion',{
            target: 'https://apis.map.qq.com',
            changeOrigin: true,
        })
    );
};