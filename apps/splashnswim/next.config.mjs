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
  // Teacher invoice page: ship the PDF fonts with the API route and let
  // @react-pdf/renderer run as a normal Node package.
  outputFileTracingIncludes: {
    "/api/teacher-invoice": ["./lib/teacher-invoice/fonts/**"],
  },
  serverExternalPackages: ["@react-pdf/renderer"],
};

export default nextConfig;
