import react from "@vitejs/plugin-react";
import path from "path";

export const getDefaultEleventyConfig = (eleventyConfig) => {
  return {
    dir: { input: "src", output: "_site", includes: "_includes" }
  };
};
