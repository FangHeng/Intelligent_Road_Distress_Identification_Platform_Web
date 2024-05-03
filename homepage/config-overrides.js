const { override, fixBabelImports} = require("customize-cra");
const addLessLoader = require("customize-cra-less-loader");

module.exports = override(
    fixBabelImports('import', {
                libraryName: 'antd',
                libraryDirectory: 'es',
                style: true,  // true 表示使用 less
            }),
    addLessLoader({

        lessLoaderOptions: {
            lessOptions: {
                javascriptEnabled: true,
                // modifyVars: { '@primary-color': '#59aef3' },
            },
        },
    })
);