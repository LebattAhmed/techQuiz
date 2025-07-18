import SubcategorySelector from "@/components/subcategorie-selector";

export default function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  return <SubcategorySelector category={params.category} />;
}
