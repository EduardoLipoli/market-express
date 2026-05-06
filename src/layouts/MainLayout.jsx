import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { auth, db } from "../services/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { LogOut } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { INITIAL_CATEGORIES } from "../utils/categoryConfig";

export function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ─── ESTADOS DA APLICAÇÃO ───────────────────────────────────────────────
  const [lists, setLists] = useState([]);
  const [currentListId, setCurrentListId] = useState(null);
  const [userCategories, setUserCategories] = useState([]);
  const [userProducts, setUserProducts] = useState([]); // <-- Catálogo Pessoal

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate("/login");
        return;
      }
      setUser(currentUser);

      const docRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setLists(data.lists || []);
        setCurrentListId(data.currentListId || data.lists[0]?.id || null);
        setUserCategories(
          data.categories && data.categories.length > 0
            ? data.categories
            : INITIAL_CATEGORIES,
        );
        setUserProducts(data.userProducts || []); // Carrega catálogo
      } else {
        setUserCategories(INITIAL_CATEGORIES);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  // ─── FUNÇÕES DE SALVAMENTO NO FIREBASE ──────────────────────────────────
  const saveToFirebase = async (newLists, newListId) => {
    if (!user) return;
    setLists(newLists);
    setCurrentListId(newListId);
    await setDoc(
      doc(db, "users", user.uid),
      { lists: newLists, currentListId: newListId },
      { merge: true },
    );
  };

  const saveCategoriesToFirebase = async (newCategories) => {
    if (!user) return;
    setUserCategories(newCategories);
    await setDoc(
      doc(db, "users", user.uid),
      { categories: newCategories },
      { merge: true },
    );
  };

  const saveUserProductsToFirebase = async (newProducts) => {
    if (!user) return;
    setUserProducts(newProducts);
    await setDoc(
      doc(db, "users", user.uid),
      { userProducts: newProducts },
      { merge: true },
    );
  };

  // ─── FUNÇÕES DE MANIPULAÇÃO DE ITENS ────────────────────────────────────
  const handleEditProduct = async (productId, updatedData) => {
    const updatedLists = lists.map((list) => {
      if (list.id !== currentListId) return list;
      return {
        ...list,
        productList: list.productList.map((p) =>
          p.id === productId ? { ...p, ...updatedData } : p,
        ),
      };
    });
    await saveToFirebase(updatedLists, currentListId);
  };

  const handleDeleteProduct = async (productId) => {
    const updatedLists = lists.map((list) => {
      if (list.id !== currentListId) return list;
      return {
        ...list,
        productList: list.productList.filter((p) => p.id !== productId),
      };
    });
    await saveToFirebase(updatedLists, currentListId);
  };

  const handleDeleteCategory = async (categoryName) => {
    const updatedLists = lists.map((list) => {
      if (list.id !== currentListId) return list;
      return {
        ...list,
        categories: list.categories.filter((cat) => cat !== categoryName),
        productList: list.productList.filter(
          (p) => p.category !== categoryName,
        ),
      };
    });
    await saveToFirebase(updatedLists, currentListId);
  };

  const handleSaveProduct = async (newProducts) => {
    const productsToAdd = Array.isArray(newProducts)
      ? newProducts
      : [newProducts];
    const updatedLists = lists.map((list) => {
      if (list.id === currentListId) {
        let updatedCategories = [...list.categories];
        productsToAdd.forEach((prod) => {
          if (!updatedCategories.includes(prod.category))
            updatedCategories.push(prod.category);
        });
        return {
          ...list,
          categories: updatedCategories,
          productList: [...list.productList, ...productsToAdd],
        };
      }
      return list;
    });
    await saveToFirebase(updatedLists, currentListId);
  };

  const toggleProductComplete = async (productId) => {
    const updatedLists = lists.map((list) => {
      if (list.id !== currentListId) return list;
      return {
        ...list,
        productList: list.productList.map((p) =>
          p.id === productId ? { ...p, completed: !p.completed } : p,
        ),
      };
    });
    await saveToFirebase(updatedLists, currentListId);
  };

  const currentList = lists.find((l) => l.id === currentListId);

  // ─── DISPONIBILIZA TUDO PARA AS PÁGINAS ─────────────────────────────────
  const contextValue = {
    user,
    lists,
    currentList,
    currentListId,
    setCurrentListId,
    saveToFirebase,
    handleSaveProduct,
    handleEditProduct,
    handleDeleteProduct,
    handleDeleteCategory,
    toggleProductComplete,
    userCategories,
    saveCategoriesToFirebase,
    userProducts,
    saveUserProductsToFirebase, // <-- Novo!
  };

  if (loading)
    return (
      <div className="h-screen w-screen bg-[#121212] flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary"></div>
      </div>
    );

  let headerTitle = currentList ? currentList.name : "Minhas Listas";
  if (location.pathname === "/add-product") headerTitle = "Adicionar Itens";
  if (location.pathname === "/lists") headerTitle = "Gerenciar Listas";
  if (location.pathname === "/categories") headerTitle = "Personalizar";
  if (location.pathname === "/settings") headerTitle = "Configurações";
  if (location.pathname === "/profile") headerTitle = "Conta e Perfil"; // <-- NOVO
  if (location.pathname === "/about") headerTitle = "Sobre o App";
  if (location.pathname === "/products") headerTitle = "Meu Catálogo";

  return (
    <div className="min-h-screen bg-[#121212] text-[#E0E0E0] font-sans flex flex-col">
      <header className="fixed top-0 left-0 w-full h-[70px] bg-[#161616] border-b border-white/5 text-white flex items-center justify-center px-5 z-50 shadow-md backdrop-blur-md">
        <h1 className="text-xl font-bold truncate text-white/90">
          {headerTitle}
        </h1>
      </header>
      <main className="flex-1 pt-[85px] pb-[90px] px-4 max-w-md w-full mx-auto">
        <Outlet context={contextValue} />
      </main>
      <BottomNav />
    </div>
  );
}
