/** @type {import('next').NextConfig} */
const BUCKET_NAME = process.env.BUCKET_NAME;
const nextConfig = {
    images: {
        domains: [`${BUCKET_NAME}.s3.amazonaws.com`],
    },
};
export default nextConfig;
