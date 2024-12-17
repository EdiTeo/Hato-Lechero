import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';

const FormularioAddVaca = ({ navigation, route }) => {
  const route1 = useRoute();
  const { productor_id } = route1.params;
  const [nombre, setNombre] = useState('');
  const [etapaCrecimiento, setEtapaCrecimiento] = useState('');
  const [estadoReproductivo, setEstadoReproductivo] = useState('');
  const [raza, setRaza] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState(new Date());
  const [estado, setEstado] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
const[vacaData1,setvacaData1]=useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    if (route.params?.vacaEditar) {
      // Si existe vacaEditar, se editan los datos de la vaca
      console.log("marco");
      const vacaEditar = route.params.vacaEditar;
      setNombre(vacaEditar.nombre);
      setEtapaCrecimiento(vacaEditar.etapa_de_crecimiento);
      setEstadoReproductivo(vacaEditar.estado_reproductivo);
      setRaza(vacaEditar.raza);
      setFechaNacimiento(new Date(vacaEditar.fecha_nacimiento));
      setEstado(vacaEditar.estado);
    } else {
      // Si no existe vacaEditar (agregar una nueva vaca), resetear los estados
      setNombre('');
      setEtapaCrecimiento('');
      setEstadoReproductivo('');
      setRaza('');
      setFechaNacimiento(new Date());
      setEstado('');
    }
  }, [route.params?.vacaEditar]);
  

  const agregarVaca = async () => {
    if (validacionEntradas()) {
      const vacaData = {
        nombre,
        etapa_de_crecimiento: etapaCrecimiento,
        estado_reproductivo: estadoReproductivo,
        raza,
        fecha_nacimiento: fechaNacimiento.toISOString().split('T')[0],
        estado,
      };
  
      try {
        let response;
        if (route.params?.vacaEditar) {
          // Si se está editando, enviar una solicitud PUT
          response = await axios.put(`http://192.168.1.71:8081/api/vacas/${route.params.vacaEditar.vaca_id}`, vacaData);
        } else {
          // Si se está agregando una nueva vaca, enviar una solicitud POST
          //  // Verificar que los datos sean correctos
          vacaData.productor_id = productor_id;
          response = await axios.post('http://192.168.1.71:8081/api/vacas', vacaData);
        }
      
        const jsonResponse = response.data;
        console.log('Respuesta del servidor:', jsonResponse); // Ver la respuesta completa
      
        if (response.status === 201) {
          setAlertMessage('Operación exitosa');
          if (route.params?.onGuardar) {
            route.params.onGuardar(jsonResponse.data);
          } else if (route.params?.onAgregarVaca) {
            route.params.onAgregarVaca(jsonResponse.data);
          }
          
      
          limpiarDatosFormulario();
        } else if (response.status === 200) {
          setAlertMessage('Actualización exitosa');
          if (route.params?.onGuardar) {
            route.params.onGuardar(jsonResponse.data);
          } else if (route.params?.onAgregarVaca) {
            route.params.onAgregarVaca(jsonResponse.data);
          }
          setNombre(vacaData.nombre)
          setvacaData1(vacaData);
          console.log(nombre);
        } else {
          throw new Error(jsonResponse.error || 'Ocurrió un error inesperado');
        }
      } catch (error) {
        console.error('Error:', error);
        setAlertMessage(`Error: ${error.message}`);
      }
      setModalVisible(true);
      navigation.goBack();
    }
  };
  
  // Función para limpiar los datos del formulario
  const limpiarDatosFormulario = () => {
    setNombre('');
    setEtapaCrecimiento('');
    setEstadoReproductivo('');
    setRaza('');
    setFechaNacimiento(new Date()); // O ajusta esto al valor inicial que desees
    setEstado(''); // Si usas algún estado como "activo" o "inactivo", ajusta el valor
  };
  

  const validacionEntradas = () => {
    const onlyLettersRegex = /^[a-zA-Z\s]+$/;
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
        <Picker.Item label="Cría" value="cria" />
      </Picker>
      <Text style={styles.label}>Estado Reproductivo:</Text>
      <Picker selectedValue={estadoReproductivo} style={styles.picker} onValueChange={setEstadoReproductivo}>
        <Picker.Item label="Selecciona el estado" value="" />
        <Picker.Item label="Gestante" value="gestante" />
        <Picker.Item label="No gestante" value="no_gestante" />
        <Picker.Item label="En lactancia" value="en_lactancia" />
        <Picker.Item label="Seco" value="seco" />
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
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>{alertMessage}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => {
    setModalVisible(false); // Cierra el modal
     // Navega a la pantalla 'DetallesVaca' con los datos
  }}>
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
