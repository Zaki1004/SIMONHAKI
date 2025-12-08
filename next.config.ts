import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   experimental: {
//     serverActions: {
//       allowedOrigins: ["https://90b42f9168c5.ngrok-free.app"],
//     },
//   },


//   async headers() {
//     return [
//       {
//         source: "/(.*)",
//         headers: [
//           { key: "Access-Control-Allow-Origin", value: "*" },
//           { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,DELETE,OPTIONS" },
//           { key: "Access-Control-Allow-Headers", value: "*" },
//         ],
//       },
//     ];
//   },
// };

// export default nextConfig;
