import { bundle } from "../../lib/bundle.js";

// Every file in src/scripts/ is an IIFE module; order is 00-*, then components/, sections/.
export const data = { permalink: "/assets/js/main.js", eleventyExcludeFromCollections: true };
export const render = () => `"use strict";\n${bundle("src/scripts", ".js")}`;
