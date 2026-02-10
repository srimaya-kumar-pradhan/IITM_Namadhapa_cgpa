import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // This is required for GitHub Pages project sites (username.github.io/repo-name)
  // Remove this if you are deploying to a custom domain or user site (username.github.io)
  basePath: process.env.NODE_ENV === 'production' ? '/IITM_Namadhapa_cgpa' : '',
};

export default nextConfig;
