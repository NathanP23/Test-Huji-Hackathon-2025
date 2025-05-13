// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Expose this variable to the browser via process.env
  env: {
    NEXT_PUBLIC_API_BASE: process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000"
    // - NEXT_PUBLIC_* vars are inlined into client code by Next.js
    // - Fallback to localhost if not set
  },
  // You can add more Next.js settings here, e.g.:
  // reactStrictMode: true,              // enables additional React checks in development
  // swcMinify: true,                    // uses SWC compiler to minify output
};

module.exports = nextConfig;
