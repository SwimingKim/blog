// const withBundleAnalyzer = require("@next/bundle-analyzer")({
//   enabled: process.env.ANALYZE === "true",
// });

const repo_info = process.env.GITHUB_REPOSITORY;
/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/"+repo_info.split("/")[1],
  reactStrictMode: false,
  swcMinify: true,
  env: {
    BASE_URL: process.env.BASE_URL,
    NOTION_API_KEY: process.env.NOTION_API_KEY,
    NOTION_DATABSE_ID: process.env.NOTION_DATABSE_ID,
    NOTION_HOMEPAGE_ID: process.env.NOTION_HOMEPAGE_ID,
    GA_TRACKING_ID: process.env.GA_TRACKING_ID,
    GITHUB_REPOSITORY: process.env.GITHUB_REPOSITORY,
    COMMENT_REPOSITORY: process.env.COMMENT_REPOSITORY,
    ANALYZE: process.env.ANALYZE,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  images: {
    loader: 'akamai',
    path: ''
  }
};

// module.exports = withPlugins([], nextConfig);

module.exports = () => {
  // const plugins = [withBundleAnalyzer];
  // const config = plugins.reduce((acc, next) => next(acc), {
  //   ...nextConfig,
  // });
  // return config;
  return nextConfig;
};
