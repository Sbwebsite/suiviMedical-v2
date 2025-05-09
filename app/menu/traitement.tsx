import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// Définir les types pour les moments
type Moment = 'Matin' | 'Midi' | 'Soir';

interface Medicament {
  id: number;
  nom: string;
  moment: Moment[];
}

interface Traitement {
  id: number;
  description: string;
  medicaments: Medicament[];
  enEdition: boolean;
}

export default function TraitementScreen() {
  const [traitements, setTraitements] = useState<Traitement[]>([]);
  const [typeDiabete, setTypeDiabete] = useState<'Type 1' | 'Type 2'>('Type 1');
  const [utiliseInsuline, setUtiliseInsuline] = useState<boolean>(false);
  const [infosEnEdition, setInfosEnEdition] = useState<boolean>(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const toggleInfosEdition = () => setInfosEnEdition(!infosEnEdition);

  const ajouterTraitement = () => {
    setTraitements([
      ...traitements,
      {
        id: Date.now(),
        description: '',
        medicaments: [],
        enEdition: true,
      },
    ]);
  };

  const toggleEdition = (id: number) => {
    setTraitements((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, enEdition: !t.enEdition } : t
      )
    );
  };

  const modifierTraitement = (id: number, champ: keyof Traitement, valeur: any) => {
    setTraitements((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, [champ]: valeur } : t
      )
    );
  };

  const ajouterMedicament = (traitementId: number) => {
    setTraitements((prev) =>
      prev.map((t) =>
        t.id === traitementId
          ? {
              ...t,
              medicaments: [
                ...t.medicaments,
                { id: Date.now(), nom: '', moment: [] },
              ],
            }
          : t
      )
    );
  };

  const modifierMedicament = (
    traitementId: number,
    medicamentId: number,
    champ: keyof Medicament,
    valeur: any
  ) => {
    setTraitements((prev) =>
      prev.map((t) =>
        t.id === traitementId
          ? {
              ...t,
              medicaments: t.medicaments.map((m) =>
                m.id === medicamentId ? { ...m, [champ]: valeur } : m
              ),
            }
          : t
      )
    );
  };

  const supprimerMedicament = (traitementId: number, medicamentId: number) => {
    setTraitements((prev) =>
      prev.map((t) =>
        t.id === traitementId
          ? {
              ...t,
              medicaments: t.medicaments.filter((m) => m.id !== medicamentId),
            }
          : t
      )
    );
  };

  const supprimerTraitement = (id: number) => {
    Alert.alert(
      'Confirmation',
      'Êtes-vous sûr de vouloir supprimer ce traitement ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () =>
            setTraitements((prev) => prev.filter((t) => t.id !== id)),
        },
      ]
    );
  };

  const totalTraitements = traitements.length;
  const totalMedicaments = traitements.reduce((acc, t) => acc + t.medicaments.length, 0);

  return (
    <ScrollView style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.header}>
        <Ionicons
          name="medical-outline"
          size={60}
          color="#2196f3"
          style={styles.headerIcon}
        />
        <Text style={[styles.title, isDark && styles.titleDark]}>
          Mes traitements
        </Text>
      </View>

      {/* Bloc d'infos générales */}
      <View style={[styles.infoCard, isDark && styles.infoCardDark]}>
        <View style={styles.headerRow}>
          <Text style={[styles.cardTitle, isDark && styles.textDark]}>
            Informations médicales
          </Text>
          <TouchableOpacity onPress={toggleInfosEdition}>
            <Ionicons 
              name={infosEnEdition ? "checkmark-circle" : "create"} 
              size={24} 
              color="#2196f3" 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <Text style={[styles.label, isDark && styles.textDark]}>Type de diabète :</Text>
          {infosEnEdition ? (
            <TouchableOpacity
              style={[styles.toggleBtn, isDark && styles.toggleBtnDark]}
              onPress={() =>
                setTypeDiabete(typeDiabete === 'Type 1' ? 'Type 2' : 'Type 1')
              }
            >
              <Text style={[styles.toggleBtnText, isDark && styles.textDark]}>{typeDiabete}</Text>
            </TouchableOpacity>
          ) : (
            <Text style={[styles.readonlyInput, isDark && styles.textDark]}>{typeDiabete}</Text>
          )}
        </View>

        <View style={styles.row}>
          <Text style={[styles.label, isDark && styles.textDark]}>Utilise insuline :</Text>
          {infosEnEdition ? (
            <Switch
              value={utiliseInsuline}
              onValueChange={setUtiliseInsuline}
              trackColor={{ false: '#90caf9', true: '#2196f3' }}
              thumbColor={utiliseInsuline ? '#fff' : '#f4f3f4'}
            />
          ) : (
            <Text style={[styles.readonlyInput, isDark && styles.textDark]}>
              {utiliseInsuline ? 'Oui' : 'Non'}
            </Text>
          )}
        </View>
      </View>

      {/* Liste des traitements */}
      {traitements.map((traitement) => (
        <View key={traitement.id} style={[styles.traitementCard, isDark && styles.traitementCardDark]}>
          <View style={styles.headerRow}>
            <Text style={[styles.cardTitle, isDark && styles.textDark]}>
              Traitement #{traitement.id}
            </Text>
            <TouchableOpacity onPress={() => toggleEdition(traitement.id)}>
              <Ionicons 
                name={traitement.enEdition ? "checkmark-circle" : "create"} 
                size={24} 
                color="#2196f3" 
              />
            </TouchableOpacity>
          </View>

          {traitement.enEdition ? (
            <TextInput
              placeholder="Description du traitement"
              style={[styles.input, isDark && styles.inputDark]}
              value={traitement.description}
              onChangeText={(text) =>
                modifierTraitement(traitement.id, 'description', text)
              }
              placeholderTextColor={isDark ? '#888' : '#999'}
            />
          ) : (
            <Text style={[styles.readonlyInput, isDark && styles.textDark]}>
              {traitement.description || 'Aucune description'}
            </Text>
          )}

          {traitement.medicaments.map((medicament) => (
            <View key={medicament.id} style={styles.medicamentRow}>
              {traitement.enEdition ? (
                <TextInput
                  placeholder="Nom du médicament"
                  style={[styles.input, isDark && styles.inputDark]}
                  value={medicament.nom}
                  onChangeText={(text) =>
                    modifierMedicament(traitement.id, medicament.id, 'nom', text)
                  }
                  placeholderTextColor={isDark ? '#888' : '#999'}
                />
              ) : (
                <Text style={[styles.readonlyInput, isDark && styles.textDark]}>{medicament.nom}</Text>
              )}

              <View style={styles.momentContainer}>
                {['Matin', 'Midi', 'Soir'].map((moment: string, index: number) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.momentButton,
                      medicament.moment.includes(moment as Moment) && styles.momentButtonActive,
                      isDark && styles.momentButtonDark
                    ]}
                    onPress={() => {
                      const isChecked = medicament.moment.includes(moment as Moment);
                      if (isChecked) {
                        modifierMedicament(
                          traitement.id,
                          medicament.id,
                          'moment',
                          medicament.moment.filter((m) => m !== moment)
                        );
                      } else {
                        modifierMedicament(
                          traitement.id,
                          medicament.id,
                          'moment',
                          [...medicament.moment, moment as Moment]
                        );
                      }
                    }}
                  >
                    <Text style={[
                      styles.momentText,
                      medicament.moment.includes(moment as Moment) && styles.momentTextActive,
                      isDark && styles.textDark
                    ]}>
                      {moment}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {traitement.enEdition && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => supprimerMedicament(traitement.id, medicament.id)}
                >
                  <Ionicons name="trash-outline" size={24} color="#e53935" />
                </TouchableOpacity>
              )}
            </View>
          ))}

          {traitement.enEdition && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => ajouterMedicament(traitement.id)}
            >
              <Ionicons name="add-circle-outline" size={20} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.addButtonText}>Ajouter un médicament</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.deleteTraitementButton}
            onPress={() => supprimerTraitement(traitement.id)}
          >
            <Ionicons name="trash-outline" size={20} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.deleteTraitementText}>Supprimer le traitement</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity
        style={styles.addTraitementButton}
        onPress={ajouterTraitement}
      >
        <Ionicons name="add-circle-outline" size={24} color="#fff" style={styles.buttonIcon} />
        <Text style={styles.addTraitementText}>Ajouter un traitement</Text>
      </TouchableOpacity>

      <View style={[styles.statsCard, isDark && styles.statsCardDark]}>
        <Text style={[styles.statsText, isDark && styles.textDark]}>
          Total des traitements : {totalTraitements}
        </Text>
        <Text style={[styles.statsText, isDark && styles.textDark]}>
          Total des médicaments : {totalMedicaments}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    padding: 20,
  },
  containerDark: {
    backgroundColor: '#1a237e',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerIcon: {
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1565c0',
    textAlign: 'center',
  },
  titleDark: {
    color: '#90caf9',
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1565c0',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: '#1976d2',
  },
  toggleBtn: {
    backgroundColor: '#e3f2fd',
    padding: 10,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  toggleBtnDark: {
    backgroundColor: '#3949ab',
  },
  toggleBtnText: {
    color: '#1565c0',
    fontWeight: '500',
  },
  readonlyInput: {
    flex: 1,
    fontSize: 16,
    color: '#1976d2',
  },
  traitementCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  traitementCardDark: {
    backgroundColor: '#283593',
  },
  input: {
    borderWidth: 1,
    borderColor: '#90caf9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    color: '#1565c0',
    backgroundColor: '#f5f9ff',
  },
  inputDark: {
    borderColor: '#3949ab',
    color: '#e3f2fd',
    backgroundColor: '#1a237e',
  },
  medicamentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#f5f9ff',
    padding: 12,
    borderRadius: 8,
  },
  momentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 10,
    flex: 1,
  },
  momentButton: {
    padding: 8,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#e3f2fd',
  },
  momentButtonActive: {
    backgroundColor: '#2196f3',
  },
  momentButtonDark: {
    backgroundColor: '#3949ab',
  },
  momentText: {
    fontSize: 14,
    color: '#1565c0',
  },
  momentTextActive: {
    color: '#fff',
  },
  deleteButton: {
    padding: 8,
  },
  addButton: {
    backgroundColor: '#2196f3',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  deleteTraitementButton: {
    backgroundColor: '#e53935',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  deleteTraitementText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  addTraitementButton: {
    backgroundColor: '#2196f3',
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  addTraitementText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonIcon: {
    marginRight: 8,
  },
  statsCard: {
    backgroundColor: '#fff',
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
  statsCardDark: {
    backgroundColor: '#283593',
  },
  statsText: {
    fontSize: 16,
    color: '#1976d2',
    marginBottom: 8,
  },
  textDark: {
    color: '#e3f2fd',
  },
});

