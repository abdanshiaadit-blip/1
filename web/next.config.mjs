import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dir = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  // A marketing site with no server needs. Static export deploys anywhere and
  // is the fastest thing we can ship.
  output: 'export',
  images: { unoptimized: true },
  reactStrictMode: true,
  // This project lives inside a larger repository that has its own lockfile.
  outputFileTracingRoot: dir,
  // Declared here as well as in tsconfig: this project sits inside a larger
  // repository, and resolving the alias from the config leaves nothing to
  // infer.
  webpack: (config) => {
    config.resolve.alias['@'] = dir
    return config
  },
}
export default nextConfig
