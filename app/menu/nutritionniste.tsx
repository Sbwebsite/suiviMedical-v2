import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

interface ContactOption {
  id: string;
  title: string;
  icon: string;
  action: () => void;
}

export default function NutritionnisteScreen() {
  const [message, setMessage] = useState('');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleSendMessage = () => {
    if (!message.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un message');
      return;
    }
    // Ici, vous pouvez implémenter l'envoi du message
    Alert.alert('Message envoyé', 'Nous vous répondrons dans les plus brefs délais');
    setMessage('');
  };

  const contactOptions: ContactOption[] = [
    {
      id: '1',
      title: 'Appeler',
      icon: 'call-outline',
      action: () => Linking.openURL('tel:+33123456789'),
    },
    {
      id: '2',
      title: 'Envoyer un email',
      icon: 'mail-outline',
      action: () => Linking.openURL('mailto:contact@example.com'),
    },
    {
      id: '3',
      title: 'Prendre rendez-vous',
      icon: 'calendar-outline',
      action: () => {
        // Implémenter la logique de prise de rendez-vous
        Alert.alert('Prise de rendez-vous', 'Fonctionnalité à venir');
      },
    },
  ];

  return (
    <ScrollView style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.header}>
        <Ionicons
          name="nutrition-outline"
          size={60}
          color="#f4511e"
          style={styles.headerIcon}
        />
        <Text style={[styles.title, isDark && styles.titleDark]}>
          Contactez votre nutritionniste
        </Text>
      </View>

      <View style={[styles.infoCard, isDark && styles.infoCardDark]}>
        <Text style={[styles.infoText, isDark && styles.textDark]}>
          Nos nutritionnistes sont disponibles pour vous accompagner dans votre suivi nutritionnel.
          N'hésitez pas à nous contacter pour toute question concernant votre alimentation.
        </Text>
      </View>

      <View style={styles.contactOptions}>
        {contactOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[styles.contactButton, isDark && styles.contactButtonDark]}
            onPress={option.action}
          >
            <Ionicons name={option.icon as any} size={24} color="#f4511e" />
            <Text style={[styles.contactButtonText, isDark && styles.textDark]}>
              {option.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.messageContainer, isDark && styles.messageContainerDark]}>
        <Text style={[styles.messageTitle, isDark && styles.titleDark]}>
          Envoyer un message
        </Text>
        <TextInput
          style={[styles.messageInput, isDark && styles.messageInputDark]}
          placeholder="Votre message..."
          placeholderTextColor={isDark ? '#888' : '#666'}
          multiline
          numberOfLines={4}
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSendMessage}
        >
          <Text style={styles.sendButtonText}>Envoyer</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.footer, isDark && styles.footerDark]}>
        <Text style={[styles.footerText, isDark && styles.textDark]}>
          Horaires d'ouverture :
        </Text>
        <Text style={[styles.footerText, isDark && styles.textDark]}>
          Lundi - Vendredi : 9h - 17h
        </Text>
        <Text style={[styles.footerText, isDark && styles.textDark]}>
          Samedi : 9h - 12h
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
  },
  containerDark: {
    backgroundColor: '#1a237e',
  },
  header: {
    alignItems: 'center',
    padding: 20,
  },
  headerIcon: {
    marginBottom: 10,
    color: '#2196f3',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1565c0',
    textAlign: 'center',
  },
  titleDark: {
    color: '#90caf9',
  },
  infoCard: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  infoCardDark: {
    backgroundColor: '#283593',
  },
  infoText: {
    fontSize: 16,
    color: '#1976d2',
    lineHeight: 24,
  },
  contactOptions: {
    padding: 20,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  contactButtonDark: {
    backgroundColor: '#283593',
  },
  contactButtonText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#1565c0',
  },
  messageContainer: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  messageContainerDark: {
    backgroundColor: '#283593',
  },
  messageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1565c0',
  },
  messageInput: {
    borderWidth: 1,
    borderColor: '#90caf9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    minHeight: 100,
    textAlignVertical: 'top',
    color: '#1565c0',
  },
  messageInputDark: {
    borderColor: '#3949ab',
    color: '#e3f2fd',
  },
  sendButton: {
    backgroundColor: '#2196f3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 20,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  footerDark: {
    backgroundColor: '#283593',
  },
  footerText: {
    fontSize: 14,
    color: '#1976d2',
    marginBottom: 5,
  },
  textDark: {
    color: '#e3f2fd',
  },
});
