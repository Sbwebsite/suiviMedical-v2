import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';

// Define your color palette
const primaryBlue = '#2196f3';
const lightBlue = '#90caf9';
const white = '#f0f8ff';
const textColor = '#1565c0';

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhoneNumber = (phone: string): boolean => {
  // Basic French phone number validation (adjust as needed)
  const phoneRegex = /^(0|\+33)[1-9]([-.\s]?[0-9]{2}){4}$/;
  return phoneRegex.test(phone);
};

// Define the type for the form data
interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  bloodType: string;
  hasDiabetes: 'oui' | 'non' | '';
  diabetesType: string;
  takesMedicine: 'oui' | 'non' | '';
  medicineType: string;
}

export default function Register() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    bloodType: '',
    hasDiabetes: '',
    diabetesType: '',
    takesMedicine: '',
    medicineType: '',
  });
  const progress = useRef(new Animated.Value(0)).current;
  const formOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: (step - 1) / 3, // For 4 steps (1 to 4)
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    Animated.timing(formOpacity, {
      toValue: 1,
      duration: 200,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, [step]);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const validateStep = (): boolean => {
    const requiredFields: { [key: number]: (keyof FormData)[] } = {
      1: ['name', 'email', 'phone', 'password', 'confirmPassword'],
      2: ['bloodType', 'hasDiabetes'],
      3: ['takesMedicine'],
      4: [], // No validation needed for the review step
    };

    for (const field of requiredFields[step] || []) {
      if (!formData[field]) {
        Alert.alert('Erreur', `Le champ "${field}" est requis.`);
        return false;
      }
    }

    if (step === 1) {
      if (!isValidEmail(formData.email)) {
        Alert.alert('Erreur', 'Format d\'email invalide.');
        return false;
      }
      if (!isValidPhoneNumber(formData.phone)) {
        Alert.alert('Erreur', 'Numéro de téléphone invalide.');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
        return false;
      }
    }

    if (step === 2 && formData.hasDiabetes === 'oui' && !formData.diabetesType) {
      Alert.alert('Erreur', 'Veuillez spécifier le type de diabète.');
      return false;
    }

    if (step === 3 && formData.takesMedicine === 'oui' && !formData.medicineType) {
      Alert.alert('Erreur', 'Veuillez spécifier le type de médicament.');
      return false;
    }

    return true;
  };

const handleNext = () => {
  if (validateStep()) {
    if (step === 4) {
      Alert.alert('Succès', `Inscription terminée pour ${formData.email}`);
      router.push('/'); // Navigate back to the root route (login)
    } else {
      Animated.timing(formOpacity, {
        toValue: 0,
        duration: 200,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start(() => {
        setStep(step + 1);
      });
    }
  }
};

  const handleBack = () => {
    Animated.timing(formOpacity, {
      toValue: 0,
      duration: 200,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => {
      if (step > 1) {
        setStep(step - 1);
      }
    });
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <TextInput
              style={styles.input}
              placeholder="Nom"
              value={formData.name}
              onChangeText={(text) => handleChange('name', text)}
              placeholderTextColor={lightBlue}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={formData.email}
              onChangeText={(text) => handleChange('email', text)}
              keyboardType="email-address"
              placeholderTextColor={lightBlue}
            />
            <TextInput
              style={styles.input}
              placeholder="Téléphone"
              value={formData.phone}
              onChangeText={(text) => handleChange('phone', text)}
              keyboardType="phone-pad"
              placeholderTextColor={lightBlue}
            />
            <TextInput
              style={styles.input}
              placeholder="Mot de passe"
              value={formData.password}
              onChangeText={(text) => handleChange('password', text)}
              secureTextEntry
              placeholderTextColor={lightBlue}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirmer le mot de passe"
              value={formData.confirmPassword}
              onChangeText={(text) => handleChange('confirmPassword', text)}
              secureTextEntry
              placeholderTextColor={lightBlue}
            />
          </>
        );
      case 2:
        return (
          <>
            <TextInput
              style={styles.input}
              placeholder="Groupe sanguin (ex: A+)"
              value={formData.bloodType}
              onChangeText={(text) => handleChange('bloodType', text)}
              placeholderTextColor={lightBlue}
            />
            <Text style={styles.label}>Avez-vous le diabète ?</Text>
            <View style={styles.optionGroup}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  formData.hasDiabetes === 'oui' && styles.selected,
                ]}
                onPress={() => handleChange('hasDiabetes', 'oui')}
              >
                <Text style={styles.optionText}>Oui</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  formData.hasDiabetes === 'non' && styles.selected,
                ]}
                onPress={() => handleChange('hasDiabetes', 'non')}
              >
                <Text style={styles.optionText}>Non</Text>
              </TouchableOpacity>
            </View>
            {formData.hasDiabetes === 'oui' && (
              <TextInput
                style={styles.input}
                placeholder="Type de diabète"
                value={formData.diabetesType}
                onChangeText={(text) => handleChange('diabetesType', text)}
                placeholderTextColor={lightBlue}
              />
            )}
          </>
        );
      case 3:
        return (
          <>
            <Text style={styles.label}>Prenez-vous des médicaments ?</Text>
            <View style={styles.optionGroup}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  formData.takesMedicine === 'oui' && styles.selected,
                ]}
                onPress={() => handleChange('takesMedicine', 'oui')}
              >
                <Text style={styles.optionText}>Oui</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  formData.takesMedicine === 'non' && styles.selected,
                ]}
                onPress={() => handleChange('takesMedicine', 'non')}
              >
                <Text style={styles.optionText}>Non</Text>
              </TouchableOpacity>
            </View>
            {formData.takesMedicine === 'oui' && (
              <View style={styles.optionGroup}>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    formData.medicineType === 'comprimés' && styles.selected,
                  ]}
                  onPress={() => handleChange('medicineType', 'comprimés')}
                >
                  <Text style={styles.optionText}>Comprimés</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    formData.medicineType === 'insuline' && styles.selected,
                  ]}
                  onPress={() => handleChange('medicineType', 'insuline')}
                >
                  <Text style={styles.optionText}>Insuline</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        );
      case 4:
        return (
          <>
            <Text style={styles.reviewTitle}>Vérifiez vos informations :</Text>
            {Object.entries(formData).map(([key, value]) => (
              <Text key={key} style={styles.reviewText}>
                {key}: {value || '-'}
              </Text>
            ))}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Progress Line */}
      <View style={styles.progressBarContainer}>
        <Animated.View
          style={[
            styles.progressBarFill,
            {
              width: progress.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>

      <Text style={styles.title}>Inscription</Text>

      <Animated.View style={{ opacity: formOpacity }}>
        {renderStepContent()}
      </Animated.View>

      <View style={styles.navButtons}>
        {step > 1 && (
          <TouchableOpacity style={[styles.button, { backgroundColor: lightBlue }]} onPress={handleBack}>
            <Text style={styles.buttonText}>Retour</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>{step === 4 ? 'Terminer' : 'Suivant'}</Text>
        </TouchableOpacity>
      </View>
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
  progressBarContainer: {
    height: 5,
    backgroundColor: lightBlue,
    borderRadius: 2.5,
    marginBottom: 20,
  },
  progressBarFill: {
    height: 5,
    backgroundColor: primaryBlue,
    borderRadius: 2.5,
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
    color: textColor,
    backgroundColor: white,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: textColor,
  },
  optionGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  optionButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: lightBlue,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
    backgroundColor: white,
  },
  selected: {
    backgroundColor: primaryBlue,
  },
  optionText: {
    color: textColor,
    fontWeight: '500',
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    backgroundColor: primaryBlue,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: white,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  reviewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: primaryBlue,
  },
  reviewText: {
    fontSize: 16,
    marginBottom: 10,
    color: textColor,
    textAlign: 'center',
  },
});