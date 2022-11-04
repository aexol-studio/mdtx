const withMDtx = require('mdtx-plugin-nextjs')({
  in: './content',
  out: './src',
  markdownToHtml: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  reactStrictMode: false,
};
module.exports = withMDtx(nextConfig);
