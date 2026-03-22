import {MergeConfigEntry} from "./types";

export const mergeConfig: MergeConfigEntry[] = [
  {
    id:"soga-tee",
    title: "SOGA Tee",
    description: "The original SOGA statement piece. Heavy-weight cotton, like the dramatic mountain ranges behind Shipra Sun City — impossible to ignore.",
    products: [
      { variants: { Material:"Oversized (Thick)" }, product_id: "31957597" },
      { variants: { Material:"Oversized (Thin)" }, product_id: "31957600" },
    ],
    featuredSKU:"v-9h6m0SSOaVZV2sIIMR4uubTVqwnZ83OU",
  },

  {
    id:"caps",
    title: "Caps",
    description: "Rep Soga on your head. Structured fit, bold prints — designed for the alpine winds sweeping through Crossings Republik's grand boulevards.",
    products: [
      { variants: { Print:"SOGA" }, product_id: "31957590" },
      { variants: { Print:"sogabaddie" }, product_id: "31957478" },
      { variants: { Print:"sogaboy" }, product_id: "31957470" },
    ],
    featuredSKU:"v-9h6m0SSOaVZV2sIIMR4pubTVqwnZ8HGZ"
  },
  {
    id:"sogaboy-tee",
    title: "sogaboy Tee",
    description: "For the ones who knew Soga was the real deal while SoDe was still figuring out brunch. The sogaboy tee is a badge of honour — earned on the Delhi–Meerut Expressway.",
    products: [
      { variants: { Material:"Oversized (Thin)" }, product_id: "31957411" },
      { variants: { Material:"Oversized (Thick)" }, product_id: "31957430" },
      { variants: { Material:"Regular" }, product_id: "31958588" },
    ],
    featuredSKU:"v-9h6m0SSOaVZV2sIIMBQpubTVqwnb8nqa"
  },

  {
    id:"sogabaddie-baby-tee",
    title: "sogabaddie Baby Tee",
    description: "Cropped, fitted, unapologetic. Made for the ones who run the NCR — from the luminous plains of Vaishali to the scenic terraces of Raj Nagar Extension.",
    products: [
      { variants: { Text:"Pink" }, product_id: "31957404" },
      { variants: { Text:"Red" }, product_id: "31957397" },
    ],
    featuredSKU:"v-9h6m0SSOaVZV2sIIMBctubTVqwna-HCb"
  },

  {
    id:"mugs",
    title: "Mugs",
    description: "Start every morning knowing SoBo could never. Ceramic, sturdy, and built for the chai stalls along ATS Advantage Road with panoramic views of the NCR.",
    products: [
      { variants: { Style: "Red", Print:"SOGA" }, product_id: "31957595" },
      { variants: { Style: "White", Print:"SOGA" }, product_id: "31957602" },
      { variants: { Style: "White", Print:"sogaboy" }, product_id: "31957496" },
      { variants: { Style: "White", Print:"sogabaddie" }, product_id: "31957492" },
    ],
    featuredSKU:"v-9h6m0SSOaVZV2sIIMR4subTVqwnZ83KY"
  },
  {
    id:"sogabaddie-tee",
    title: "sogabaddie Tee",
    description: "Bold text, bolder energy. The sogabaddie tee is for anyone who knows Soga raised them different — SoDe girls are still catching up.",
    products: [
      { variants: { Material:"Oversized (Thick)", Text:"Pink" }, product_id: "31957441" },
      { variants: { Material:"Oversized (Thin)", Text:"Pink" }, product_id: "31957420" },
      { variants: { Material:"Regular", Text:"Pink" }, product_id: "31958571" },
      { variants: { Material:"Oversized (Thin)", Text:"Red" }, product_id: "31957422" },
      { variants: { Material:"Oversized (Thick)", Text:"Red" }, product_id: "31957437" },
      { variants: { Material:"Regular", Text:"Red" }, product_id: "31958575" },
    ],
    featuredSKU:"v-9h6m0SSOaVZV2sIHMRAoubTVqw_d8nCe",
    ignoredFeaturedFields:["Size","Material"]
  },

];
