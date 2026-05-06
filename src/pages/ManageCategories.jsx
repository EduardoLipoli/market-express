import { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { Plus, Trash2, ArrowLeft, Check, Pencil } from "lucide-react";
import { AVAILABLE_ICONS, AVAILABLE_COLORS } from "../utils/categoryConfig";

export function ManageCategories() {
  const { userCategories, saveCategoriesToFirebase } = useOutletContext();
  const navigate = useNavigate();

  // Estados do Formulário
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null); // <-- Estado para saber se está editando

  const [newCatName, setNewCatName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("Package");
  const [selectedColor, setSelectedColor] = useState("cyan");

  // Botão Editar Categoria
  const handleEditClick = (cat) => {
    setEditingId(cat.id);
    setNewCatName(cat.name);
    setSelectedIcon(cat.icon);
    setSelectedColor(cat.color);
    setIsAdding(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    if (editingId) {
      // Atualiza a categoria existente
      const updatedCategories = userCategories.map((cat) =>
        cat.id === editingId
          ? {
              ...cat,
              name: newCatName,
              icon: selectedIcon,
              color: selectedColor,
            }
          : cat,
      );
      await saveCategoriesToFirebase(updatedCategories);
    } else {
      // Cria uma nova
      const newCategory = {
        id: Date.now().toString(),
        name: newCatName,
        icon: selectedIcon,
        color: selectedColor,
      };
      await saveCategoriesToFirebase([...userCategories, newCategory]);
    }

    resetForm();
  };

  const handleDeleteCategory = async (id) => {
    if (
      window.confirm(
        "Deseja realmente excluir esta categoria? Os produtos atrelados a ela nas listas podem ficar sem categoria.",
      )
    ) {
      const updated = userCategories.filter((cat) => cat.id !== id);
      await saveCategoriesToFirebase(updated);
    }
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setNewCatName("");
    setSelectedIcon("Package");
    setSelectedColor("cyan");
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-300 pb-10">
      {/* HEADER DA TELA */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/settings")}
          className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={20} className="text-white/70" />
        </button>
        <div>
          <h2 className="text-lg font-bold text-white">Categorias</h2>
          <p className="text-xs text-white/50">Personalize ícones e cores</p>
        </div>
      </div>

      {/* FORMULÁRIO NOVA/EDITAR CATEGORIA */}
      {isAdding ? (
        <div className="bg-[#1E1E1E] border border-white/5 rounded-2xl p-5 shadow-lg animate-in slide-in-from-top-4">
          <h3 className="text-sm font-medium text-white/70 mb-4 uppercase tracking-wider">
            {editingId ? "Editar Categoria" : "Criar Categoria"}
          </h3>

          <form onSubmit={handleSaveCategory} className="flex flex-col gap-5">
            {/* Nome */}
            <div>
              <label className="block text-xs text-white/50 mb-2 font-medium">
                Nome da Categoria
              </label>
              <input
                type="text"
                required
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none text-white"
                placeholder="Ex: Farmácia"
              />
            </div>

            {/* Ícones */}
            <div>
              <label className="block text-xs text-white/50 mb-2 font-medium">
                Selecione um Ícone
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.keys(AVAILABLE_ICONS).map((iconName) => {
                  const IconComp = AVAILABLE_ICONS[iconName];
                  const isActive = selectedIcon === iconName;
                  return (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => setSelectedIcon(iconName)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isActive ? "bg-primary text-white scale-110" : "bg-white/5 text-white/40 hover:bg-white/10"}`}
                    >
                      <IconComp size={18} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cores */}
            <div>
              <label className="block text-xs text-white/50 mb-2 font-medium">
                Selecione uma Cor
              </label>
              <div className="flex flex-wrap gap-3">
                {AVAILABLE_COLORS.map((color) => {
                  const isActive = selectedColor === color.id;
                  return (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => setSelectedColor(color.id)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${color.bg} ${color.text} ${isActive ? "ring-2 ring-white ring-offset-2 ring-offset-[#1E1E1E] scale-110" : "hover:scale-110"}`}
                    >
                      {isActive && <Check size={14} strokeWidth={3} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-white/5 text-white/70 py-3 rounded-xl text-sm font-semibold hover:bg-white/10"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-primary to-[#009624] text-white py-3 rounded-xl text-sm font-semibold shadow-lg"
              >
                {editingId ? "Salvar Edição" : "Criar Categoria"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full bg-[#1E1E1E] border border-dashed border-white/20 text-white/60 hover:text-white hover:bg-white/5 hover:border-white/40 transition-all rounded-2xl p-4 flex items-center justify-center gap-2 font-medium"
        >
          <Plus size={18} /> Adicionar Nova Categoria
        </button>
      )}

      {/* LISTA DE CATEGORIAS (COM BOTÃO EDITAR) */}
      <div className="flex flex-col gap-3">
        {userCategories.map((cat) => {
          const IconComp =
            AVAILABLE_ICONS[cat.icon] || AVAILABLE_ICONS["Package"];
          const colorTheme =
            AVAILABLE_COLORS.find((c) => c.id === cat.color) ||
            AVAILABLE_COLORS[0];

          return (
            <div
              key={cat.id}
              className="flex justify-between items-center p-3 rounded-xl border bg-[#1E1E1E] border-white/5"
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${colorTheme.bg} ${colorTheme.text}`}
                >
                  <IconComp size={18} strokeWidth={2} />
                </div>
                <span className="font-medium text-white text-sm">
                  {cat.name}
                </span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleEditClick(cat)}
                  className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-500 hover:text-amber-400 hover:bg-white/5 transition-colors"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
