import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';

// Define your color palette (same as Register screen)
const primaryBlue = '#2196f3';
const lightBlue = '#90caf9';
const white = '#f0f8ff';
const textColor = '#1565c0';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    // Simuler la réussite de la connexion
    Alert.alert('Connexion réussie', `Bienvenue, ${email}!`);
    router.push('/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor={lightBlue}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor={lightBlue}
      />

    <TouchableOpacity style={styles.button} onPress={() => router.push('/home')}>
      <Text style={styles.buttonText}>Se connecter</Text>
    </TouchableOpacity>

    <Text style={styles.link} onPress={() => router.push('/register')}>
      Pas encore inscrit ? Crée un compte.
    </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: white,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: primaryBlue,
  },
  input: {
    borderWidth: 1,
    borderColor: lightBlue,
    padding: 15,
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: white,
    color: textColor,
  },
  button: {
    backgroundColor: primaryBlue,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  link: {
    marginTop: 20,
    textAlign: 'center',
    color: primaryBlue,
  },
});