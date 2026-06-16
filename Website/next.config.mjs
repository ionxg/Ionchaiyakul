const isProd = process.env.NODE_ENV === "production"

const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: isProd ? "/Ionchaiyakul" : "",
  assetPrefix: isProd ? "/Ionchaiyakul/" : "",
}

export default nextConfig