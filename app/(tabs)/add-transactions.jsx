import { View, ScrollView, Alert, StyleSheet, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, Text, Modal, TextInput, TouchableOpacity } from "react-native";
import { globalStyles } from "../../styles/globalStyles";
import Button from "../../components/Button";
import { useContext, useRef, useState, useEffect } from "react";
import DescriptionInput from "../../components/DescriptionInput";
import CurrencyInput from "../../components/CurrencyInput";
import DatePicker from "../../components/DatePicker";
import CategoryPicker from "../../components/CategoryPicker";
import { MoneyContext } from "../../contexts/GlobalState";
import { router } from "expo-router";
import { colors } from "../../constants/colors";
import { api } from "../../services/api"; 

const initialForm = {
  description: "",
  value: 0,
  date: new Date(),
  category: "cat-income", 
};

export default function AddTransactions() {
  const [form, setForm] = useState({ ...initialForm, date: new Date() });
  const valueInputRef = useRef();
  
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const [
    transactions, 
    setTransactions, 
    , , , 
    updateTransaction, 
    editingTransaction, 
    setEditingTransaction,
    categories,
    addCategory
  ] = useContext(MoneyContext);

  useEffect(() => {
    if (editingTransaction) {
      setForm({
        description: editingTransaction.description,
        value: editingTransaction.value,
        date: new Date(editingTransaction.date),
        category: editingTransaction.category?.id || "cat-income", // Puxamos o ID
      });
    }
  }, [editingTransaction]);

  const handleSave = async () => {
    if (editingTransaction) {
      Alert.alert("Aviso", "O backend não suporta edição de transações de momento.");
      setEditingTransaction(null);
      setForm({ ...initialForm, date: new Date() });
      router.replace('/'); 
      
    } else {
      try {
        const transactionData = {
          description: form.description,
          value: parseFloat(form.value),
          date: form.date.toISOString(), 
          categoryId: form.category 
        };

        const savedTransaction = await api.createTransaction(transactionData);

        setTransactions([...transactions, savedTransaction]); 
        setForm({ ...initialForm, date: new Date() }); 

        Alert.alert("Sucesso!", "Transação guardada na base de dados! 🚀");
      } catch (error) {
        console.log(error);
        Alert.alert("Erro", "Falha ao comunicar com o servidor.");
      }
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      Alert.alert("Erro", "O nome da categoria não pode estar vazio.");
      return;
    }

    const newCategory = {
      name: newCategoryName.trim().toLowerCase().replace(/\s+/g, '-'),
      displayName: newCategoryName.trim(),
    };

    await addCategory(newCategory); 
    
    setNewCategoryName(""); 
    setIsCategoryModalVisible(false);
    Alert.alert("Sucesso!", "Categoria criada na base de dados!");
  };

  return (
    <KeyboardAvoidingView style={globalStyles.screenContainer}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <ScrollView style={globalStyles.content}>
            
            {editingTransaction && (
              <Text style={[globalStyles.secondaryText, {textAlign: 'center', marginBottom: 10}]}>
                Modo de Edição ✏️
              </Text>
            )}

            <View style={styles.form}>
              <DescriptionInput form={form} setForm={setForm} valueInputRef={valueInputRef} />
              <CurrencyInput form={form} setForm={setForm} valueInputRef={valueInputRef} />
              <DatePicker form={form} setForm={setForm} />
              
              <View>
                <CategoryPicker form={form} setForm={setForm} />
                <TouchableOpacity onPress={() => setIsCategoryModalVisible(true)}>
                  <Text style={styles.addCategoryText}>+ Nova Categoria</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <Button onPress={handleSave}>
              {editingTransaction ? "Salvar Alterações" : "Adicionar"}
            </Button>

          </ScrollView>

          {isCategoryModalVisible && (
            <Modal visible={isCategoryModalVisible} transparent={true} animationType="fade">
              <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIsCategoryModalVisible(false)}>
                <TouchableWithoutFeedback>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Nova Categoria</Text>
                    <TextInput
                      style={styles.modalInput}
                      placeholder="Ex: Viagens, Animais, Lazer..."
                      value={newCategoryName}
                      onChangeText={setNewCategoryName}
                      autoFocus
                    />
                    <View style={styles.modalButtonsContainer}>
                      <TouchableOpacity style={styles.modalButton} onPress={() => setIsCategoryModalVisible(false)}>
                        <Text style={styles.modalButtonTextCancel}>Cancelar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.modalButton} onPress={handleCreateCategory}>
                        <Text style={styles.modalButtonText}>Criar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </TouchableOpacity>
            </Modal>
          )}

        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  form: { gap: 12, marginBottom: 40, marginTop: 10 },
  addCategoryText: { color: colors.primary, textAlign: 'right', marginTop: 8, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: colors.background, width: '80%', borderRadius: 12, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: colors.primaryText, textAlign: 'center' },
  modalInput: { borderWidth: 1, borderColor: colors.secondaryText, borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 20, color: colors.primaryText },
  modalButtonsContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  modalButton: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  modalButtonText: { fontSize: 16, color: colors.primary, fontWeight: 'bold' },
  modalButtonTextCancel: { fontSize: 16, color: '#FF3B30' }
});