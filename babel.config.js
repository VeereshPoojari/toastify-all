module.exports = {
    presets: [
        ['@babel/preset-env', {
            targets: {
                node: '14',
                browsers: ['> 1%', 'last 2 versions']
            },
            modules: false,
            loose: true
        }],
        ['@babel/preset-react', { runtime: 'automatic' }],
        ['@babel/preset-typescript', { allowDeclareFields: true }]
    ],
    plugins: [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-transform-class-properties', { loose: true }],
        ['@babel/plugin-transform-private-methods', { loose: true }],
        ['@babel/plugin-transform-private-property-in-object', { loose: true }]
    ],
    env: {
        test: {
            presets: [
                ['@babel/preset-env', {
                    targets: { node: 'current' },
                    modules: 'commonjs'
                }],
                ['@babel/preset-react', { runtime: 'automatic' }],
                ['@babel/preset-typescript', { allowDeclareFields: true }]
            ],
            plugins: [
                ['@babel/plugin-proposal-decorators', { legacy: true }],
                ['@babel/plugin-transform-class-properties', { loose: true }],
                ['@babel/plugin-transform-private-methods', { loose: true }],
                ['@babel/plugin-transform-private-property-in-object', { loose: true }]
            ]
        }
    }
};
