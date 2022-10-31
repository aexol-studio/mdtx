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
};
module.exports = removeImports(withMDtx(nextConfig));
