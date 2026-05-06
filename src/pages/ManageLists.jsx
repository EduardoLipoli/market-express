import { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { Plus, Check, Trash2, Pencil } from "lucide-react";
import { ConfirmModal } from "../components/ConfirmModal";
import { AVAILABLE_COLORS } from "../utils/categoryConfig";

export function ManageLists() {
  const { lists, currentListId, setCurrentListId, saveToFirebase } =
    useOutletContext();
  const navigate = useNavigate();

  // Estados do Formulário
  const [newListName, setNewListName] = useState("");
  const [selectedListColor, setSelectedListColor] = useState("emerald"); // Cor padrão
  const [editingListId, setEditingListId] = useState(null); // <-- NOVO: Controla qual lista está sendo editada

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    listId: null,
    listName: null,
  });

  // ─── Salvar ou Editar Lista ───────────────────────────────────────────────
  const handleSaveList = async (e) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    if (editingListId) {
      // 1. MODO EDIÇÃO: Atualiza a lista existente
      const updatedLists = lists.map((list) =>
        list.id === editingListId
          ? { ...list, name: newListName, color: selectedListColor }
          : list,
      );
      // Mantém a lista atual como ativa, apenas atualiza o array
      await saveToFirebase(updatedLists, currentListId);
    } else {
      // 2. MODO CRIAÇÃO: Cria uma lista nova
      const newList = {
        id: Date.now().toString(),
        name: newListName,
        color: selectedListColor,
        categories: ["Geral"],
        productList: [],
      };
      const updatedLists = [...lists, newList];
      // Salva e já define a nova como a ativa
      await saveToFirebase(updatedLists, newList.id);
    }

    resetForm();
  };

  // Prepara o formulário para edição
  const handleEditClick = (list) => {
    setEditingListId(list.id);
    setNewListName(list.name);
    setSelectedListColor(list.color || "emerald");
    window.scrollTo({ top: 0, behavior: "smooth" }); // Rola pro topo suavemente
  };

  const resetForm = () => {
    setEditingListId(null);
    setNewListName("");
    setSelectedListColor("emerald");
  };

  const selectList = async (id) => {
    await saveToFirebase(lists, id);
    navigate("/");
  };

  const handleDeleteList = async (id) => {
    const updatedLists = lists.filter((l) => l.id !== id);
    let newCurrentId = currentListId;
    // Se excluiu a lista atual, muda para a próxima disponível
    if (currentListId === id) {
      newCurrentId = updatedLists.length > 0 ? updatedLists[0].id : null;
    }
    await saveToFirebase(updatedLists, newCurrentId);
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-300">
      {/* ── Formulário (Criar / Editar) ────────────────────────────────────── */}
      <div className="bg-[#1E1E1E] border border-white/5 rounded-2xl p-5 shadow-lg">
        <h2 className="text-sm font-medium text-white/70 mb-4 uppercase tracking-wider">
          {editingListId ? "Editar Lista" : "Nova Lista"}
        </h2>
        <form onSubmit={handleSaveList} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nome da lista (Ex: Compra do Mês)"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none text-white placeholder:text-white/20 transition-colors"
          />

          <div>
            <label className="block text-xs text-white/50 mb-2 font-medium">
              Cor da Lista
            </label>
            <div className="flex flex-wrap gap-2.5">
              {AVAILABLE_COLORS.map((color) => {
                const isActive = selectedListColor === color.id;
                return (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => setSelectedListColor(color.id)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${color.bg} ${color.text} ${isActive ? "ring-2 ring-white ring-offset-2 ring-offset-[#1E1E1E] scale-110" : "hover:scale-110"}`}
                  >
                    {isActive && <Check size={12} strokeWidth={3} />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3 mt-2">
            {editingListId && (
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-white/5 text-white py-3 rounded-xl flex items-center justify-center transition-colors hover:bg-white/10 text-sm font-medium"
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              disabled={!newListName.trim()}
              className={`flex-1 ${editingListId ? "bg-gradient-to-r from-primary to-[#009624]" : "bg-[#2A2A2A] border border-white/5 hover:bg-white/5"} text-white py-3 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50 text-sm font-medium`}
            >
              {!editingListId && <Plus size={18} />}
              {editingListId ? "Salvar Edição" : "Criar Lista"}
            </button>
          </div>
        </form>
      </div>

      {/* ── Minhas Listas ─────────────────────────────────────────────────── */}
      <div className="bg-[#1E1E1E] border border-white/5 rounded-2xl p-5 shadow-lg flex-1 mb-6">
        <h2 className="text-sm font-medium text-white/70 mb-4 uppercase tracking-wider">
          Minhas Listas
        </h2>
        {lists.length === 0 ? (
          <p className="text-center text-sm text-white/30 py-6">
            Nenhuma lista criada.
          </p>
        ) : (
          <ul className="space-y-3">
            {lists.map((list) => {
              const isActive = currentListId === list.id;
              const listColorObj =
                AVAILABLE_COLORS.find(
                  (c) => c.id === (list.color || "emerald"),
                ) || AVAILABLE_COLORS[4];

              return (
                <li
                  key={list.id}
                  className={`flex justify-between items-center p-3 rounded-xl transition-all border ${isActive ? `${listColorObj.bg} ${listColorObj.border || "border-white/10"}` : "bg-white/5 border-white/5 hover:border-white/20"}`}
                >
                  {/* Área Clicável para selecionar */}
                  <div
                    className="flex items-center gap-3 overflow-hidden flex-1 cursor-pointer py-1"
                    onClick={() => selectList(list.id)}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isActive ? "bg-white/20 text-white" : `${listColorObj.bg} ${listColorObj.text}`}`}
                    >
                      {isActive ? (
                        <Check size={18} strokeWidth={3} />
                      ) : (
                        <span className="text-sm font-bold">
                          {list.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <span
                        className={`block font-medium truncate ${isActive ? "text-white" : "text-white/80"}`}
                      >
                        {list.name}
                      </span>
                      <span
                        className={`text-xs ${isActive ? "text-white/60" : "text-white/40"}`}
                      >
                        {list.productList?.length || 0} itens
                      </span>
                    </div>
                  </div>

                  {/* Botões de Ação */}
                  <div className="flex gap-1 pl-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(list);
                      }}
                      className="w-10 h-10 flex items-center justify-center rounded-lg text-white/30 hover:text-amber-400 hover:bg-white/5 transition-colors"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmModal({
                          isOpen: true,
                          listId: list.id,
                          listName: list.name,
                        });
                      }}
                      className="w-10 h-10 flex items-center justify-center rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Modal de Exclusão */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() =>
          setConfirmModal({ isOpen: false, listId: null, listName: null })
        }
        title="Excluir Lista"
        message={`Você tem certeza que deseja excluir a lista "${confirmModal.listName}"?`}
        onConfirm={() => handleDeleteList(confirmModal.listId)}
      />
    </div>
  );
}
