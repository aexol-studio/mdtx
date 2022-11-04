const removeImports = require('next-remove-imports')();
const withMDtx = require('mdtx-plugin-nextjs')({
  in: './content',
  out: './src',
  markdownToHtml: false,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  reactStrictMode: false,
  images: {
    domains: ['avatars.githubusercontent.com', 'github.githubassets.com'],
  },
};
module.exports = removeImports(withMDtx(nextConfig));
