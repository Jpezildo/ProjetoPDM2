import AsyncStorage from "@react-native-async-storage/async-storage"
import { createContext, useEffect, useState } from "react"
import { api } from "../services/api"

export const MoneyContext = createContext()

export default function GlobalState({ children }) {
  const [transactions, setTransactions] = useState([])
  const [filterDate, setFilterDate] = useState(new Date());
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [categories, setCategories] = useState({});
  const [userName, setUserName] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const storedName = await AsyncStorage.getItem("userName");
        if (storedName) setUserName(storedName);

        const apiCategories = await api.getCategories();
        
        const categoriesObj = {};
        apiCategories.forEach(cat => {
          categoriesObj[cat.id] = cat; 
        });
        setCategories(categoriesObj);

       
        const apiTransactions = await api.getTransactions();
        setTransactions(apiTransactions);

      } catch (e) {
        console.log("Erro ao ligar à API:", e);
      } finally {
        setIsReady(true);
      }
    }
    loadInitialData();
  }, []);

  const deleteTransaction = async (id) => {
    try {
      await api.deleteTransaction(id); 
      setTransactions(transactions.filter(t => t.id !== id)); 
    } catch (e) { console.log(e); }
  };

  const updateTransaction = async (updatedItem) => {
      console.log("Backend não suporta edição de transações conforme requisitos.");
  };

  const addCategory = async (newCategory) => {
    try {
      const categoryToAPI = {
        name: newCategory.name,
        displayName: newCategory.displayName,
        icon: "category", 
        background: "#CCCCCC", 
        isIncome: false 
      };

      const savedCategory = await api.createCategory(categoryToAPI);
      
      setCategories({ ...categories, [savedCategory.id]: savedCategory });
    } catch (e) { console.log(e); }
  };

  const saveUserName = async (name) => {
    try {
      setUserName(name);
      await AsyncStorage.setItem("userName", name);
    } catch (e) { console.log(e); }
  };

  return (
    <MoneyContext.Provider value={[
      transactions,          
      setTransactions,        
      filterDate,             
      setFilterDate,          
      deleteTransaction,      
      updateTransaction,      
      editingTransaction,    
      setEditingTransaction,  
      categories,             
      addCategory,            
      userName,               
      saveUserName,           
      isReady                 
    ]}>
      {children}
    </MoneyContext.Provider>
  )
}