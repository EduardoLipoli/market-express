import { 
  Droplet, Sparkles, ShoppingBasket, Snowflake, Leaf, 
  Wrench, Package, Apple, Carrot, Beef, Milk, Croissant, 
  Coffee, Grape, Home, Briefcase, Heart, Star, Zap, Gift
} from "lucide-react";

// Mapeamento de Ícones disponíveis para o usuário escolher
export const AVAILABLE_ICONS = {
  Droplet, Sparkles, ShoppingBasket, Snowflake, Leaf, Wrench, Package, 
  Apple, Carrot, Beef, Milk, Croissant, Coffee, Grape, Home, Briefcase, 
  Heart, Star, Zap, Gift
};

// Cores disponíveis (com as classes completas do Tailwind)
export const AVAILABLE_COLORS = [
  { id: "cyan", name: "Ciano", text: "text-cyan-400", bg: "bg-cyan-400/10" },
  { id: "violet", name: "Violeta", text: "text-violet-400", bg: "bg-violet-400/10" },
  { id: "amber", name: "Âmbar", text: "text-amber-400", bg: "bg-amber-400/10" },
  { id: "sky", name: "Azul", text: "text-sky-400", bg: "bg-sky-400/10" },
  { id: "emerald", name: "Verde", text: "text-emerald-400", bg: "bg-emerald-400/10" },
  { id: "stone", name: "Cinza", text: "text-stone-400", bg: "bg-stone-400/10" },
  { id: "rose", name: "Rosa", text: "text-rose-400", bg: "bg-rose-400/10" },
  { id: "orange", name: "Laranja", text: "text-orange-400", bg: "bg-orange-400/10" },
  { id: "fuchsia", name: "Fúcsia", text: "text-fuchsia-400", bg: "bg-fuchsia-400/10" },
];

// Categorias padrão (caso o usuário seja novo e não tenha nenhuma)
export const INITIAL_CATEGORIES = [
  { id: "cat_1", name: "Higiene Pessoal", icon: "Droplet", color: "cyan" },
  { id: "cat_2", name: "Limpeza", icon: "Sparkles", color: "violet" },
  { id: "cat_3", name: "Mercearia", icon: "ShoppingBasket", color: "amber" },
  { id: "cat_4", name: "Frios e Laticínios", icon: "Snowflake", color: "sky" },
  { id: "cat_5", name: "Temperos", icon: "Leaf", color: "emerald" },
  { id: "cat_6", name: "Hortifruti", icon: "Carrot", color: "emerald" },
  { id: "cat_7", name: "Carnes", icon: "Beef", color: "rose" },
];