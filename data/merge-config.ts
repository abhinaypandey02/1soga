import {MergeConfigEntry} from "../app/types";

export const mergeConfig: MergeConfigEntry[] = [
  {
    id:"soga-tee",
    title: "SOGA Tee",
    products: [
      { variants: { Material:"Oversized (Thick)" }, product_id: "31957597" },
      { variants: { Material:"Oversized (Thin)" }, product_id: "31957600" },
    ],
    featuredSKU:"31957597-UOsTMRnHs-OFw-S",
  },

  {
    id:"caps",
    title: "Caps",
    products: [
      { variants: { Print:"SOGA" }, product_id: "31957590" },
      { variants: { Print:"sogabaddie" }, product_id: "31957478" },
      { variants: { Print:"sogaboy" }, product_id: "31957470" },
    ],
    featuredSKU:"31957590-UBsCap-Nb-NA"
  },
  {
    id:"sogaboy-tee",
    title: "sogaboy Tee",
    products: [
      { variants: { Material:"Oversized (Thin)" }, product_id: "31957411" },
      { variants: { Material:"Oversized (Thick)" }, product_id: "31957430" },
      { variants: { Material:"Regular" }, product_id: "31958588" },
    ],
    featuredSKU:"31957430-UOsTMRnHs-Wh-S"
  },

  {
    id:"sogabaddie-baby-tee",
    title: "sogabaddie Baby Tee",
    products: [
      { variants: { Text:"Pink" }, product_id: "31957404" },
      { variants: { Text:"Red" }, product_id: "31957397" },
    ],
    featuredSKU:"31957404-FBbyTrnHs-LBp-S"
  },

  {
    id:"mugs",
    title: "Mugs",
    products: [
      { variants: { Style: "Red", Print:"SOGA" }, product_id: "31957595" },
      { variants: { Style: "White", Print:"SOGA" }, product_id: "31957602" },
      { variants: { Style: "White", Print:"sogaboy" }, product_id: "31957496" },
      { variants: { Style: "White", Print:"sogabaddie" }, product_id: "31957492" },
    ],
    featuredSKU:"31957595-UCCM-Wh-Red"
  },
  {
    id:"sogabaddie-tee",
    title: "sogabaddie Tee",
    products: [
      { variants: { Material:"Oversized (Thick)", Text:"Pink" }, product_id: "31957441" },
      { variants: { Material:"Oversized (Thin)", Text:"Pink" }, product_id: "31957420" },
      { variants: { Material:"Regular", Text:"Pink" }, product_id: "31958571" },
      { variants: { Material:"Oversized (Thin)", Text:"Red" }, product_id: "31957422" },
      { variants: { Material:"Oversized (Thick)", Text:"Red" }, product_id: "31957437" },
      { variants: { Material:"Regular", Text:"Red" }, product_id: "31958575" },
    ],
    featuredSKU:"31958571-UCoSRnHs-Bk-S",
    ignoredFeaturedFields:["Size","Material"]
  },

];
