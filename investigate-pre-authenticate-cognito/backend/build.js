import * as esbuild from 'esbuild';

const entryPoints = [
  'pre-authentication-trigger/pre-authentication-trigger.ts',
  'post-authentication-trigger/post-authentication-trigger.ts',
  'post-confirmation-trigger/post-confirmation-trigger.ts',
];

await esbuild.build({
  entryPoints,
  bundle: true,
  outdir: 'dist',
  platform: 'node',
  target: 'node22', // Node.js 22を指定
  format: 'esm', // Node.js 22 なので ESM 形式
  minify: true, // ファイルサイズを小さくする
  sourcemap: true, // CloudWatch でのデバッグ用
  // AWS SDK v3 は Lambda ランタイムに含まれているため、
  // バンドルに含めず外部参照にすることで、デプロイパッケージを軽量化できます。
  external: ['@aws-sdk/*'],
  outbase: '.', // ディレクトリ構造を維持して dist に出力
});

console.log('⚡ Build complete!');
