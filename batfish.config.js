const webpack = require('webpack');
const mapboxAssembly = require('@mapbox/mbx-assembly');
const path = require('path');
const apiNavigation = require('./docs/data/api-navigation');
const { buildApiSearch } = require('./docs/util/build-api-search');
const {
    mbxTaggerBatfish
} = require('@mapbox/remark-lint-mapbox/frontmatter/mbx-tagger-batfish');
const {
    buildNavigation,
    buildTopics
} = require('@mapbox/dr-ui/helpers/batfish/index.js');
const pluginTopics = require('./docs/data/build-plugin-topics');
const topicsOrder = require('./docs/data/topics.json');

const siteBasePath = '/mapbox-gl-js';
module.exports = () => {
    const config = {
        siteBasePath: siteBasePath,
        siteOrigin: 'https://docs.mapbox.com',
        pagesDirectory: `${__dirname}/docs/pages`,
        outputDirectory: path.join(__dirname, '_site'),
        browserslist: mapboxAssembly.browsersList,
        postcssPlugins: mapboxAssembly.postcssPipeline.plugins,
        productionDevtool: 'source-map',
        stylesheets: [
            require.resolve('@mapbox/mbx-assembly/dist/assembly.css'),
            require.resolve('@mapbox/dr-ui/css/docs-prose.css'),
            `${__dirname}/docs/components/site.css`,
            require.resolve('@mapbox/dr-ui/css/prism.css'),
            `${__dirname}/vendor/docs-page-shell/page-shell-styles.css`
        ],
        applicationWrapperPath: `${__dirname}/docs/components/application-wrapper.js`,
        webpackLoaders: [
            // Use raw loader to get the HTML string contents of examples
            {
                test: /\.html$/,
                use: 'raw-loader'
            }
        ],
        ignoreWithinPagesDirectory: ['example/*.html'],
        webpackPlugins: [
            // Make environment variables available within JS that Webpack compiles.
            new webpack.DefinePlugin({
                // DEPLOY_ENV is used in config to pick between local/production.
                'process.env.DEPLOY_ENV': `"${process.env.DEPLOY_ENV}"`
            })
        ],
        inlineJs: [
            {
                filename: `${__dirname}/vendor/docs-page-shell/page-shell-script.js`
            }
        ],
        jsxtremeMarkdownOptions: {
            getWrapper: () => {
                return path.join(__dirname, './docs/components/page-shell.js');
            },
            rehypePlugins: [
                require('rehype-slug'),
                require('@mapbox/rehype-prism'),
                require('@mapbox/dr-ui/plugins/add-links-to-headings'),
                require('@mapbox/dr-ui/plugins/create-sections'),
                require('@mapbox/dr-ui/plugins/make-table-scroll')
            ]
        },
        dataSelectors: {
            // generate mapbox metadata for every page
            mbxMeta: (data) => mbxTaggerBatfish(data),
            apiSearch: () => buildApiSearch(),
            apiNavigation: () => apiNavigation,
            navigation: (data) => buildNavigation(siteBasePath, data),
            topics: (data) =>
                buildTopics(
                    data,
                    {
                        // append plugin topics
                        '/mapbox-gl-js/plugins/': { topics: pluginTopics }
                    },
                    // order of topics on examples page
                    topicsOrder
                )
        },
        devBrowserslist: false,
        babelInclude: [
            'documentation',
            '@mapbox/mapbox-gl-style-spec',
            'fuse.js'
        ],
        webpackStaticIgnore: [/util\/util\.js$/]
    };

    // Local builds treat the `dist` directory as static assets, allowing you to test examples against the
    // local branch build. Non-local builds ignore the `dist` directory, and examples load assets from the CDN.
    config.unprocessedPageFiles = ['**/dist/**/*.*'];
    if (process.env.DEPLOY_ENV !== 'local') {
        config.ignoreWithinPagesDirectory.push('**/dist/**/*.*');
    }

    return config;
};
