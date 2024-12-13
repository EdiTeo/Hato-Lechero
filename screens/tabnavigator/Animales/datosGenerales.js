import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; // Importa useFocusEffect

const DatosGenerales = ({ route, navigation }) => {
  const [vaca, setVaca] = useState(route.params?.params?.vaca || route.params?.params?.vacaData1); // Mantener el estado de la vaca
  console.log("Datos recibidos en route.params:", route.params);

  useEffect(() => {
    if (route.params?.vaca) {
      setVaca(route.params.vaca); // Actualiza la vaca cuando se cambien los datos
    }
  }, [route.params?.vaca]);

  useFocusEffect(
    React.useCallback(() => {
      // Recarga los datos de la vaca cuando la pantalla obtiene foco
      if (route.params?.vaca) {
        setVaca(route.params.vaca);
      }
    }, [route.params?.vaca])
  );

  const { nombre, etapa_de_crecimiento, vaca_id, fecha_nacimiento, raza, estado_reproductivo, estado } = vaca;

  const calcularEdad = (fechaNacimiento) => {
    const nacimiento = new Date(fechaNacimiento);
    const hoy = new Date();

    let edadAnios = hoy.getFullYear() - nacimiento.getFullYear();
    let edadMeses = hoy.getMonth() - nacimiento.getMonth();

    if (edadMeses < 0) {
      edadAnios--;
      edadMeses += 12;
    }

    return `${edadAnios} años y ${edadMeses} meses`;
  };

  const edadCalculada = calcularEdad(fecha_nacimiento);

  const onEditarVaca = (vaca) => {
    navigation.navigate('FormularioAddVaca', { 
      vacaEditar: vaca
    });
  };

 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Datos Generales</Text>
      <Text style={styles.subtitle}>Último chequeo</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Nombre:</Text>
        <Text style={styles.value}>{nombre}</Text>
        <Text style={styles.label}>Propósito:</Text>
        <Text style={styles.value}>Leche</Text>
        <Text style={styles.label}>Etapa desarrollo:</Text>
        <Text style={styles.value}>{etapa_de_crecimiento}</Text>
        <Text style={styles.label}>Código registro:</Text>
        <Text style={styles.value}>{vaca_id}</Text>
        <Text style={styles.label}>Fecha nacimiento:</Text>
        <Text style={styles.value}>{fecha_nacimiento}</Text>
        <Text style={styles.label}>Edad:</Text>
        <Text style={styles.value}>{edadCalculada}</Text>
        <Text style={styles.label}>Raza:</Text>
        <Text style={styles.value}>{raza}</Text>
      </View>

      

      {/* Botón para editar los datos */}
      <TouchableOpacity style={styles.editButton} onPress={() => onEditarVaca({ nombre, estado, etapa_de_crecimiento, vaca_id, fecha_nacimiento, raza, estado_reproductivo })}>
        <Text style={styles.editButtonText}>✎</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
  },
  infoContainer: {
    marginVertical: 10,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    marginBottom: 5,
  },
  editButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#FF5722',
    borderRadius: 50,
    padding: 15,
  },
  editButtonText: {
    fontSize: 24,
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#FF5722',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default DatosGenerales;
