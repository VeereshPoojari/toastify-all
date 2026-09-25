import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];
const external = [
    'react',
    'react/jsx-runtime',
    'react-dom',
    'vue',
    '@angular/core',
    '@angular/common',
    'react-native'
];

const createConfig = (input, outputDir = '') => {
    const outputPath = outputDir ? `dist/${outputDir}` : 'dist';
    const isTypeScript = input.includes('.ts');
    const isReact = outputDir === 'react';

    const outputs = [
        {
            file: `${outputPath}/index.js`,
            format: 'cjs',
            exports: 'named',
            sourcemap: true,
            banner: isReact ? "'use client';" : undefined
        },
        {
            file: `${outputPath}/index.esm.js`,
            format: 'esm',
            sourcemap: true,
            banner: isReact ? "'use client';" : undefined
        }
    ];

    // For the root package, also generate a browser UMD build for global CDN usage (unpkg/jsdelivr)
    if (!outputDir) {
        outputs.push({
            file: `${outputPath}/index.umd.js`,
            format: 'umd',
            name: 'ToastifyAll',
            exports: 'named',
            sourcemap: true
        });
    }

    return {
        input,
        output: outputs,
        plugins: [
            resolve({
                extensions,
                browser: outputDir !== 'react-native',
                preferBuiltins: false
            }),
            commonjs(),
            ...(isTypeScript ? [
                typescript({
                    tsconfig: './tsconfig.json',
                    declaration: true,
                    declarationDir: outputPath,
                    experimentalDecorators: true,
                    emitDecoratorMetadata: true,
                    target: 'ES2015',
                    module: 'ES2015',
                    noImplicitAny: false,
                    allowJs: true
                })
            ] : []),
            babel({
                extensions,
                babelHelpers: 'bundled',
                exclude: 'node_modules/**',
                presets: [
                    ['@babel/preset-env', {
                        targets: outputDir === 'react-native'
                            ? { node: '14' }
                            : { browsers: ['> 1%', 'last 2 versions'] }
                    }],
                    ['@babel/preset-react', { runtime: 'automatic' }],
                    ...(isTypeScript ? [['@babel/preset-typescript', {
                        allowDeclareFields: true
                    }]] : [])
                ],
                plugins: [
                    ['@babel/plugin-transform-class-properties', { loose: true }],
                    ...(isTypeScript ? [
                        ['@babel/plugin-proposal-decorators', { legacy: true }],
                        ['@babel/plugin-proposal-class-properties', { loose: true }]
                    ] : [])
                ]
            })
        ],
        external: (id) => {
            return external.some((ext) => id === ext || id.startsWith(`${ext}/`));
        }
    };
};

export default [
    createConfig('src/index.js'),
    createConfig('src/react/index.jsx', 'react'),
    createConfig('src/vue/index.js', 'vue'),
    createConfig('src/angular/index.ts', 'angular'),
    createConfig('src/react-native/index.jsx', 'react-native')
];