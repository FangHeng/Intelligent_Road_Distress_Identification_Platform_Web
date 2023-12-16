const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/ws/place/v1/suggestion',
        createProxyMiddleware({
            target: 'https://apis.map.qq.com',
            changeOrigin: true,
        })
    );
};

