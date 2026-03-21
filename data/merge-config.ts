import {MergeConfigEntry} from "./types";

export const mergeConfig: MergeConfigEntry[] = [
  {
    id:"soga-tee",
    title: "SOGA Tee",
    description: "The original SOGA statement piece. Heavy-weight cotton that says you chose the scenic side of the NCR — and you'd do it again.",
    products: [
      { variants: { Material:"Oversized (Thick)" }, product_id: "31957597" },
      { variants: { Material:"Oversized (Thin)" }, product_id: "31957600" },
    ],
    featuredSKU:"31957597-UOsTMRnHs-OFw-S",
  },

  {
    id:"caps",
    title: "Caps",
    description: "Rep Soga on your head. Structured fit, bold prints — because looking this good in the NCR should be illegal (and in some sectors, it might be).",
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
    description: "For the ones who showed up before Google Maps even acknowledged us. The sogaboy tee is a badge of honour — earned, not given.",
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
    description: "Cropped, fitted, unapologetic. The sogabaddie baby tee was made for the ones who run things — from Rajnagar Extension to the rest of the NCR.",
    products: [
      { variants: { Text:"Pink" }, product_id: "31957404" },
      { variants: { Text:"Red" }, product_id: "31957397" },
    ],
    featuredSKU:"31957404-FBbyTrnHs-LBp-S"
  },

  {
    id:"mugs",
    title: "Mugs",
    description: "Start every morning with a reminder that you live in the most beautiful part of the NCR. Ceramic, sturdy, and tougher than Soga's roads.",
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
    description: "Bold text, bolder energy. The sogabaddie tee is for anyone who knows they're that girl — Noida girls could never.",
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
