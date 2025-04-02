import react from "@vitejs/plugin-react";
import path from "path";

export const getDefaultEleventyConfig = (eleventyConfig) => {
  eleventyConfig.addPassthroughCopy({ "public/favicon.ico": "favicon.ico" });
  eleventyConfig.addPassthroughCopy({ "public/styles.css": "styles.css" });
  eleventyConfig.addPassthroughCopy("dist");
  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    }
  };
};

export const getDefaultViteConfig = () => ({
  plugins: [react()],
  root: ".",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve("react/main.jsx"),
      output: { entryFileNames: "main.js" }
    }
  },
  publicDir: false
});