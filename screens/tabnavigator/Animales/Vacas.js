import { View, Text, TextInput, Button, FlatList, StyleSheet, Picker, Modal, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';

const Vacas = () => {
  const [nombre, setNombre] = useState('');
  const [etapaCrecimiento, setEtapaCrecimiento] = useState('');
  const [estadoReproductivo, setEstadoReproductivo] = useState('');
  const [raza, setRaza] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState(new Date());
  const [estado, setEstado] = useState('');
  const [vacas, setVacas] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); //Estado=> controlar el modal

  //Agregamos a lista a una VACA
  const agregarVaca = () => {
    if (nombre && etapaCrecimiento && estadoReproductivo && raza && estado) {
      const nuevaVaca = { 
        id: Math.random().toString(), 
        nombre, 
        etapaCrecimiento, 
        estadoReproductivo, 
        raza, 
        fechaNacimiento: fechaNacimiento.toLocaleDateString(), 
        estado 
      };
      setVacas([...vacas, nuevaVaca]);
      limpiarFormulario();
      setModalVisible(true); //Mostrar el modal de confirmación
    } else {
      alert('Por favor, complete todos los campos');
    }
  };

  //Limpiamos el formulario y restablecemos el estado de creación
  const limpiarFormulario = () => {
    setNombre('');
    setEtapaCrecimiento('');
    setEstadoReproductivo('');
    setRaza('');
    setFechaNacimiento(new Date());
    setEstado('');
    setIsCreating(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro de Vacas</Text>

      {isCreating ? (
        <Button color="red" title="Cancelar" onPress={limpiarFormulario} />
      ) : (
        <Button color="green" title="Crear Vaca" onPress={() => setIsCreating(true)} />
      )}

      {isCreating && (
        <>
          <TextInput
            placeholder="Nombre de la Vaca"
            style={styles.input}
            value={nombre}
            onChangeText={(text) => setNombre(text)}
          />

          <Text style={styles.label}>Etapa de Crecimiento:</Text>
          <Picker
            selectedValue={etapaCrecimiento}
            style={styles.picker}
            onValueChange={(value) => setEtapaCrecimiento(value)}
          >
            <Picker.Item label="Selecciona la etapa" value="" />
            <Picker.Item label="Ternero" value="ternero" />
            <Picker.Item label="Juvenil" value="juvenil" />
            <Picker.Item label="Adulto" value="adulto" />
          </Picker>

          <Text style={styles.label}>Estado Reproductivo:</Text>
          <Picker
            selectedValue={estadoReproductivo}
            style={styles.picker}
            onValueChange={(value) => setEstadoReproductivo(value)}
          >
            <Picker.Item label="Selecciona el estado" value="" />
            <Picker.Item label="Gestante" value="gestante" />
            <Picker.Item label="No gestante" value="no_gestante" />
            <Picker.Item label="En lactancia" value="en_lactancia" />
            <Picker.Item label="Seco" value="seco" />
          </Picker>
          
          <TextInput
            placeholder="Raza"
            style={styles.input}
            value={raza}
            onChangeText={(text) => setRaza(text)}
          />

          <Text style={styles.label}>Fecha de Nacimiento:</Text>
          <Button color='green' title="Seleccionar Fecha" onPress={() => setShowDatePicker(true)} />
          {showDatePicker && (
            <DateTimePicker
              value={fechaNacimiento}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                const currentDate = selectedDate || fechaNacimiento;
                setShowDatePicker(false);
                setFechaNacimiento(currentDate);
              }}
            />
          )}
          <Text style={styles.dateText}>Fecha seleccionada: {fechaNacimiento.toLocaleDateString()}</Text>

          <Text style={styles.label}>Estado:</Text>
          <Picker
            selectedValue={estado}
            style={styles.picker}
            onValueChange={(value) => setEstado(value)}
          >
            <Picker.Item label="Selecciona el estado" value="" />
            <Picker.Item label="Activa" value="activa" />
            <Picker.Item label="Inactiva" value="inactiva" />
          </Picker>

          <Button color="green" title="Agregar Vaca" onPress={agregarVaca} />
        </>
      )}

      <Text style={styles.listTitle}>Lista de Vacas Registradas</Text>
      <FlatList
        data={vacas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.vacaText}>Nombre: {item.nombre}</Text>
            <Text style={styles.vacaText}>Etapa: {item.etapaCrecimiento}</Text>
            <Text style={styles.vacaText}>Estado Reproductivo: {item.estadoReproductivo}</Text>
            <Text style={styles.vacaText}>Raza: {item.raza}</Text>
            <Text style={styles.vacaText}>Fecha Nacimiento: {item.fechaNacimiento}</Text>
            <Text style={styles.vacaText}>Estado: {item.estado}</Text>
          </View>
        )}
      />

      {/*Mostrar el modal de confirmacion*/}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>¡Vaca agregada exitosamente!</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
  },
  dateText: {
    fontSize: 16,
    marginVertical: 5,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  listItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  vacaText: {
    fontSize: 16,
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
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Vacas;
