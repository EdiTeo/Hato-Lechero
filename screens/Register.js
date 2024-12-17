import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';

const Register = ({ navigation }) => {
  const [nombre, setNombre] = useState('');
  const [celular, setCelular] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const isFormValid = () => nombre.trim() !== '' && celular.trim() !== '' && email.trim() !== '' && password.trim() !== '';

  const handleRegister = async () => {
    if (!isFormValid()) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }

    setLoading(true);
    try {
      
      await axios.post('http://192.168.1.71:8081/api/register', { nombre, celular, email, password });
      Alert.alert('Registro exitoso');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error en el registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>

      <TextInput
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
        style={styles.input}
        placeholderTextColor="#9DBA89"
      />
      <TextInput
        placeholder="Celular"
        value={celular}
        onChangeText={setCelular}
        keyboardType="numeric"
        style={styles.input}
        placeholderTextColor="#9DBA89"
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        placeholderTextColor="#9DBA89"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        placeholderTextColor="#9DBA89"
      />

      {loading ? (
        <ActivityIndicator size="large" color="#39B047" />
      ) : (
        <TouchableOpacity
          style={[styles.button, !isFormValid() && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={!isFormValid()}
        >
          <Text style={styles.buttonText}>Registrar</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión aquí</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F5F8F2',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#456E0B',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderColor: '#9DBA89',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    backgroundColor: '#FFFFFF',
    marginBottom: 15,
    fontSize: 16,
    color: '#456E0B',
  },
  button: {
    backgroundColor: '#39B047',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#9DBA89',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    color: '#456E0B',
    fontSize: 16,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default Register;