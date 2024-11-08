
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';



const FormularioAddVaca = ({ navigation, route }) => {
  const [nombre, setNombre] = useState('');
  const [etapaCrecimiento, setEtapaCrecimiento] = useState('');
  const [estadoReproductivo, setEstadoReproductivo] = useState('');
  const [raza, setRaza] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState(new Date());
  const [estado, setEstado] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    if (route.params?.vacaEditar) {
      const vacaEditar = route.params.vacaEditar;
      setNombre(vacaEditar.nombre);
      setEtapaCrecimiento(vacaEditar.etapaCrecimiento);
      setEstadoReproductivo(vacaEditar.estadoReproductivo);
      setRaza(vacaEditar.raza);
      setFechaNacimiento(new Date(vacaEditar.fechaNacimiento));
      setEstado(vacaEditar.estado);
    }
  }, [route.params?.vacaEditar]);

  const agregarVaca = () => {
    if(validacionEntradas()){
      const nuevaVaca = {
        id: route.params?.vacaEditar?.id || Math.floor(Math.random() * 100000).toString(),
        nombre,
        etapaCrecimiento,
        estadoReproductivo,
        raza,
        fechaNacimiento: fechaNacimiento.toLocaleDateString(),
        estado,
      };

      if (route.params?.vacaEditar) {
        route.params.onGuardar(nuevaVaca); //solo si se esta editando
      } else {
        route.params.onAgregarVaca(nuevaVaca); //si se esta agregando
      }
      navigation.goBack();
    }
  };

  const validacionEntradas = () => {
    const onlyLettersRegex = /^[a-zA-Z\s]+$/;//regex solo letras
    if (!nombre || !etapaCrecimiento || !estadoReproductivo || !raza || !estado) {
      setAlertMessage('Por favor, complete todos los campos.');
      setModalVisible(true);
      return false;
    }
    if (!onlyLettersRegex.test(nombre) || !onlyLettersRegex.test(raza)) {
      setAlertMessage('El nombre y la raza deben contener solo letras.');
      setModalVisible(true);
      return false;
    }
    return true;
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Nombre de la Vaca" style={styles.input} value={nombre} onChangeText={setNombre} />

      <Text style={styles.label}>Etapa de Crecimiento:</Text>
      <Picker selectedValue={etapaCrecimiento} style={styles.picker} onValueChange={setEtapaCrecimiento}>
        <Picker.Item label="Selecciona la etapa" value="" />
        <Picker.Item label="Ternero" value="ternero" />
        <Picker.Item label="Juvenil" value="juvenil" />
        <Picker.Item label="Adulto" value="adulto" />
      </Picker>

      <Text style={styles.label}>Estado Reproductivo:</Text>
      <Picker selectedValue={estadoReproductivo} style={styles.picker} onValueChange={setEstadoReproductivo}>
        <Picker.Item label="Selecciona el estado" value="" />
        <Picker.Item label="Gestante" value="Gestante" />
        <Picker.Item label="No gestante" value="No gestante" />
        <Picker.Item label="En lactancia" value="En Lactancia" />
        <Picker.Item label="Seco" value="Seco" />
      </Picker>

      <TextInput placeholder="Raza" style={styles.input} value={raza} onChangeText={setRaza} />

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
      <Picker selectedValue={estado} style={styles.picker} onValueChange={setEstado}>
        <Picker.Item label="Selecciona el estado" value="" />
        <Picker.Item label="Activa" value="activa" />
        <Picker.Item label="Inactiva" value="inactiva" />
      </Picker>

      <View style={styles.buttonContainer}>
        <Button title="Cancelar" color="#EC221F" onPress={() => navigation.goBack()} />
        <Button title="Aceptar" color="green" onPress={agregarVaca} />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>{alertMessage}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flex: 1 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginVertical: 5, borderRadius: 5 },
  picker: { borderWidth: 1, borderColor: '#ccc', marginVertical: 5 },
  label: { fontSize: 16, fontWeight: '600', marginTop: 10 },
  dateText: { fontSize: 16, marginVertical: 5 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  modalBackground: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContainer: { width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10, alignItems: 'center' },
  modalText: { fontSize: 16, marginBottom: 15, textAlign: 'center' },
  closeButton: { backgroundColor: 'green', padding: 10, borderRadius: 5 },
  closeButtonText: { color: 'white', fontWeight: 'bold' },
});

export default FormularioAddVaca;
