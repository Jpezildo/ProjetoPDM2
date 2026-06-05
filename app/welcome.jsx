import { useState, useContext } from "react";
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { MoneyContext } from "../contexts/GlobalState";
import { globalStyles } from "../styles/globalStyles";
import { colors } from "../constants/colors";
import Button from "../components/Button";
import { router } from "expo-router";

export default function Welcome() {
  const [name, setName] = useState("");
  
  const [saveUserName] = useContext(MoneyContext);

  const handleStart = async () => {
    if (name.trim().length < 2) return;
    
    await saveUserName(name.trim());
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Bem-vindo!</Text>
        <Text style={styles.subtitle}>Como gostaria de ser chamado?</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Digite o seu nome..."
          placeholderTextColor={colors.secondaryText}
          value={name}
          onChangeText={setName}
          autoFocus
        />
        
        <Button onPress={handleStart}>Começar</Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    gap: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primaryText,
  },
  subtitle: {
    fontSize: 16,
    color: colors.secondaryText,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: colors.secondaryText,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: colors.primaryText,
    marginBottom: 10,
  }
});