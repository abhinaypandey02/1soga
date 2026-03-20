export enum OptionType {
  Color ="Color",
  Size ="Size",
}

export type VariantOption = {
  type: OptionType;
  value: string;
};

export type Variant = {
  sku: string;
  options: VariantOption[];
  price?: number;
  image?: string;
  costPrice?: number;
  featured?: boolean;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  optionTypes: OptionType[];
  variants: Variant[];
  costPrice: number;
};
