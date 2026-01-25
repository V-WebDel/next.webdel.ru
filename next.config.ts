import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: [path.join(process.cwd(), "src/styles")],
    prependData: `
@use "variables" as *;
@use "mixins" as *;
`,
  },
};

export default nextConfig;
