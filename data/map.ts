import {FetchAllProductsResponse, FetchProductResponse} from "./types";
import {MergeConfigEntry, OptionType, Product, Variant} from "./types";
import {DELIVERY_FEE} from "@/lib/checkout/constants";

function generateSlug(options: {type: string; value: string}[]): string {
  return options
    .map(o => o.value)
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

type ProductListItem = FetchAllProductsResponse["data"][number];

export function mapToProduct(product: ProductListItem, details: FetchProductResponse): Product {
  const imageBase = `https://qikink-assets.s3.ap-south-1.amazonaws.com/clients/566629/clientProducts/${details.client_product_id}/images/`;

  return {
    id: String(details.client_product_id),
    name: product.client_product_title,
    description: "",
    price: Number(product.price_range.split(" - ")[0]) + DELIVERY_FEE,
    image: `${imageBase}${details.variants[0]?.variant_image ?? details.default_image}`,
    costPrice: details.product_price,
    optionTypes: details.options.map(o => o as OptionType),
    variants: details.variants.map(v => {
      const options: {type: OptionType; value: string}[] = [];
      if (details.options.includes("Color")) options.push({ type: OptionType.Color, value: v.color_name });
      if (details.options.includes("Size")) options.push({ type: OptionType.Size, value: v.size_name });
      return {
        sku: v.variant_sku,
        slug: generateSlug(options),
        options,
        price: Number(v.product_price) + DELIVERY_FEE,
        image: `${imageBase}${v.variant_image}`,
        costPrice: v.updated_base_price,
        sizeChartLink: details.size_chart_link ?? undefined,
      };
    }),
  };
}

export function applyMerges(products: Product[], mergeConfig: MergeConfigEntry[]): Product[] {
  const mergedIds = new Set(mergeConfig.flatMap(m => m.products.map(p => p.product_id)));
  const result = products.filter(p => !mergedIds.has(p.id));

  for (const merge of mergeConfig) {
    const sourceProducts = merge.products.map(mp => {
      const found = products.find(p => p.id === mp.product_id);
      if (!found) throw new Error(`Product ${mp.product_id} not found for merge "${merge.title}"`);
      return { config: mp, product: found };
    });

    const first = sourceProducts[0].product;

    // Variant names from the merge config (e.g., "Color", "Print")
    const mergeVariantNames = new Set(
      merge.products.flatMap(p => Object.keys(p.variants))
    );

    // Auto-hide original options where no single source product has multiple values
    const optionHasMultipleValues = new Set<string>();
    for (const { product } of sourceProducts) {
      const perProductValues = new Map<string, Set<string>>();
      for (const v of product.variants) {
        for (const o of v.options) {
          if (!mergeVariantNames.has(o.type)) {
            if (!perProductValues.has(o.type)) perProductValues.set(o.type, new Set());
            perProductValues.get(o.type)!.add(o.value);
          }
        }
      }
      for (const [type, values] of perProductValues) {
        if (values.size > 1) optionHasMultipleValues.add(type);
      }
    }
    const hiddenOptions = new Set(
      [...new Set(sourceProducts.flatMap(({ product }) => product.optionTypes))]
        .filter(ot => !optionHasMultipleValues.has(ot))
    );

    // Collect option types: merge variant names + non-hidden original options
    const allOptionTypes: OptionType[] = [...mergeVariantNames as Set<OptionType>];
    for (const { product } of sourceProducts) {
      for (const ot of product.optionTypes) {
        if (!hiddenOptions.has(ot) && !allOptionTypes.includes(ot)) {
          allOptionTypes.push(ot);
        }
      }
    }

    // Merge all variants
    const mergedVariants = sourceProducts.flatMap(({ config, product }) =>
      product.variants.map(v => {
        // Start with merge config variant options
        const options: {type: OptionType; value: string}[] = Object.entries(config.variants)
          .map(([type, value]) => ({ type: type as OptionType, value }));
        // Add original options that aren't hidden or already covered by merge
        for (const o of v.options) {
          if (!hiddenOptions.has(o.type) && !mergeVariantNames.has(o.type)) {
            options.push(o);
          }
        }
        return {
          ...v,
          options,
          slug: generateSlug(options),
        };
      })
    );

    // Mark one variant per unique combination (excluding ignored fields) as featured
    const ignoredFields = new Set(merge.ignoredFeaturedFields ?? ["Size"]);
    const seenCombos = new Set<string>();
    for (const v of mergedVariants) {
      const key = v.options.filter(o => !ignoredFields.has(o.type)).map(o => `${o.type}:${o.value}`).join("|");
      if (!seenCombos.has(key)) {
        seenCombos.add(key);
        v.featured = true;
      }
    }

    if (merge.featuredSKU) {
      const idx = mergedVariants.findIndex(v => v.sku === merge.featuredSKU);
      if (idx >= 0) {
        mergedVariants[idx].featured = true;
        if (idx > 0) {
          const [featured] = mergedVariants.splice(idx, 1);
          mergedVariants.unshift(featured);
        }
      }
    }

    result.push({
      id: merge.id,
      name: merge.title,
      description: merge.description ?? "",
      price: first.price,
      image: mergedVariants[0].image!,
      costPrice: first.costPrice,
      optionTypes: allOptionTypes,
      variants: mergedVariants,
    });
  }

  return result;
}
