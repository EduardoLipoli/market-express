import { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import {
  Trash2,
  Check,
  Pencil,
  ChevronDown,
  ChevronRight,
  Package,
} from "lucide-react";
import { ConfirmModal } from "../components/ConfirmModal";
import { AVAILABLE_ICONS, AVAILABLE_COLORS } from "../utils/categoryConfig";

export function Home() {
  const {
    currentList,
    toggleProductComplete,
    handleDeleteProduct,
    handleDeleteCategory,
    userCategories,
  } = useOutletContext();
  const navigate = useNavigate();

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: null,
    targetId: null,
    targetName: null,
  });
  const [collapsedCategories, setCollapsedCategories] = useState([]);

  // Puxa o estilo baseado na customização do usuário
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
    return { Icon: Package, colorTheme: AVAILABLE_COLORS[5] };
  };

  const openConfirmModal = (type, id, name) =>
    setConfirmModal({ isOpen: true, type, targetId: id, targetName: name });

  const toggleCategory = (categoryName) => {
    setCollapsedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((cat) => cat !== categoryName)
        : [...prev, categoryName],
    );
  };

  if (!currentList)
    return (
      <div className="text-center py-20 text-white/50">
        Nenhuma lista ativa.
      </div>
    );

  let totalItemsCount = 0;
  let itemsPickedCount = 0;
  currentList.productList.forEach((prod) => {
    const isWeight =
      prod.quantityType === "kg" || prod.quantityType === "litros";
    const qty = isWeight ? 1 : prod.quantity;
    totalItemsCount += qty;
    if (prod.completed) itemsPickedCount += qty;
  });
  const itemsRemainingCount = totalItemsCount - itemsPickedCount;
  const listColor =
    AVAILABLE_COLORS.find((c) => c.id === currentList.color) ||
    AVAILABLE_COLORS[4];

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-300">
      {/* ── STATS (Usando a cor da lista!) ────────────────────────────────── */}
      <div
        className={`w-full bg-[#1E1E1E] rounded-2xl shadow-lg border p-5 ${listColor.border || "border-white/5"}`}
      >
        <div className="flex justify-around items-center">
          <div className="text-center">
            <h2 className={`text-3xl font-bold ${listColor.text}`}>
              {itemsPickedCount}
            </h2>
            <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">
              Pegos
            </p>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div className="text-center">
            <h2 className={`text-3xl font-bold ${listColor.text}`}>
              {totalItemsCount}
            </h2>
            <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">
              Itens
            </p>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div className="text-center">
            <h2 className={`text-3xl font-bold ${listColor.text}`}>
              {itemsRemainingCount}
            </h2>
            <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">
              Faltam
            </p>
          </div>
        </div>
      </div>

      {/* ── LISTA ────────────────────────────────────────────────────────── */}
      <div className="w-full pb-10">
        {currentList.productList.length === 0 ? (
          <div className="text-center py-10 opacity-60">
            <div className="text-5xl mb-4">🛒</div>
            <p className="text-white/50 text-sm">Sua lista está vazia.</p>
          </div>
        ) : (
          currentList.categories.map((category) => {
            const productsInCat = currentList.productList.filter(
              (p) => p.category === category,
            );
            if (productsInCat.length === 0) return null;
            const isCollapsed = collapsedCategories.includes(category);
            const { Icon: CategoryIcon, colorTheme } =
              getDynamicStyle(category);

            return (
              <div key={category} className="mb-5">
                <div
                  onClick={() => toggleCategory(category)}
                  className="flex justify-between items-center px-2 py-3 border-b border-white/5 mb-3 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-white/40">
                      {isCollapsed ? (
                        <ChevronRight size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )}
                    </div>
                    <h3 className="font-bold text-white text-sm uppercase flex items-center gap-2.5">
                      <div
                        className={`w-6 h-6 rounded-md flex items-center justify-center ${colorTheme.bg} ${colorTheme.text}`}
                      >
                        <CategoryIcon size={14} strokeWidth={2.5} />
                      </div>
                      {category}
                      {isCollapsed && (
                        <span className="text-[10px] text-white/30 ml-1 font-normal">
                          ({productsInCat.length})
                        </span>
                      )}
                    </h3>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openConfirmModal("category", category, category);
                    }}
                    className="text-white/30 hover:text-red-500 p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {!isCollapsed && (
                  <div className="space-y-2">
                    {productsInCat.map((product) => (
                      <div
                        key={product.id}
                        className={`flex justify-between items-center p-3 rounded-xl border ${product.completed ? "bg-[#00C853]/5 border-primary/20" : "bg-[#1E1E1E] border-white/5"}`}
                      >
                        <div
                          className="flex items-center gap-3.5 cursor-pointer flex-1"
                          onClick={() => toggleProductComplete(product.id)}
                        >
                          <div
                            className={`w-5 h-5 rounded flex items-center justify-center border ${product.completed ? "bg-primary border-primary" : "border-white/30 bg-[#2A2A2A]"}`}
                          >
                            {product.completed && (
                              <Check size={14} className="text-white" />
                            )}
                          </div>
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${product.completed ? "opacity-40 grayscale" : "opacity-100"} ${colorTheme.bg} ${colorTheme.text}`}
                          >
                            <CategoryIcon size={20} />
                          </div>
                          <div className="min-w-0">
                            <span
                              className={`block font-medium text-sm ${product.completed ? "line-through text-primary opacity-80" : "text-white"}`}
                            >
                              {product.name}
                            </span>
                            <span className="text-xs text-white/40">
                              {product.quantity} {product.quantityType}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1.5 ml-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate("/add-product", {
                                state: { productToEdit: product },
                              });
                            }}
                            className="w-8 h-8 rounded-lg text-gray-500 hover:text-amber-400 hover:bg-white/5 flex items-center justify-center"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openConfirmModal(
                                "product",
                                product.id,
                                product.name,
                              );
                            }}
                            className="w-8 h-8 rounded-lg text-gray-500 hover:text-red-400 hover:bg-white/5 flex items-center justify-center"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() =>
          setConfirmModal({
            isOpen: false,
            type: null,
            targetId: null,
            targetName: null,
          })
        }
        title={
          confirmModal.type === "product"
            ? "Excluir Produto"
            : "Excluir Categoria"
        }
        message={`Deseja excluir "${confirmModal.targetName}"?`}
        onConfirm={() => {
          confirmModal.type === "product"
            ? handleDeleteProduct(confirmModal.targetId)
            : handleDeleteCategory(confirmModal.targetId);
        }}
      />
    </div>
  );
}
