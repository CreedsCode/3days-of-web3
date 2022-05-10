/** @type {import('next').NextConfig} */

module.exports = {
  nextConfig: {
    reactStrictMode: true,
  },
  serverRuntimeConfig: {
    // Will only be available on the server side
    alchemywss: process.env.ALCHEMY, // Pass through env variables
  }
}
