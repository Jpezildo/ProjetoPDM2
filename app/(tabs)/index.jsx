import { MoneyContext } from "../../contexts/GlobalState";
import { useContext, useState } from "react";
import { FlatList, Text, View, Modal, TouchableOpacity, StyleSheet, Alert } from "react-native";
import TransactionItem from "../../components/TransactionItem";
import MonthFilter from "../../components/MonthFilter";
import { colors } from "../../constants/colors";
import { router } from "expo-router";

export default function Transactions() {
  const {
    transactions,
    filterDate,
    deleteTransaction,               
    setEditingTransaction 
  } = useContext(MoneyContext);

  const [selectedItem, setSelectedItem] = useState(null);

  // Prevenção de erro caso transactions seja undefined
  const safeTransactions = transactions || [];

  const filteredTransactions = safeTransactions.filter((t) => {
    if (!filterDate) return false;
    const transactionDate = new Date(t.date);
    return (
      transactionDate.getMonth() === filterDate.getMonth() &&
      transactionDate.getFullYear() === filterDate.getFullYear()
    );
  });

  const handleDelete = () => {
    if (!selectedItem) return; 

    Alert.alert(
      "Apagar Transação",
      `Tem a certeza que deseja apagar "${selectedItem.description}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Apagar", 
          style: "destructive", 
          onPress: () => {
            deleteTransaction(selectedItem.id);
            setSelectedItem(null); 
          } 
        }
      ]
    );
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.content}>
        <MonthFilter />

        <FlatList
          data={filteredTransactions}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <TransactionItem 
              {...item} 
              onLongPress={(itemData) => setSelectedItem(itemData)} 
            />
          )}
          ListEmptyComponent={
            // AQUI ESTAVA O ERRO (globalStyles.secondaryText). Mudei para styles.secondaryText
            <Text style={styles.secondaryText}>
              Ainda não há nenhum item neste mês!
            </Text>
          }
        />
      </View>

      {selectedItem && (
        <Modal visible={!!selectedItem} transparent={true} animationType="fade" onRequestClose={() => setSelectedItem(null)}>
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setSelectedItem(null)}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Opções</Text>
              
              <TouchableOpacity style={styles.modalButton} onPress={handleDelete}>
                <Text style={styles.modalButtonTextDestructive}>Apagar</Text>
              </TouchableOpacity>
              <View style={styles.modalSeparator} />
              <TouchableOpacity 
                style={styles.modalButton} 
                onPress={() => {
                  setEditingTransaction(selectedItem); 
                  setSelectedItem(null);               
                  router.push("/add-transactions");    
                }}
              >
                <Text style={styles.modalButtonText}>Editar</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
}

// Junta TODOS os estilos num único lugar e elimina variáveis soltas!
const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: colors?.background || '#F5F5F5' },
  content: { flex: 1, padding: 20 },
  secondaryText: { fontSize: 16, color: colors?.secondaryText || '#8E8E93', textAlign: 'center', marginTop: 20 },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: colors?.background || '#FFF', width: '80%', borderRadius: 12, padding: 20, alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: colors?.primaryText || '#000' },
  modalButton: { width: '100%', paddingVertical: 15, alignItems: 'center' },
  modalButtonText: { fontSize: 18, color: colors?.primary || '#007AFF' },
  modalButtonTextDestructive: { fontSize: 18, color: '#FF3B30', fontWeight: 'bold' },
  modalSeparator: { height: 1, width: '100%', backgroundColor: colors?.secondaryText || '#CCC', opacity: 0.2 }
});