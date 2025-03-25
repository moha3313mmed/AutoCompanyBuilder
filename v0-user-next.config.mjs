/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // تحسين حجم الحزمة
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // تحسين تحميل الصور
  images: {
    domains: ['placeholder.com', 'via.placeholder.com'],
  },
  // تحسين تحميل الوحدات
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react'],
  },
  // تكوين webpack لتحسين الأداء
  webpack: (config, { isServer }) => {
    // تحسين حجم الحزمة لمكتبة monaco-editor
    if (!isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        monaco: {
          test: /[\\/]node_modules[\\/](monaco-editor|@monaco-editor)[\\/]/,
          name: 'monaco-editor-chunk',
          priority: 10,
          chunks: 'async',
          enforce: true,
        },
      };
    }
    return config;
  },
};

export default nextConfig;

