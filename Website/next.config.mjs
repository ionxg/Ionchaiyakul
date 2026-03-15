const isProd = process.env.NODE_ENV === "production"

const nextConfig = {
  output: "export",
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  basePath: isProd ? "/Ionchaiyakul" : "",
  assetPrefix: isProd ? "/Ionchaiyakul/" : "",
}

export default nextConfig