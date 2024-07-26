import version from './package.json' assert { type: 'json' }

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.westtelco.com.mx',
        port: '',
        pathname: '/wp-content/**'
      }
    ]
  },
  publicRuntimeConfig: {
    version,
  }
};

export default nextConfig;
