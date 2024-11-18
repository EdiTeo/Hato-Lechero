import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, Image, TextInput } from 'react-native';

const Produccion = () => {
  const [mostrarOpciones, setMostrarOpciones] = useState(false);
  const [mostrarDetalleProduccion, setMostrarDetalleProduccion] = useState(false);
  const [mostrarRegistroMasivo, setMostrarRegistroMasivo] = useState(false);

  const handleProduccionLeche = () => {
    setMostrarDetalleProduccion(true);
    setMostrarOpciones(false); // Oculta las opciones al abrir el detalle
  };

  const handleRegistroMasivo = () => {
    setMostrarRegistroMasivo(true);
    setMostrarOpciones(false); // Oculta las opciones al abrir el formulario de registro masivo
  };

  const handleVolver = () => {
    setMostrarDetalleProduccion(false);
    setMostrarOpciones(false);
    setMostrarRegistroMasivo(false);
  };

  return (
    <View style={styles.container}>
      {mostrarRegistroMasivo ? (
        // Formulario de Registro Masivo
        <View style={styles.registroMasivoContainer}>
          <Text style={styles.header}>Datos del Registro</Text>
          <Text>1/04/2027 9:30AM</Text>

          <Text style={styles.subheader}>Producción de la vaca</Text>
          <Text style={styles.label}>Animal*</Text>
          <TextInput style={styles.input} placeholder="Seleccione un animal" />

          <Text style={styles.label}>Litros de leche*</Text>
          <TextInput style={styles.input} placeholder="Ingrese los litros" keyboardType="numeric" />

          <Button title="Añadir" onPress={() => {}} color="#18C3D1" />

          <View style={styles.tableContainer}>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>Vaca</Text>
              <Text style={styles.tableHeader}>Mañana</Text>
              <Text style={styles.tableHeader}>Tarde</Text>
              <Text style={styles.tableHeader}>Total Leche</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>02</Text>
              <Text style={styles.tableCell}>15</Text>
              <Text style={styles.tableCell}>15</Text>
              <Text style={styles.tableCell}>30</Text>
            </View>
          </View>

          <Button title="Guardar" onPress={handleVolver} color="#18C3D1" />
        </View>
      ) : mostrarDetalleProduccion ? (
        // Vista de detalle de producción de leche
        <View style={styles.detalleProduccion}>
          <Text style={styles.header}>Producción Hoy</Text>
          <Text style={styles.item}>Total <Text style={styles.value}>200 Litros</Text></Text>
          <Text style={styles.item}>En ordeño <Text style={styles.value}>10 animales</Text></Text>
          <Text style={styles.item}>Promedio Diario <Text style={styles.value}>100 Litros</Text></Text>

          <Text style={styles.header}>Producción de la finca</Text>
          <Text style={styles.item}>Total hoy <Text style={styles.value}>200 Litros</Text></Text>
          <Text style={styles.item}>Total ayer <Text style={styles.value}>90 Litros</Text></Text>
          <Text style={styles.item}>2da Quincena Mayo <Text style={styles.value}>100 Litros</Text></Text>

          <Button title="Volver atrás" onPress={handleVolver} color="#18C3D1" />
        </View>
      ) : mostrarOpciones ? (
        // Vista con las opciones "Producción de leche" y "Registro masivo"
        <>
          <View style={styles.opcionesContainer}>
            <TouchableOpacity style={styles.opcion} onPress={handleProduccionLeche}>
              <Image 
                source={require('../Imagenes/ordeno.png')}
                style={styles.imagen}
              />
              <Text style={styles.opcionText}>Producción de leche</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.opcion} onPress={handleRegistroMasivo}>
              <Image 
                source={require('../Imagenes/vaca.png')}
                style={styles.imagen}
              />
              <Text style={styles.opcionText}>Registro masivo</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.botonInferiorContainer}>
            <Button
              title="Volver atrás"
              onPress={() => setMostrarOpciones(false)}
              color="#18C3D1"
            />
          </View>
        </>
      ) : (
        // Vista inicial con datos generales y producción de leche
        <>
          <View style={styles.section}>
            <Text style={styles.header}>DATOS GENERALES</Text>
            <Text style={styles.item}>Total animales: 3 unidades</Text>
            <Text style={styles.item}>En producción: 3 unidades</Text>
            <Text style={styles.item}>Vacas orras: 3 unidades</Text>
            <Text style={styles.item}>Terneros: 3 unidades</Text>
            <Text style={styles.item}>Partos por Día: 3 unidades</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.header}>PRODUCCIÓN LECHE</Text>
            <Text style={styles.item}>Total: 170 Litros</Text>
            <Text style={styles.item}>En ordeño: 2 animales</Text>
            <Text style={styles.item}>Promedio Diario: 85 Litros</Text>
          </View>

          <Button
            title="Cargar Datos"
            onPress={() => setMostrarOpciones(true)}
            color="#18C3D1"
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#90EE90',
    flex: 1,
    justifyContent: 'center',
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  item: {
    fontSize: 16,
    marginBottom: 5,
  },
  value: {
    fontWeight: 'bold',
  },
  opcionesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
  },
  opcion: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    width: '45%',
    alignItems: 'center',
  },
  opcionText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  imagen: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  botonInferiorContainer: {
    marginTop: 'auto',
    alignItems: 'center',
  },
  detalleProduccion: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  registroMasivoContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  subheader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
  },
  label: {
    fontSize: 14,
    marginVertical: 5,
  },
  input: {
    backgroundColor: '#F0F0F0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  tableContainer: {
    marginTop: 20,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tableHeader: {
    fontWeight: 'bold',
    width: '25%',
    textAlign: 'center',
  },
  tableCell: {
    width: '25%',
    textAlign: 'center',
  },
});

export default Produccion;
