/** @type {import('next').NextConfig} */
const nextConfig = {
  // The engine packages ship as TypeScript/JS in their dist folders; Next
  // transpiles workspace packages as needed.
  transpilePackages: [
    "@swim-engine/engine-admin",
    "@swim-engine/engine-cms",
    "@swim-engine/engine-contracts",
    "@swim-engine/engine-db",
    "@swim-engine/engine-email",
  ],
};

export default nextConfig;
