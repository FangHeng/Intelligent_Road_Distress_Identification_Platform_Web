const { override } = require('customize-cra');

module.exports = override(
    (config, env) => {
        // 忽略特定的警告
        config.ignoreWarnings = [/Failed to parse source map/];

        // 你可以在这里添加更多的自定义 webpack 配置

        // 返回修改后的配置
        return config;
    }
);

