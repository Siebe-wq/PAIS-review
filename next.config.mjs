/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    '/**': ['./content/**/*'],
  },
  async rewrites() {
    // /reviews/<slug>.md is the raw markdown, matching /guide.md and /instructions.md.
    return [{ source: '/reviews/:slug.md', destination: '/reviews/:slug/md' }];
  },
};

export default nextConfig;
