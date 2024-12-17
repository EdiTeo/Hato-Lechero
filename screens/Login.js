import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';

const Login = ({ navigation }) => {
  const [celular, setCelular] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const isFormValid = () => celular.trim() !== '' && password.trim() !== '';

  const handleLogin = async () => {
    if (!isFormValid()) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }

    setLoading(true);
    try {
      
      const response = await axios.post('http://192.168.1.71:19000/api/login', {
        celular,
        password,
      });

      
      console.log('Datos enviados:',  response.data.productor_id );
      //Si el inicio de sesión es exitoso
      Alert.alert('Éxito', response.data.message);
      navigation.navigate('Inicio', {
        productor_id: response.data.productor_id, // Pasa el productor_id a la pantalla de inicio
    }); //Redirigir a la pantalla principal
    } catch (error) {
      //Manejar errores
      console.error('Error al iniciar sesión:', error);

      if (error.response) {
        Alert.alert('Error', error.response.data.error || 'Credenciales inválidas');
      } else if (error.request) {
        Alert.alert('Error', 'No se pudo conectar con el servidor. Verifica tu conexión.');
      } else {
        Alert.alert('Error', 'Ocurrió un error inesperado.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inicio de Sesión</Text>

      <TextInput
        placeholder="Celular"
        value={celular}
        onChangeText={setCelular}
        keyboardType="numeric"
        style={styles.input}
        placeholderTextColor="#9DBA89"
      />
      <TextInput
        placeholder="Contraseña"
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
          onPress={handleLogin}
          disabled={!isFormValid()}
        >
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>¿No tienes cuenta? Regístrate aquí</Text>
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

export default Login;