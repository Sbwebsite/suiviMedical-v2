import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import {
    Alert,
    Linking,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface ContactOption {
  id: string;
  title: string;
  icon: string;
  action: () => void;
}

interface Treatment {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  notes?: string;
  status: 'active' | 'completed' | 'paused';
  nextDose?: string;
}

export default function MedecinScreen() {
  const [message, setMessage] = useState('');
  const [treatments, setTreatments] = useState<Treatment[]>([
    {
      id: '1',
      name: 'Metformine',
      dosage: '500mg',
      frequency: '2 fois par jour',
      startDate: '2024-01-01',
      status: 'active',
      nextDose: '2024-03-20 20:00',
      notes: 'À prendre pendant les repas',
    },
    {
      id: '2',
      name: 'Insuline',
      dosage: '10 unités',
      frequency: 'Avant chaque repas',
      startDate: '2024-01-01',
      status: 'active',
      nextDose: '2024-03-20 12:00',
      notes: 'À ajuster selon la glycémie',
    },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState<Treatment | null>(null);
  const [newTreatment, setNewTreatment] = useState<Partial<Treatment>>({
    name: '',
    dosage: '',
    frequency: '',
    startDate: new Date().toISOString(),
    status: 'active',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateField, setDateField] = useState<'startDate' | 'nextDose'>('startDate');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleSendMessage = () => {
    if (!message.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un message');
      return;
    }
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
        Alert.alert('Prise de rendez-vous', 'Fonctionnalité à venir');
      },
    },
  ];

  const handleTreatmentAction = (treatment: Treatment, action: 'edit' | 'delete' | 'pause' | 'complete') => {
    switch (action) {
      case 'edit':
        setEditingTreatment(treatment);
        setNewTreatment(treatment);
        setShowAddModal(true);
        break;
      case 'delete':
        Alert.alert(
          'Supprimer le traitement',
          'Êtes-vous sûr de vouloir supprimer ce traitement ?',
          [
            { text: 'Annuler', style: 'cancel' },
            {
              text: 'Supprimer',
              style: 'destructive',
              onPress: () => {
                setTreatments(treatments.filter(t => t.id !== treatment.id));
              },
            },
          ]
        );
        break;
      case 'pause':
        Alert.alert(
          'Mettre en pause',
          'Voulez-vous mettre ce traitement en pause ?',
          [
            { text: 'Annuler', style: 'cancel' },
            {
              text: 'Mettre en pause',
              style: 'default',
              onPress: () => {
                setTreatments(treatments.map(t =>
                  t.id === treatment.id ? { ...t, status: 'paused' } : t
                ));
              },
            },
          ]
        );
        break;
      case 'complete':
        Alert.alert(
          'Terminer le traitement',
          'Voulez-vous marquer ce traitement comme terminé ?',
          [
            { text: 'Annuler', style: 'cancel' },
            {
              text: 'Terminer',
              style: 'default',
              onPress: () => {
                setTreatments(treatments.map(t =>
                  t.id === treatment.id ? { ...t, status: 'completed' } : t
                ));
              },
            },
          ]
        );
        break;
    }
  };

  const handleSaveTreatment = () => {
    if (!newTreatment.name || !newTreatment.dosage || !newTreatment.frequency) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (editingTreatment) {
      setTreatments(treatments.map(t =>
        t.id === editingTreatment.id ? { ...t, ...newTreatment } : t
      ));
    } else {
      setTreatments([...treatments, {
        ...newTreatment as Treatment,
        id: Date.now().toString(),
      }]);
    }

    setShowAddModal(false);
    setEditingTreatment(null);
    setNewTreatment({
      name: '',
      dosage: '',
      frequency: '',
      startDate: new Date().toISOString(),
      status: 'active',
    });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setNewTreatment({
        ...newTreatment,
        [dateField]: selectedDate.toISOString(),
      });
    }
  };

  const getStatusColor = (status: Treatment['status']) => {
    switch (status) {
      case 'active':
        return '#00C851';
      case 'paused':
        return '#ffbb33';
      case 'completed':
        return '#ff4444';
      default:
        return '#666';
    }
  };

  const getStatusText = (status: Treatment['status']) => {
    switch (status) {
      case 'active':
        return 'En cours';
      case 'paused':
        return 'En pause';
      case 'completed':
        return 'Terminé';
      default:
        return '';
    }
  };

  return (
    <ScrollView style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.header}>
        <Ionicons
          name="medical-outline"
          size={60}
          color="#f4511e"
          style={styles.headerIcon}
        />
        <Text style={[styles.title, isDark && styles.titleDark]}>
          Contactez votre médecin
        </Text>
      </View>

      <View style={[styles.infoCard, isDark && styles.infoCardDark]}>
        <Text style={[styles.infoText, isDark && styles.textDark]}>
          Votre médecin est disponible pour vous accompagner dans votre suivi médical.
          N'hésitez pas à nous contacter pour toute question concernant votre santé.
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

      <View style={[styles.treatmentsContainer, isDark && styles.treatmentsContainerDark]}>
        <View style={styles.treatmentsHeader}>
          <Text style={[styles.treatmentsTitle, isDark && styles.titleDark]}>
            Mes traitements
          </Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <Ionicons name="add-circle-outline" size={24} color="#f4511e" />
          </TouchableOpacity>
        </View>

        {treatments.map((treatment) => (
          <View
            key={treatment.id}
            style={[styles.treatmentCard, isDark && styles.treatmentCardDark]}
          >
            <View style={styles.treatmentHeader}>
              <View style={styles.treatmentTitleContainer}>
                <Text style={[styles.treatmentName, isDark && styles.textDark]}>
                  {treatment.name}
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(treatment.status) }]}>
                  <Text style={styles.statusText}>
                    {getStatusText(treatment.status)}
                  </Text>
                </View>
              </View>
              <View style={styles.treatmentActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleTreatmentAction(treatment, 'edit')}
                >
                  <Ionicons name="create-outline" size={20} color={isDark ? '#fff' : '#333'} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleTreatmentAction(treatment, 'delete')}
                >
                  <Ionicons name="trash-outline" size={20} color="#ff4444" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.treatmentDetails}>
              <View style={styles.detailRow}>
                <Ionicons name="medical-outline" size={16} color="#f4511e" style={styles.detailIcon} />
                <Text style={[styles.treatmentText, isDark && styles.textDark]}>
                  Dosage: {treatment.dosage}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="time-outline" size={16} color="#f4511e" style={styles.detailIcon} />
                <Text style={[styles.treatmentText, isDark && styles.textDark]}>
                  Fréquence: {treatment.frequency}
                </Text>
              </View>
              {treatment.nextDose && (
                <View style={styles.detailRow}>
                  <Ionicons name="calendar-outline" size={16} color="#f4511e" style={styles.detailIcon} />
                  <Text style={[styles.treatmentText, isDark && styles.textDark]}>
                    Prochaine prise: {new Date(treatment.nextDose).toLocaleString()}
                  </Text>
                </View>
              )}
              {treatment.notes && (
                <View style={styles.notesContainer}>
                  <Ionicons name="information-circle-outline" size={16} color="#f4511e" style={styles.notesIcon} />
                  <Text style={[styles.treatmentNotes, isDark && styles.textDark]}>
                    {treatment.notes}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.treatmentFooter}>
              <TouchableOpacity
                style={[styles.statusButton, treatment.status === 'active' && styles.pauseButton]}
                onPress={() => handleTreatmentAction(treatment, treatment.status === 'active' ? 'pause' : 'complete')}
              >
                <Text style={styles.statusButtonText}>
                  {treatment.status === 'active' ? 'Mettre en pause' : 'Marquer comme terminé'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
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

      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={[styles.modalContainer, isDark && styles.modalContainerDark]}>
          <View style={[styles.modalContent, isDark && styles.modalContentDark]}>
            <Text style={[styles.modalTitle, isDark && styles.titleDark]}>
              {editingTreatment ? 'Modifier le traitement' : 'Ajouter un traitement'}
            </Text>

            <TextInput
              style={[styles.modalInput, isDark && styles.modalInputDark]}
              placeholder="Nom du traitement"
              placeholderTextColor={isDark ? '#888' : '#666'}
              value={newTreatment.name}
              onChangeText={(text) => setNewTreatment({ ...newTreatment, name: text })}
            />

            <TextInput
              style={[styles.modalInput, isDark && styles.modalInputDark]}
              placeholder="Dosage"
              placeholderTextColor={isDark ? '#888' : '#666'}
              value={newTreatment.dosage}
              onChangeText={(text) => setNewTreatment({ ...newTreatment, dosage: text })}
            />

            <TextInput
              style={[styles.modalInput, isDark && styles.modalInputDark]}
              placeholder="Fréquence"
              placeholderTextColor={isDark ? '#888' : '#666'}
              value={newTreatment.frequency}
              onChangeText={(text) => setNewTreatment({ ...newTreatment, frequency: text })}
            />

            <TouchableOpacity
              style={[styles.dateButton, isDark && styles.dateButtonDark]}
              onPress={() => {
                setDateField('startDate');
                setShowDatePicker(true);
              }}
            >
              <Text style={[styles.dateButtonText, isDark && styles.textDark]}>
                Date de début: {new Date(newTreatment.startDate || '').toLocaleDateString()}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.dateButton, isDark && styles.dateButtonDark]}
              onPress={() => {
                setDateField('nextDose');
                setShowDatePicker(true);
              }}
            >
              <Text style={[styles.dateButtonText, isDark && styles.textDark]}>
                Prochaine prise: {newTreatment.nextDose ? new Date(newTreatment.nextDose).toLocaleString() : 'Non définie'}
              </Text>
            </TouchableOpacity>

            <TextInput
              style={[styles.modalInput, styles.notesInput, isDark && styles.modalInputDark]}
              placeholder="Notes (optionnel)"
              placeholderTextColor={isDark ? '#888' : '#666'}
              value={newTreatment.notes}
              onChangeText={(text) => setNewTreatment({ ...newTreatment, notes: text })}
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowAddModal(false);
                  setEditingTreatment(null);
                  setNewTreatment({
                    name: '',
                    dosage: '',
                    frequency: '',
                    startDate: new Date().toISOString(),
                    status: 'active',
                  });
                }}
              >
                <Text style={styles.modalButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveTreatment}
              >
                <Text style={styles.modalButtonText}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {showDatePicker && (
        <DateTimePicker
          value={new Date(newTreatment[dateField] || new Date())}
          mode="datetime"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
        />
      )}
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
  treatmentsContainer: {
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
  treatmentsContainerDark: {
    backgroundColor: '#283593',
  },
  treatmentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  treatmentsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1565c0',
  },
  addButton: {
    padding: 5,
  },
  treatmentCard: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  treatmentCardDark: {
    backgroundColor: '#3949ab',
  },
  treatmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  treatmentTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  treatmentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1565c0',
  },
  treatmentDetails: {
    marginTop: 5,
  },
  treatmentText: {
    fontSize: 14,
    color: '#1976d2',
    marginBottom: 5,
  },
  treatmentNotes: {
    fontSize: 14,
    color: '#1976d2',
    fontStyle: 'italic',
    marginTop: 5,
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
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  treatmentActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 5,
    marginLeft: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailIcon: {
    marginRight: 8,
    color: '#2196f3',
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
  },
  notesIcon: {
    marginRight: 8,
    marginTop: 2,
    color: '#2196f3',
  },
  treatmentFooter: {
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#90caf9',
    paddingTop: 15,
  },
  statusButton: {
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#2196f3',
  },
  pauseButton: {
    backgroundColor: '#ffa726',
  },
  statusButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainerDark: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  modalContentDark: {
    backgroundColor: '#283593',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1565c0',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#90caf9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    color: '#1565c0',
  },
  modalInputDark: {
    borderColor: '#3949ab',
    color: '#e3f2fd',
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#90caf9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#e3f2fd',
  },
  dateButtonDark: {
    borderColor: '#3949ab',
    backgroundColor: '#3949ab',
  },
  dateButtonText: {
    color: '#1565c0',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#e53935',
  },
  saveButton: {
    backgroundColor: '#2196f3',
  },
  modalButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
