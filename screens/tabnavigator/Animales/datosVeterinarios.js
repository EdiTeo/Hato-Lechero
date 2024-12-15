import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const datosVeterinarios = ({ route, navigation }) => {
  const [datos, setDatos] = useState(route.params?.params?.vaca || route.params?.params?.vacaData1);
  const [historial, setHistorial] = useState([]);  // Inicializamos historial como un arreglo vacío
  console.log(datos);

  useEffect(() => {
    if (route.params?.vaca) {
      setDatos(route.params.vaca);
    }
  }, [route.params?.vaca]);

  useFocusEffect(
    React.useCallback(() => {
      async function getHistorial() {
        try {
          const response = await axios.get(`http://192.168.20.3:8081/api/vacas/${datos.vaca_id}/historial`);
          const tratamientos = Array.isArray(response.data.tratamientos) ? response.data.tratamientos : [];
          const vacunaciones = Array.isArray(response.data.vacunaciones) ? response.data.vacunaciones : [];
          
          // Establece el historial de los tratamientos y vacunaciones
          setHistorial({ tratamientos, vacunaciones });
          
          console.log(historial);
          console.log('Vacunaciones:', vacunaciones);  // Verificamos si es un arreglo
        } catch (error) {
          console.log(error);
          setHistorial([]);  // Si hay error, aseguramos que historial sea un arreglo vacío
        }
      }
      getHistorial();
    }, [datos.id])
  );

  const tratamientos = historial.tratamientos || [];
  const vacunas = historial.vacunaciones || [];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Datos Veterinarios de: {datos.nombre}</Text>
        <Text style={styles.subtitle}>Sana</Text>
      </View>

      <View style={styles.content}>
        {tratamientos.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tratamientos</Text>
            <View style={styles.tableHeader}>
              <Text style={styles.tableCell}>Fecha Inicio</Text>
              <Text style={styles.tableCell}>Días</Text>
              <Text style={styles.tableCell}>Descripción</Text>
              <Text style={styles.tableCell}>Notas</Text>
            </View>
            <ScrollView style={styles.tableContainer}>
              {tratamientos.map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{item.fecha_inicio}</Text>
                  <Text style={styles.tableCell}>{item.dias}</Text>
                  <Text style={styles.tableCell}>{item.descripcion}</Text>
                  <Text style={styles.tableCell}>{item.notas || 'N/A'}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {vacunas.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vacunas</Text>
            <View style={styles.tableHeader}>
              <Text style={styles.tableCell}>Fecha Inicio</Text>
              <Text style={styles.tableCell}>Vacuna</Text>
              <Text style={styles.tableCell}>Enfermedad</Text>
              <Text style={styles.tableCell}>Notas</Text>
            </View>
            <ScrollView style={styles.tableContainer}>
              {vacunas.map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{item.fecha_inicio}</Text>
                  <Text style={styles.tableCell}>{item.medicamento}</Text>
                  <Text style={styles.tableCell}>{item.descripcion}</Text>
                  <Text style={styles.tableCell}>{item.notas || 'N/A'}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {tratamientos.length === 0 && vacunas.length === 0 && (
          <Text style={styles.noDataText}>Sin datos</Text>
        )}
      </View>

      {/* Botón flotante fijo en la parte inferior derecha */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('chequeoVeterinario',route.params)}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 16,
  },
  title: {
    fontSize: 20,
    color: '#fff',
  },
  subtitle: {
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
    flexDirection: 'column',  // Cambiado a 'column' para apilar las secciones una debajo de la otra
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 8,
    marginBottom: 5,
  },
  tableCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tableContainer: {
    maxHeight: 200,  // Limita la altura de la tabla para que sea desplazable
  },
  noDataText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,  // Ajustamos a 16 para mantenerlo a una distancia del borde
    backgroundColor: '#f44336',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
});

export default datosVeterinarios;
