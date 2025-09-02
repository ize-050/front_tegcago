/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        domains: ['example.com','localhost',"https://api-cs2.tegcargo.com","http://api-cs2.tegcargo.com","api-cs2.tegcargo.com",
          'api-cs.teglogistics.co.th','https://api-cs.teglogistics.co.th','http://api-cs.teglogistics.co.th'
        ], 
      },

    env:{
      URl_DOMAIN: process.env.NEXTAUTH_URL || 'http://localhost:3003',
      NEXT_PUBLIC_URL_API: 'http://localhost:3000',
    }
};

export default nextConfig;
