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
  }
};

export default nextConfig;
