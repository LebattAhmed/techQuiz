import { redirect } from "next/navigation";

// La liste des catégories est sur la page d'accueil.
export default function CategoriesPage() {
  redirect("/#categories");
}
