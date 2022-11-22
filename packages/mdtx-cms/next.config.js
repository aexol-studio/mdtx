const removeImports = require('next-remove-imports')();

/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  reactStrictMode: false,
  images: {
    domains: ['avatars.githubusercontent.com', 'github.githubassets.com'],
  },
};
module.exports = removeImports(nextConfig);
