import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Plus, Trash2, Pencil, Package } from "lucide-react";
import { ConfirmModal } from "../components/ConfirmModal";
import { AVAILABLE_ICONS, AVAILABLE_COLORS } from "../utils/categoryConfig";

export function ManageProducts() {
  const { userProducts, saveUserProductsToFirebase, userCategories } =
    useOutletContext();

  // Estados do Formulário
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState(
    userCategories[0]?.name || "",
  );

  // Modal de Exclusão
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    id: null,
    name: null,
  });

  // Puxa o estilo da categoria para o ícone
  const getCategoryStyle = (categoryName) => {
    const cat = userCategories.find((c) => c.name === categoryName);
    if (cat) {
      return {
        Icon: AVAILABLE_ICONS[cat.icon] || Package,
        colorTheme:
          AVAILABLE_COLORS.find((c) => c.id === cat.color) ||
          AVAILABLE_COLORS[0],
      };
    }
    return { Icon: Package, colorTheme: AVAILABLE_COLORS[5] }; // Cinza padrão
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!formName.trim() || !formCategory) return;

    if (editingId) {
      // Atualiza produto existente
      const updatedProducts = userProducts.map((p) =>
        p.id === editingId
          ? { ...p, name: formName, category: formCategory }
          : p,
      );
      await saveUserProductsToFirebase(updatedProducts);
    } else {
      // Cria produto novo
      const newProduct = {
        id: Date.now().toString(),
        name: formName,
        category: formCategory,
      };
      await saveUserProductsToFirebase([...userProducts, newProduct]);
    }
    resetForm();
  };

  const handleEditClick = (product) => {
    setEditingId(product.id);
    setFormName(product.name);
    setFormCategory(product.category);
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteProduct = async (id) => {
    const updatedProducts = userProducts.filter((p) => p.id !== id);
    await saveUserProductsToFirebase(updatedProducts);
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormName("");
    setFormCategory(userCategories[0]?.name || "");
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-300">
      {/* HEADER DA TELA */}
      <div>
        <h2 className="text-xl font-bold text-white">Meu Catálogo</h2>
        <p className="text-xs text-white/50 mt-1">
          Gerencie seus produtos personalizados
        </p>
      </div>

      {/* FORMULÁRIO (Novo / Editar) */}
      {isAdding ? (
        <div className="bg-[#1E1E1E] border border-white/5 rounded-2xl p-5 shadow-lg animate-in slide-in-from-top-4">
          <h3 className="text-sm font-medium text-white/70 mb-4 uppercase tracking-wider">
            {editingId ? "Editar Produto" : "Novo Produto"}
          </h3>

          <form onSubmit={handleSaveProduct} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs text-white/50 mb-1.5 font-medium">
                Nome do Produto
              </label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none text-white placeholder:text-white/20"
                placeholder="Ex: Whey Protein"
              />
            </div>

            <div>
              <label className="block text-xs text-white/50 mb-1.5 font-medium">
                Categoria Padrão
              </label>
              <select
                required
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none"
              >
                {userCategories.map((cat) => (
                  <option
                    key={cat.id}
                    value={cat.name}
                    className="bg-[#1E1E1E] text-white"
                  >
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-white/5 text-white/70 py-3 rounded-xl text-sm font-semibold hover:bg-white/10 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-primary to-[#009624] text-white py-3 rounded-xl text-sm font-semibold shadow-lg active:scale-95 transition-transform"
              >
                {editingId ? "Salvar" : "Adicionar"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full bg-[#1E1E1E] border border-dashed border-white/20 text-white/60 hover:text-white hover:bg-white/5 hover:border-white/40 transition-all rounded-2xl p-4 flex items-center justify-center gap-2 font-medium"
        >
          <Plus size={18} /> Cadastrar Produto no Catálogo
        </button>
      )}

      {/* LISTA DO CATÁLOGO PESSOAL */}
      <div className="flex flex-col gap-3">
        {userProducts.length === 0 ? (
          <div className="text-center py-10 opacity-60">
            <Package size={40} className="text-white/20 mb-3 mx-auto" />
            <p className="text-white/50 text-sm">Seu catálogo está vazio.</p>
          </div>
        ) : (
          userProducts.map((product) => {
            const { Icon: CatIcon, colorTheme } = getCategoryStyle(
              product.category,
            );

            return (
              <div
                key={product.id}
                className="flex justify-between items-center p-3 rounded-xl border bg-[#1E1E1E] border-white/5"
              >
                <div className="flex items-center gap-3.5 overflow-hidden flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${colorTheme.bg} ${colorTheme.text}`}
                  >
                    <CatIcon size={18} strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <span className="block font-medium text-white text-sm truncate">
                      {product.name}
                    </span>
                    <span className="block text-xs text-white/40 truncate">
                      {product.category}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1 pl-2">
                  <button
                    onClick={() => handleEditClick(product)}
                    className="w-10 h-10 flex items-center justify-center rounded-lg text-white/30 hover:text-amber-400 hover:bg-white/5 transition-colors"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() =>
                      setConfirmModal({
                        isOpen: true,
                        id: product.id,
                        name: product.name,
                      })
                    }
                    className="w-10 h-10 flex items-center justify-center rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal de Exclusão */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, id: null, name: null })}
        title="Remover do Catálogo"
        message={`Tem certeza que deseja remover "${confirmModal.name}" do seu catálogo base? (Isso não apaga o produto de listas já criadas).`}
        onConfirm={() => handleDeleteProduct(confirmModal.id)}
      />
    </div>
  );
}
