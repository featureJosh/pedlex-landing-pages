import { bundle } from "../../lib/bundle.js";

export const data = { permalink: "/assets/css/main.css", eleventyExcludeFromCollections: true };
export const render = () => bundle("src/styles", ".css");
