import { OptionType, Product } from "../types";

const products: Product[] = [
  {
    id: "1",
    name: "Classic Logo Tee",
    description:
      "A comfortable cotton t-shirt featuring our iconic logo. Made from 100% organic cotton with a relaxed fit that's perfect for everyday wear.",
    price: 29.99,
    costPrice: 15,
    image: "https://picsum.photos/seed/tee/600/600",
    optionTypes: [OptionType.Color, OptionType.Size],
    variants: [
      { sku: "tee-blk-s", options: [{ type: OptionType.Color, value: "Black" }, { type: OptionType.Size, value: "S" }], price: 29.99, featured: true, image: "https://picsum.photos/seed/tee-black/600/600" },
      { sku: "tee-blk-m", options: [{ type: OptionType.Color, value: "Black" }, { type: OptionType.Size, value: "M" }], image: "https://picsum.photos/seed/tee-black/600/600" },
      { sku: "tee-blk-l", options: [{ type: OptionType.Color, value: "Black" }, { type: OptionType.Size, value: "L" }], image: "https://picsum.photos/seed/tee-black/600/600" },
      { sku: "tee-wht-s", options: [{ type: OptionType.Color, value: "White" }, { type: OptionType.Size, value: "S" }], featured: true, image: "https://picsum.photos/seed/tee-white/600/600" },
      { sku: "tee-wht-m", options: [{ type: OptionType.Color, value: "White" }, { type: OptionType.Size, value: "M" }], image: "https://picsum.photos/seed/tee-white/600/600" },
      { sku: "tee-wht-l", options: [{ type: OptionType.Color, value: "White" }, { type: OptionType.Size, value: "L" }], image: "https://picsum.photos/seed/tee-white/600/600" },
    ],
  },
  {
    id: "2",
    name: "Minimalist Hoodie",
    description:
      "Stay warm in style with this heavyweight hoodie. Features a kangaroo pocket, adjustable drawstring hood, and subtle embroidered branding.",
    price: 64.99,
    costPrice: 30,
    image: "https://picsum.photos/seed/hoodie/600/600",
    optionTypes: [OptionType.Color, OptionType.Size],
    variants: [
      { sku: "hoodie-gry-m", options: [{ type: OptionType.Color, value: "Gray" }, { type: OptionType.Size, value: "M" }], featured: true, image: "https://picsum.photos/seed/hoodie-gray/600/600" },
      { sku: "hoodie-gry-l", options: [{ type: OptionType.Color, value: "Gray" }, { type: OptionType.Size, value: "L" }], image: "https://picsum.photos/seed/hoodie-gray/600/600" },
      { sku: "hoodie-gry-xl", options: [{ type: OptionType.Color, value: "Gray" }, { type: OptionType.Size, value: "XL" }], image: "https://picsum.photos/seed/hoodie-gray/600/600" },
      { sku: "hoodie-nav-m", options: [{ type: OptionType.Color, value: "Navy" }, { type: OptionType.Size, value: "M" }], featured: true, image: "https://picsum.photos/seed/hoodie-navy/600/600" },
      { sku: "hoodie-nav-l", options: [{ type: OptionType.Color, value: "Navy" }, { type: OptionType.Size, value: "L" }], image: "https://picsum.photos/seed/hoodie-navy/600/600" },
      { sku: "hoodie-nav-xl", options: [{ type: OptionType.Color, value: "Navy" }, { type: OptionType.Size, value: "XL" }], image: "https://picsum.photos/seed/hoodie-navy/600/600" },
    ],
  },
  {
    id: "3",
    name: "Canvas Tote Bag",
    description:
      "A durable canvas tote bag perfect for groceries, books, or everyday carry. Reinforced handles and an interior pocket for small items.",
    price: 19.99,
    costPrice: 8,
    image: "https://picsum.photos/seed/tote/600/600",
    optionTypes: [OptionType.Color],
    variants: [
      { sku: "tote-natural", options: [{ type: OptionType.Color, value: "Natural" }], featured: true, image: "https://picsum.photos/seed/tote-natural/600/600" },
      { sku: "tote-black", options: [{ type: OptionType.Color, value: "Black" }], featured: true, image: "https://picsum.photos/seed/tote-black/600/600" },
    ],
  },
  {
    id: "4",
    name: "Snapback Cap",
    description:
      "A structured snapback cap with an embroidered front logo. Adjustable snap closure fits most head sizes comfortably.",
    price: 24.99,
    costPrice: 10,
    image: "https://picsum.photos/seed/cap/600/600",
    optionTypes: [OptionType.Color],
    variants: [
      { sku: "cap-blk", options: [{ type: OptionType.Color, value: "Black" }], featured: true, image: "https://picsum.photos/seed/cap-black/600/600" },
      { sku: "cap-wht", options: [{ type: OptionType.Color, value: "White" }], image: "https://picsum.photos/seed/cap-white/600/600" },
      { sku: "cap-red", options: [{ type: OptionType.Color, value: "Red" }], price: 27.99, costPrice: 12, featured: true, image: "https://picsum.photos/seed/cap-red/600/600" },
    ],
  },
  {
    id: "5",
    name: "Ceramic Mug",
    description:
      "Start your morning right with this 12oz ceramic mug. Dishwasher and microwave safe with a comfortable handle and matte finish.",
    price: 14.99,
    costPrice: 6,
    image: "https://picsum.photos/seed/mug/600/600",
    optionTypes: [OptionType.Color],
    variants: [
      { sku: "mug-wht", options: [{ type: OptionType.Color, value: "White" }], image: "https://picsum.photos/seed/mug-white/600/600" },
      { sku: "mug-blk", options: [{ type: OptionType.Color, value: "Black" }], image: "https://picsum.photos/seed/mug-black/600/600" },
      { sku: "mug-navy", options: [{ type: OptionType.Color, value: "Navy" }], image: "https://picsum.photos/seed/mug-navy/600/600" },
    ],
  },
  {
    id: "6",
    name: "Sticker Pack",
    description:
      "A set of 10 die-cut vinyl stickers featuring original designs. Waterproof and UV-resistant, perfect for laptops, water bottles, and more.",
    price: 9.99,
    costPrice: 4,
    image: "https://picsum.photos/seed/stickers/600/600",
    optionTypes: [],
    variants: [{ sku: "sticker-default", options: [] }],
  },
  {
    id: "7",
    name: "Zip-Up Jacket",
    description:
      "A lightweight zip-up jacket ideal for layering. Water-resistant shell with breathable mesh lining and zippered side pockets.",
    price: 79.99,
    costPrice: 35,
    image: "https://picsum.photos/seed/jacket/600/600",
    optionTypes: [OptionType.Color, OptionType.Size],
    variants: [
      { sku: "jacket-blk-m", options: [{ type: OptionType.Color, value: "Black" }, { type: OptionType.Size, value: "M" }], featured: true, image: "https://picsum.photos/seed/jacket-black/600/600" },
      { sku: "jacket-blk-l", options: [{ type: OptionType.Color, value: "Black" }, { type: OptionType.Size, value: "L" }], image: "https://picsum.photos/seed/jacket-black/600/600" },
      { sku: "jacket-olv-m", options: [{ type: OptionType.Color, value: "Olive" }, { type: OptionType.Size, value: "M" }], price: 84.99, featured: true, image: "https://picsum.photos/seed/jacket-olive/600/600" },
      { sku: "jacket-olv-l", options: [{ type: OptionType.Color, value: "Olive" }, { type: OptionType.Size, value: "L" }], price: 84.99, image: "https://picsum.photos/seed/jacket-olive/600/600" },
    ],
  },
  {
    id: "8",
    name: "Enamel Pin Set",
    description:
      "A collectible set of 3 hard enamel pins with butterfly clutch backs. Each pin features a unique design with vibrant colors.",
    price: 12.99,
    costPrice: 5,
    image: "https://picsum.photos/seed/pins/600/600",
    optionTypes: [],
    variants: [{ sku: "pins-default", options: [] }],
  },
];

export default products;
