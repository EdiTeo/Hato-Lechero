import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, Button, Platform,ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const Finca = () => {
  const navigation = useNavigation(); // Hook para navegación
  const [modalVisible, setModalVisible] = useState(false); // Controla el modal de reportes
  const [subModalVisible, setSubModalVisible] = useState(false); // Controla el sub-modal
  const [reportModalVisible, setReportModalVisible] = useState(false); // Controla el modal de reportes generados
  const [selectedParam, setSelectedParam] = useState(''); // Estado para el parámetro seleccionado
  const [selectedOption, setSelectedOption] = useState(''); // Estado para la opción seleccionada
  const [selectedDate, setSelectedDate] = useState(new Date()); // Estado para la fecha seleccionada
  const [selectedMonth, setSelectedMonth] = useState(''); // Estado para el mes seleccionado
  const [showDatePicker, setShowDatePicker] = useState(false); // Estado para mostrar el date picker
  const [loading, setLoading] = useState(true);
  const [conteoEtapas, setConteoEtapas] = useState({
    ternero: 0,
    juvenil: 0,
    adulto: 0,
    cria: 0,
  });
  // Datos ficticios para los reportes
  const productionData = {
    fecha: '2024-10-30',
    totalLitros: 250,
    numeroVacas: 20,
  };
  useEffect(() => {
    async function getConteoEtapas() {
      try {
        const response = await axios.get('http://192.168.1.71:8081/api/vacas/contar-por-etapa');
        
        // Procesa los datos recuperados para asignarlos a cada etapa
        const conteo = {
          ternero: 0,
          juvenil: 0,
          adulto: 0,
          cria: 0,
        };
        
        response.data.data.forEach(item => {
          conteo[item.etapa_de_crecimiento] = item.total;
        });

        setConteoEtapas(conteo);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    getConteoEtapas();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }
  // Función para manejar la selección de la fecha
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false); // Oculta el date picker
    if (selectedDate) {
      setSelectedDate(selectedDate); // Actualiza la fecha seleccionada
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={require('../Imagenes/Vaca Leche 3.jpg')}
          style={styles.logo}
        />
      </View>

      {/* Total ganado */}
      <Text style={styles.headerText}>TOTAL GANADO: 150</Text>

      {/* Primera fila: Vacas, Novillas, Terneros, Destetados */}
      <View style={styles.section}>
        <View style={[styles.card, { backgroundColor: '#E74C3C' }]}>
          <Image source={require('../Imagenes/vaca22.png')} style={styles.icon} />
          <Text style={styles.cardTitle}>Vacas</Text>
          <Text style={styles.cardNumber}>{conteoEtapas.adulto}</Text>
        </View>
        <View style={[styles.card, { backgroundColor: '#27AE60' }]}>
          <Image source={require('../Imagenes/vaca (1).png')} style={styles.icon} />
          <Text style={styles.cardTitle}>Novillas</Text>
          <Text style={styles.cardNumber}>{conteoEtapas.juvenil}</Text>
        </View>
        <View style={[styles.card, { backgroundColor: '#8E44AD' }]}>
          <Image source={require('../Imagenes/vaca (2).png')} style={styles.icon} />
          <Text style={styles.cardTitle}>Terneros</Text>
          <Text style={styles.cardNumber}>{conteoEtapas.ternero}</Text>
        </View>
        <View style={[styles.card, { backgroundColor: '#16A085' }]}>
          <Image source={require('../Imagenes/vaca (3).png')} style={styles.icon} />
          <Text style={styles.cardTitle}>Destetados</Text>
          <Text style={styles.cardNumber}>{conteoEtapas.cria}</Text>
        </View>
      </View>

      {/* Subtítulo: Resumen Condicional */}
      <Text style={styles.subHeaderText}>RESUMEN CONDICIONAL</Text>

      {/* Segunda fila: Enfermos, Embarazadas, Ordeño, Seco */}
      <View style={styles.section}>
        <View style={[styles.card, { backgroundColor: '#E74C3C' }]}>
          <Image source={require('../Imagenes/botiquin-de-primeros-auxilios.png')} style={styles.icon} />
          <Text style={styles.cardTitle}>Enfermos</Text>
          <Text style={styles.cardNumber}>20</Text>
        </View>
        <View style={[styles.card, { backgroundColor: '#27AE60' }]}>
          <Image source={require('../Imagenes/embarazada.png')} style={styles.icon} />
          <Text style={styles.cardTitle}>Preñada</Text>
          <Text style={styles.cardNumber}>10</Text>
        </View>
        <View style={[styles.card, { backgroundColor: '#F1C40F' }]}>
          <Image source={require('../Imagenes/ordeno.png')} style={styles.icon} />
          <Text style={styles.cardTitle}>Ordeño</Text>
          <Text style={styles.cardNumber}>10</Text>
        </View>
        <View style={[styles.card, { backgroundColor: '#16A085' }]}>
          <Image source={require('../Imagenes/ordeno (1).png')} style={styles.icon} />
          <Text style={styles.cardTitle}>Seco</Text>
          <Text style={styles.cardNumber}>10</Text>
        </View>
      </View>

      {/* Botón para abrir el modal de Reportes */}
      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Reportes</Text>
        <Image source={require('../Imagenes/reporte.png')} style={styles.icon} />
      </TouchableOpacity>

      {/* Modal para reportes */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Generar informe</Text>

          {/* Sección para seleccionar parámetros */}
          <Text style={styles.label}>Seleccione los parámetros a medir:</Text>

          {/* Picker para seleccionar un parámetro */}
          <Picker
            selectedValue={selectedParam}
            style={styles.picker}
            onValueChange={(itemValue) => {
              setSelectedParam(itemValue);
              setSelectedOption(''); // Reiniciar la opción seleccionada cuando cambie el parámetro
              setSubModalVisible(true); // Abrir el sub-modal
            }}
          >
            <Picker.Item label="Seleccione un parámetro" value="" />
            <Picker.Item label="Producción de leche" value="produccion_leche" />
            <Picker.Item label="Estado reproductivo" value="estado_reproductivo" />
            <Picker.Item label="Condición de salud" value="condicion_salud" />
          </Picker>

          {/* Botón para cerrar el modal */}
          <Button title="Cerrar" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>

      {/* Sub-modal para seleccionar opciones adicionales */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={subModalVisible}
        onRequestClose={() => setSubModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Seleccione una opción para {selectedParam}</Text>

          {/* Opciones dependiendo del parámetro seleccionado */}
          {selectedParam === 'produccion_leche' && (
            <>
              <TouchableOpacity
                style={styles.subOption}
                onPress={() => {
                  setSelectedOption('Diario');
                  setShowDatePicker(true); // Mostrar el DatePicker cuando sea Diario
                }}
              >
                <Text style={styles.buttonText}>Diario</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.subOption}
                onPress={() => {
                  setSelectedOption('Mensual');
                  setSubModalVisible(true); // Mostrar selector de mes
                }}
              >
                <Text style={styles.buttonText}>Mensual</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Picker para seleccionar el mes cuando es "Mensual" */}
          {selectedOption === 'Mensual' && (
            <Picker
              selectedValue={selectedMonth}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedMonth(itemValue)}
            >
              <Picker.Item label="Seleccione un mes" value="" />
              <Picker.Item label="Enero" value="enero" />
              <Picker.Item label="Febrero" value="febrero" />
              <Picker.Item label="Marzo" value="marzo" />
              <Picker.Item label="Abril" value="Abril" />
              <Picker.Item label="Mayo" value="Mayo" />
              {/* Agregar más meses */}
            </Picker>
          )}

          {/* DateTimePicker para seleccionar una fecha cuando es "Diario" */}
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}

          {selectedParam === 'estado_reproductivo' && (
            <>
              <TouchableOpacity
                style={styles.subOption}
                onPress={() => setSelectedOption('Preñada')}
              >
                <Text style={styles.buttonText}>Preñada</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.subOption}
                onPress={() => setSelectedOption('En celo')}
              >
                <Text style={styles.buttonText}>En celo</Text>
              </TouchableOpacity>
            </>
          )}

          {selectedParam === 'condicion_salud' && (
            <>
              <TouchableOpacity
                style={styles.subOption}
                onPress={() => setSelectedOption('Sana')}
              >
                <Text style={styles.buttonText}>Sana</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.subOption}
                onPress={() => setSelectedOption('Enferma')}
              >
                <Text style={styles.buttonText}>Enferma</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Muestra la opción seleccionada */}
          {selectedOption !== '' && (
            <Text style={styles.selectedOptionText}>Opción seleccionada: {selectedOption}</Text>
          )}

          {/* Botón para cerrar el sub-modal y abrir el modal de reportes */}
          <Button
            title="GENERAR"
            onPress={() => {
              setSubModalVisible(false); // Cierra el sub-modal
              setReportModalVisible(true); // Abre el modal de reportes
            }}
          />
        </View>
      </Modal>
{/* Modal para mostrar los reportes generados */}
<Modal
        animationType="slide"
        transparent={true}
        visible={reportModalVisible}
        onRequestClose={() => setReportModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Reporte generado</Text>

          {/* Muestra el reporte basado en la opción seleccionada */}
          {selectedParam === 'produccion_leche' && (
            <View>
              <Text style={styles.reportText}>Producción de Leche ({selectedOption}):</Text>
              <Text style={styles.reportText}>Fecha: {productionData.fecha}</Text>
              <Text style={styles.reportText}>Total de litros: {productionData.totalLitros} L</Text>
              <Text style={styles.reportText}>Número de vacas: {productionData.numeroVacas}</Text>
            </View>
          )}

          {selectedParam === 'estado_reproductivo' && (
            <View>
              <Text style={styles.reportText}>Estado Reproductivo ({selectedOption}):</Text>
              <Text style={styles.reportText}>Datos específicos sobre el estado reproductivo aquí...</Text>
            </View>
          )}

          {selectedParam === 'condicion_salud' && (
            <View>
              <Text style={styles.reportText}>Condición de Salud ({selectedOption}):</Text>
              <Text style={styles.reportText}>Datos específicos sobre la salud aquí...</Text>
            </View>
          )}

          {/* Botón para cerrar el modal de reportes */}
          <Button title="Cerrar" onPress={() => setReportModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Gris claro
    paddingVertical: 0,
    paddingHorizontal: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 600,
    height: 200,
    resizeMode: 'contain',
  },
  headerText: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 10,
    color: '#2C3E50',
  },
  subHeaderText: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 0,
    marginVertical: 20,
    color: '#7F8C8D',
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  card: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    margin: 1,
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
  cardTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'left',
  },
  cardNumber: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2980B9',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
    marginRight: 20,
  },
  modalView: {
    flex: 1,
    justifyContent: 'left',
    alignItems: 'left',
    backgroundColor: 'rgba(0,0,0,1)',
    padding: 20,
  },
  modalText: {
    fontSize: 30,
    marginBottom: 30,
    fontWeight: 'bold',
    color: '#fff',
  },
  label: {
    fontSize: 18,
    marginBottom: 20,
    color: '#fff',
  },
  picker: {
    width: 350,
    color: '#fff',
    backgroundColor: '#34495E',
  },
  subButton: {
    backgroundColor: '#27AE60',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  subOption: {
    backgroundColor: '#16A085',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedOptionText: {
    fontSize: 18,
    marginTop: 20,
    color: '#fff',
  },
  
  reportText: {
    fontSize: 16,
    marginVertical: 5,
    color: 'white',
  }
  
});

export default Finca;
