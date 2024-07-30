/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        domains: ['example.com','localhost',"https://api-cs2.tegcargo.com","http://api-cs2.tegcargo.com","api-cs2.tegcargo.com"], 
       
      },
};

export default nextConfig;
