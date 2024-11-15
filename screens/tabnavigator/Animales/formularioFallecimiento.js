import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const formularioFallecimiento = ({ navigation, route }) => {
  const [causas, setCausas] = useState('');
  const [notas, setNotas] = useState('');
  const [fechafallecimiento, setFechaFallecimiento] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    if (route.params?.vacaEditar) {
      const vacaEditar = route.params.vacaEditar;
      setCausas(vacaEditar.causas);
      setNotas(vacaEditar.notas);
      setFechaFallecimiento(new Date(vacaEditar.fechafallecimiento));
    }
  }, [route.params?.vacaEditar]);

  const agregarVaca = () => {
    if(validacionEntradas()){
      const nuevaVaca = {
        id: route.params?.vacaEditar?.id || Math.floor(Math.random() * 100000).toString(),
        causas,
        notas,
        fechafallecimiento: fechafallecimiento.toLocaleDateString(),
      };

      if (route.params?.vacaEditar) {
        route.params.onGuardar(nuevaVaca); // sólo si se está editando
      } else {
        route.params.onAgregarVaca(nuevaVaca); // si se está agregando
      }
      navigation.goBack();
    }
  };

  const validacionEntradas = () => {
    const onlyLettersRegex = /^[a-zA-Z\s]+$/; // regex solo letras
    if (!causas || !notas) {
      setAlertMessage('Por favor, complete todos los campos.');
      setModalVisible(true);
      return false;
    }
    if (!onlyLettersRegex.test(causas) || !onlyLettersRegex.test(notas)) {
      setAlertMessage('Causas y notas deben contener solo letras.');
      setModalVisible(true);
      return false;
    }
    return true;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Fecha de Fallecimiento:</Text>
      <Button color="green" title="Seleccionar Fecha" onPress={() => setShowDatePicker(true)} />
      {showDatePicker && (
        <DateTimePicker
          value={fechafallecimiento}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            const currentDate = selectedDate || fechafallecimiento;
            setShowDatePicker(false);
            setFechaFallecimiento(currentDate);
          }}
        />
      )}
      <Text style={styles.dateText}>Fecha seleccionada: {fechafallecimiento.toLocaleDateString()}</Text>
      
      <TextInput placeholder="Causas" style={styles.input} value={causas} onChangeText={setCausas} />
      <TextInput placeholder="Notas" style={styles.input} value={notas} onChangeText={setNotas} />

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
  label: { fontSize: 16, fontWeight: '600', marginTop: 10 },
  dateText: { fontSize: 16, marginVertical: 5 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  modalBackground: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContainer: { width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10, alignItems: 'center' },
  modalText: { fontSize: 16, marginBottom: 15, textAlign: 'center' },
  closeButton: { backgroundColor: 'green', padding: 10, borderRadius: 5 },
  closeButtonText: { color: 'white', fontWeight: 'bold' },
});

export default formularioFallecimiento;
