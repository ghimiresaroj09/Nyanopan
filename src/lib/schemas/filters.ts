import { z } from "zod";
import type { Gender, SoleType, SortOption } from "@/types/product";

const csv = z
  .string()
  .optional()
  .default("")
  .transform((s) =>
    s
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean)
  );

const soleCsv = csv.transform((values) =>
  values.filter((v): v is SoleType => v === "leather" || v === "rubber")
);

const genderCsv = csv.transform((values) =>
  values.filter((v): v is Gender =>
    ["women", "men", "unisex", "girls", "boys"].includes(v)
  )
);

const sizeCsv = z
  .string()
  .optional()
  .default("")
  .transform((s) =>
    s
      .split(",")
      .map((v) => Number(v))
      .filter((v) => Number.isInteger(v) && v > 0)
  );

const sort = z
  .enum([
    "featured",
    "a-z",
    "z-a",
    "price-low-high",
    "price-high-low",
    "newest",
    "oldest",
  ])
  .optional();

export const searchParamsSchema = z.object({
  color: csv,
  sole: soleCsv,
  model: csv,
  gender: genderCsv,
  size: sizeCsv,
  sort,
});

export type ParsedSearchParams = z.infer<typeof searchParamsSchema>;

export function parseSearchParams(
  params: Record<string, string | string[] | undefined>
): ParsedSearchParams {
  const single: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(params)) {
    single[key] = Array.isArray(value) ? value[0] : value;
  }
  return searchParamsSchema.parse(single);
}

export type { Gender, SoleType, SortOption };
