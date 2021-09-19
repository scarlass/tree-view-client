// const { whenDev, whenProd } = require('@craco/craco');
const Wp = require("webpack");
const Swc = require("@swc/core");
const PJson = require("./package.json");
const TJson = require("./tsconfig.dummy.json").compilerOptions;

const CracoSwc = require("craco-swc");
const CracoAlias = require("craco-alias");
const path = require("path");

const BaseUrl = path.resolve(__dirname, TJson.baseUrl);

module.exports = {
    style: {
        postcss: {
            plugins: [require("tailwindcss"), require("autoprefixer")],
        },
    },
    plugin: [
        {
            plugin: CracoSwc,
            options: {
                /** @type {Swc.Config} */
                swcLoaderOptions: {
                    jsc: {
                        parser: {
                            syntax: "typescript",
                            decorators: true,
                            dynamicImport: true,
                            tsx: true,
                        },
                        keepClassNames: true,
                        target: "es2017",
                        transform: {
                            react: {
                                development:
                                    process.env.NODE_ENV === "development",
                                throwIfNamespace: true,
                            },
                            decoratorMetadata: true,
                            constModules: {
                                globals: {
                                    APP_ENV: process.env.NODE_ENV,
                                    APP_VERSION: PJson.version,
                                    APP_NAME: PJson.name,
                                },
                            },
                        },
                        paths: {
                            "@Style/*": ["src/style/*.css"],
                        },
                    },
                },
            },
        },
        {
            plugin: CracoAlias,
            options: {
                source: "tsconfig",
                baseUrl: "./",
                tsConfigPath: "./tsconfig.json",
            },
        },
    ],
    webpack: {
        alias: {
            "@Style": path.join(BaseUrl, "src/style"),
        },
        /**
         * @param {Wp.Configuration} config
         * @param {{env: Record<string, any>, paths: any}} args
         */
        configure(config, args) {
            config.externals = {
                react: "React",
                "react-dom": "ReactDOM",
            };
            return config;
        },
    },
};
