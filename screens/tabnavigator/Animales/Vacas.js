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
  const [modalVisible, setModalVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editVacaId, setEditVacaId] = useState(null);

  //Función para agregar o editar una vaca
  const agregarVaca = () => {
    if (nombre && etapaCrecimiento && estadoReproductivo && raza && estado) {
      if (isEditing) {
        //Editar vaca existente
        const updatedVacas = vacas.map((vaca) =>
          vaca.id === editVacaId
            ? { ...vaca, nombre, etapaCrecimiento, estadoReproductivo, raza, fechaNacimiento: fechaNacimiento.toLocaleDateString(), estado }
            : vaca
        );
        setVacas(updatedVacas);
        setAlertMessage('¡Vaca actualizada exitosamente!');
      } else {
        // Agregar nueva vaca
        const nuevaVaca = {
          id: Math.floor(Math.random() * 100000).toString(),
          nombre,
          etapaCrecimiento,
          estadoReproductivo,
          raza,
          fechaNacimiento: fechaNacimiento.toLocaleDateString(),
          estado
        };
        setVacas([...vacas, nuevaVaca]);
        setAlertMessage('¡Vaca agregada exitosamente!');
      }
      limpiarFormulario();
      setModalVisible(true);
    } else {
      setAlertMessage('Por favor, complete todos los campos');
      setAlertVisible(true);
    }
  };

  //Función para eliminar una vaca
  const eliminarVaca = (id) => {
    const filteredVacas = vacas.filter((vaca) => vaca.id !== id);
    setVacas(filteredVacas);
    setAlertMessage('¡Vaca eliminada exitosamente!');
    setModalVisible(true);
  };

  //Función para iniciar la edición de una vaca
  const editarVaca = (vaca) => {
    setNombre(vaca.nombre);
    setEtapaCrecimiento(vaca.etapaCrecimiento);
    setEstadoReproductivo(vaca.estadoReproductivo);
    setRaza(vaca.raza);
    setFechaNacimiento(new Date(vaca.fechaNacimiento));
    setEstado(vaca.estado);
    setIsCreating(true);
    setIsEditing(true);
    setEditVacaId(vaca.id);
  };

  //Limpiar formulario y resetear estado de creación
  const limpiarFormulario = () => {
    setNombre('');
    setEtapaCrecimiento('');
    setEstadoReproductivo('');
    setRaza('');
    setFechaNacimiento(new Date());
    setEstado('');
    setIsCreating(false);
    setIsEditing(false);
    setEditVacaId(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro de Vacas</Text>

      {isCreating ? (
        <Button color="#EC221F" title="Cancelar" onPress={limpiarFormulario} />
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
          <Picker selectedValue={etapaCrecimiento} style={styles.picker} onValueChange={(value) => setEtapaCrecimiento(value)}>
            <Picker.Item label="Selecciona la etapa" value="" />
            <Picker.Item label="Ternero" value="ternero" />
            <Picker.Item label="Juvenil" value="juvenil" />
            <Picker.Item label="Adulto" value="adulto" />
          </Picker>

          <Text style={styles.label}>Estado Reproductivo:</Text>
          <Picker selectedValue={estadoReproductivo} style={styles.picker} onValueChange={(value) => setEstadoReproductivo(value)}>
            <Picker.Item label="Selecciona el estado" value="" />
            <Picker.Item label="Gestante" value="Gestante" />
            <Picker.Item label="No gestante" value="No gestante" />
            <Picker.Item label="En lactancia" value="En Lactancia" />
            <Picker.Item label="Seco" value="Seco" />
          </Picker>

          <TextInput placeholder="Raza" style={styles.input} value={raza} onChangeText={(text) => setRaza(text)} />

          <Text style={styles.label}>Fecha de Nacimiento:</Text>
          <Button color="green" title="Seleccionar Fecha" onPress={() => setShowDatePicker(true)} />
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
          <Picker selectedValue={estado} style={styles.picker} onValueChange={(value) => setEstado(value)}>
            <Picker.Item label="Selecciona el estado" value="" />
            <Picker.Item label="Activa" value="activa" />
            <Picker.Item label="Inactiva" value="inactiva" />
          </Picker>

          <Button color="green" title={isEditing ? "Actualizar Vaca" : "Agregar Vaca"} onPress={agregarVaca} />
        </>
      )}

      <Text style={styles.listTitle}>Lista de Vacas Registradas</Text>
      <FlatList
        data={vacas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.vacaText}>Código: {item.id}</Text>
            <Text style={styles.vacaText}>Nombre: {item.nombre}</Text>
            <Text style={styles.vacaText}>Etapa: {item.etapaCrecimiento}</Text>
            <Text style={styles.vacaText}>Estado Reproductivo: {item.estadoReproductivo}</Text>
            <Text style={styles.vacaText}>Raza: {item.raza}</Text>
            <Text style={styles.vacaText}>Fecha Nacimiento: {item.fechaNacimiento}</Text>
            <Text style={styles.vacaText}>Estado: {item.estado}</Text>
            <Button title="Editar" color="orange" onPress={() => editarVaca(item)} />
            <Button title="Eliminar" color="red" onPress={() => eliminarVaca(item.id)} />
          </View>
        )}
      />

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>{alertMessage}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal animationType="slide" transparent={true} visible={alertVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>{alertMessage}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => setAlertVisible(false)}>
              <Text style={styles.modalButtonText}>Aceptar</Text>
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
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 1, height: 3 },
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
    backgroundColor: '#009951',
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Vacas;
