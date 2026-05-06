import { useState, useRef, useEffect } from "react";
import { useOutletContext, useNavigate, useLocation } from "react-router-dom";
import { Search, Plus, Check, Package } from "lucide-react";
import { DEFAULT_PRODUCTS } from "../utils/constants";
import { AVAILABLE_ICONS, AVAILABLE_COLORS } from "../utils/categoryConfig";

export function AddProduct() {
  const {
    currentList,
    handleSaveProduct,
    handleEditProduct,
    userCategories,
    userProducts,
    saveUserProductsToFirebase,
  } = useOutletContext();
  const navigate = useNavigate();
  const location = useLocation();
  const productToEdit = location.state?.productToEdit || null;

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const [pendingItems, setPendingItems] = useState({});
  const [manualMode, setManualMode] = useState(false);
  const [saveToCatalog, setSaveToCatalog] = useState(true); // <-- Checkbox de salvar no catálogo
  const [manualForm, setManualForm] = useState({
    name: "",
    category: userCategories[0]?.name || "",
    quantity: 1,
    quantityType: "Unidade",
  });
  const inputRef = useRef(null);

  // 1. Constrói o banco de pesquisa unindo o padrão com os produtos do usuário
  const buildSearchIndex = () => {
    const index = [];
    for (const [cat, products] of Object.entries(DEFAULT_PRODUCTS)) {
      products.forEach((name) => index.push({ name, category: cat }));
    }
    userProducts.forEach((p) => {
      // Evita duplicados caso o usuário adicione algo que já tem no padrão
      if (
        !index.some((item) => item.name.toLowerCase() === p.name.toLowerCase())
      ) {
        index.push({ name: p.name, category: p.category });
      }
    });
    return index;
  };

  const ALL_PRODUCTS = buildSearchIndex();
  const ALL_CATEGORIES = userCategories.map((c) => c.name);

  // Função para pegar estilo dinâmico
  const getDynamicStyle = (categoryName) => {
    const cat = userCategories.find((c) => c.name === categoryName);
    if (cat) {
      return {
        Icon: AVAILABLE_ICONS[cat.icon] || Package,
        colorTheme:
          AVAILABLE_COLORS.find((c) => c.id === cat.color) ||
          AVAILABLE_COLORS[0],
      };
    }
    return {
      Icon: Package,
      colorTheme: AVAILABLE_COLORS[5] /* Stone genérico */,
    };
  };

  useEffect(() => {
    if (productToEdit) {
      setManualMode(true);
      setManualForm({
        name: productToEdit.name,
        category: productToEdit.category,
        quantity: productToEdit.quantity,
        quantityType: productToEdit.quantityType,
      });
    }
  }, [productToEdit]);

  if (!currentList)
    return (
      <div className="text-center mt-10 text-white/50">
        Crie uma lista primeiro.
      </div>
    );

  const trimmedQuery = query.trim().toLowerCase();
  const filteredProducts = trimmedQuery
    ? ALL_PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(trimmedQuery) ||
          p.category.toLowerCase().includes(trimmedQuery),
      )
    : activeCategory
      ? ALL_PRODUCTS.filter((p) => p.category === activeCategory)
      : [];

  function toggleItem(product) {
    const key = product.name;
    setPendingItems((prev) => {
      const next = { ...prev };
      if (next[key]) delete next[key];
      else next[key] = product;
      return next;
    });
  }

  function handleSaveAll() {
    const items = Object.values(pendingItems).map((item) => ({
      id: Date.now().toString() + Math.random().toString(),
      name: item.name,
      category: item.category,
      quantity: 1,
      quantityType: "Unidade",
      completed: false,
    }));
    handleSaveProduct(items);
    navigate("/");
  }

  async function handleManualSave(e) {
    e.preventDefault();
    if (!manualForm.name || !manualForm.category) return;

    if (productToEdit) {
      handleEditProduct(productToEdit.id, {
        name: manualForm.name,
        category: manualForm.category,
        quantity: Number(manualForm.quantity),
        quantityType: manualForm.quantityType,
      });
    } else {
      const newManualItem = {
        id: Date.now().toString() + Math.random().toString(),
        name: manualForm.name,
        category: manualForm.category,
        quantity: Number(manualForm.quantity),
        quantityType: manualForm.quantityType,
        completed: false,
      };
      const pendingArray = Object.values(pendingItems).map((item, index) => ({
        id: Date.now().toString() + index + Math.random().toString(),
        name: item.name,
        category: item.category,
        quantity: 1,
        quantityType: "Unidade",
        completed: false,
      }));

      handleSaveProduct([...pendingArray, newManualItem]);

      // Salva no catálogo pessoal se o usuário marcou a caixinha
      if (saveToCatalog) {
        const productExists = userProducts.some(
          (p) => p.name.toLowerCase() === manualForm.name.toLowerCase(),
        );
        if (!productExists) {
          saveUserProductsToFirebase([
            ...userProducts,
            {
              id: Date.now().toString(),
              name: manualForm.name,
              category: manualForm.category,
            },
          ]);
        }
      }
    }
    navigate("/");
  }

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] bg-[#161616] rounded-2xl border border-white/5 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
      {manualMode || productToEdit ? (
        <div className="flex flex-col flex-1 overflow-y-auto">
          {!productToEdit && (
            <button
              onClick={() => setManualMode(false)}
              className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 px-5 pt-4 transition-colors w-fit"
            >
              ← Voltar à busca
            </button>
          )}

          <form
            onSubmit={handleManualSave}
            className="flex flex-col gap-4 p-5 pt-4"
          >
            <div>
              <label className="block text-xs text-white/50 mb-1.5 font-medium">
                Nome do produto
              </label>
              <input
                type="text"
                required
                value={manualForm.name}
                onChange={(e) =>
                  setManualForm((p) => ({ ...p, name: e.target.value }))
                }
                className="w-full bg-white/5 text-white border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary/60"
                placeholder="Ex: Azeite extra virgem"
              />
            </div>

            <div>
              <label className="block text-xs text-white/50 mb-1.5 font-medium">
                Categoria
              </label>
              <select
                required
                value={manualForm.category}
                onChange={(e) =>
                  setManualForm((p) => ({ ...p, category: e.target.value }))
                }
                className="w-full bg-white/5 text-white border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary/60"
              >
                {ALL_CATEGORIES.map((cat) => (
                  <option
                    key={cat}
                    value={cat}
                    className="bg-[#1E1E1E] text-white"
                  >
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs text-white/50 mb-1.5 font-medium">
                  Quantidade
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={manualForm.quantity}
                  onChange={(e) =>
                    setManualForm((p) => ({ ...p, quantity: e.target.value }))
                  }
                  className="w-full bg-white/5 text-white border border-white/10 rounded-xl px-4 py-3 text-sm"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-white/50 mb-1.5 font-medium">
                  Unidade
                </label>
                <select
                  value={manualForm.quantityType}
                  onChange={(e) =>
                    setManualForm((p) => ({
                      ...p,
                      quantityType: e.target.value,
                    }))
                  }
                  className="w-full bg-white/5 text-white border border-white/10 rounded-xl px-4 py-3 text-sm"
                >
                  <option value="Unidade" className="bg-[#1E1E1E] text-white">
                    Unidade
                  </option>
                  <option value="kg" className="bg-[#1E1E1E] text-white">
                    KG
                  </option>
                  <option value="litros" className="bg-[#1E1E1E] text-white">
                    Litros
                  </option>
                  <option value="pacote" className="bg-[#1E1E1E] text-white">
                    Pacote
                  </option>
                </select>
              </div>
            </div>

            {!productToEdit && (
              <div
                onClick={() => setSaveToCatalog(!saveToCatalog)}
                className="flex items-center gap-3 mt-2 cursor-pointer group select-none"
              >
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${saveToCatalog ? "bg-primary border-primary" : "border-white/30 bg-[#2A2A2A] group-hover:border-white/50"}`}
                >
                  {saveToCatalog && (
                    <Check size={14} strokeWidth={3} className="text-white" />
                  )}
                </div>
                <span className="text-sm text-white/70">
                  Salvar no meu catálogo para próximas buscas
                </span>
              </div>
            )}

            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={() => {
                  if (productToEdit) navigate("/");
                  else setManualMode(false);
                }}
                className="flex-1 bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 py-3.5 rounded-xl text-sm transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-primary to-[#009624] text-white font-semibold py-3.5 rounded-xl text-sm shadow-lg active:scale-95 transition-transform"
              >
                {productToEdit ? "Salvar alterações" : "Adicionar à lista"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* ── MODO BUSCA ─────────────────────────────────────────────────── */
        <>
          <div className="px-5 py-4">
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus-within:border-primary/50">
              <Search size={18} className="text-white/40" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (e.target.value) setActiveCategory(null);
                }}
                placeholder="Buscar produto..."
                className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/30"
              />
            </div>
          </div>

          {!trimmedQuery && (
            <div className="px-5 pb-3 border-b border-white/5">
              <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-2">
                {ALL_CATEGORIES.map((cat) => {
                  const { Icon: CatIcon, colorTheme } = getDynamicStyle(cat);
                  const isActive = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() =>
                        setActiveCategory((p) => (p === cat ? null : cat))
                      }
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${isActive ? "bg-primary border-primary text-white" : "bg-[#2A2A2A] border-white/5 text-white/60 hover:bg-white/10 hover:text-white"}`}
                    >
                      <CatIcon
                        size={14}
                        className={
                          isActive
                            ? "text-white"
                            : colorTheme.text.split(" ")[0]
                        }
                      />
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto px-5 pb-2 pt-2 scrollbar-hide">
            {!trimmedQuery && !activeCategory && (
              <div className="text-center py-10 opacity-60 flex flex-col items-center">
                <Search size={40} className="text-white/20 mb-3" />
                <p className="text-white/50 text-sm">
                  Digite o nome do produto
                  <br />
                  ou escolha uma categoria acima
                </p>
              </div>
            )}

            {filteredProducts.map((product) => {
              const isAdded = !!pendingItems[product.name];
              const { Icon: ProductIcon, colorTheme } = getDynamicStyle(
                product.category,
              );

              return (
                <div
                  key={`${product.category}-${product.name}`}
                  onClick={() => toggleItem(product)}
                  className={`flex items-center gap-3.5 py-3 border-b border-white/5 cursor-pointer transition-colors hover:bg-white/5 px-2 -mx-2 rounded-lg`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-opacity ${isAdded ? "opacity-40 grayscale" : "opacity-100"} ${colorTheme.bg} ${colorTheme.text}`}
                  >
                    <ProductIcon size={20} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium transition-colors ${isAdded ? "text-primary" : "text-white"}`}
                    >
                      {product.name}
                    </p>
                    <p className="text-xs text-white/35">{product.category}</p>
                  </div>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isAdded ? "bg-primary text-white" : "bg-[#2A2A2A] text-white/40"}`}
                  >
                    {isAdded ? (
                      <Check size={14} strokeWidth={3} />
                    ) : (
                      <Plus size={14} />
                    )}
                  </div>
                </div>
              );
            })}

            {trimmedQuery && filteredProducts.length === 0 && (
              <div className="py-8 flex flex-col items-center text-center">
                <p className="text-sm text-white/50 mb-4">
                  Não encontrei "{query}" no seu catálogo.
                </p>
                <button
                  onClick={() => {
                    setManualForm((p) => ({ ...p, name: query }));
                    setManualMode(true);
                  }}
                  className="bg-[#2A2A2A] border border-white/10 text-white text-sm px-5 py-2.5 rounded-xl hover:bg-white/10 transition-colors"
                >
                  Adicionar manualmente
                </button>
              </div>
            )}
          </div>

          <div className="px-5 py-4 border-t border-white/5 bg-[#161616]/95 flex items-center gap-3">
            <p className="flex-1 text-xs text-white/50 font-medium">
              {Object.keys(pendingItems).length} item(s) selecionado(s)
            </p>
            <button
              onClick={handleSaveAll}
              disabled={Object.keys(pendingItems).length === 0}
              className="bg-gradient-to-r from-primary to-[#009624] text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 disabled:opacity-30 disabled:pointer-events-none active:scale-95 transition-all"
            >
              Adicionar
            </button>
          </div>
        </>
      )}
    </div>
  );
}
