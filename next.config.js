/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.resolve.fallback = {
            fs: false,
            tls: false,
            net: false,
            lokijs: false,
            "pino-pretty": false,
            encoding: false
        };

        return config;
    },

}

module.exports = nextConfig
