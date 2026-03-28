export interface FetchAllProductsResponse{
  "draw": 1,
  "recordsTotal": string,
  "recordsFiltered": string,
  data: {
    client_product_id: string;
    product_id: string;
    client_id: string;
    size_id: string | null;
    color_id: string;
    product_price: string;
    client_sku: string | null;
    client_mockup_image: number;
    created_on: string;
    print_type_id: string;
    client_product_type_id: string;
    box_no: string | null;
    screen_design_id: string | null;
    generated_sku: string | null;
    parent_product_id: string | null;
    mockup_gender_id: string | null;
    is_compressed: string | null;
    is_new_flow: string;
    gender_name: string;
    category_name: string;
    base_price: string;
    shipping_weight_grms: string;
    tax_rate_product: string;
    designs: {
      client_design_id: string;
      width: number;
      height: number;
      design_code: string;
    }[];
    designs_details: string;
    colors_count: number;
    variant_count: number;
    price_range: string;
    client_product_title: string;
    size_range: string;
    isPush: boolean;
    print_type_name: string;
  }[]
}

export interface FetchProductResponse {
  client_id: string;
  color_id: string;
  product_id: string;
  product_price: number;
  client_product_type_id: number;
  created_on: string;
  print_type_id: string;
  client_product_id: number;
  mockup_generator_id: string;
  is_size_chart: boolean;
  size_chart_link: string | null;
  is_plain: string;
  is_back_has_desgin: string | null;
  is_front_has_design: string | null;
  is_other_placements_has_design: string | null;
  is_aop_product: string | null;
  product_title: string;
  mockup_name: string;
  variants: {
    client_product_id: number;
    size_id: string;
    color_id: string;
    product_id: string;
    product_price: string;
    client_id: string;
    product_sku: string;
    design_sku: string;
    client_product_variant_id: number;
    variant_sku: string;
    option1: string;
    color_name: string;
    option2: string;
    size_name: string;
    updated_base_price: number;
    variant_images: string[];
    variant_image: string;
  }[];
  tags: string[];
  designs: {
    client_product_id: number;
    client_design_id: string;
    client_design_width: string;
    client_design_height: string;
    client_design_placement: number;
    print_cost: string | null;
    placement_mockup_url: string | null;
    design_url: string;
    design_code: string;
  }[];
  default_placement: string;
  default_color: string;
  default_color_name: string;
  default_size_name: string;
  default_image: string;
  mockup_path: string;
  html_path: string;
  options: string[];
}

export type OptionType = "Color" | "Size" | (string & {});

export const OptionType = {
  Color: "Color" as OptionType,
  Size: "Size" as OptionType,
} as const;

export type VariantOption = {
  type: OptionType;
  value: string;
};

export type Variant = {
  sku: string;
  slug: string;
  options: VariantOption[];
  price: number;
  image: string;
  costPrice: number;
  featured?: boolean;
  sizeChartLink?: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  optionTypes: OptionType[];
  variants: Variant[];
};

export type MergeConfigEntry = {
  id: string;
  title: string;
  description?: string;
  featuredSKU?: string;
  ignoredFeaturedFields?: string[];
  products: {
    variants: Record<string, string>;
    product_id: string;
  }[];
};
