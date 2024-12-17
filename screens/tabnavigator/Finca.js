import React, { useCallback , useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, Button, Platform,ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

const Finca = () => {
  const navigation = useNavigation(); // Hook para navegación
  const [modalVisible, setModalVisible] = useState(false); // Controla el modal de reportes
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [tratamiento, setTratamiento] = useState([]);
  const [preñada, setPreñada] = useState([]);
  const [gestante, setGestante] = useState([]);
  const [nogestante, setnoGestante] = useState([]);
  const [datos, setDatos] = useState([]);
  const [datos2, setDatos2] = useState([]);
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
  const [conteoEstado, setConteoEstado] = useState({
    enfermos: 0,
    preñadas: 0,
    gestante: 0,
    no_gestante: 0,
  });
  // Datos ficticios para los reportes
  const [produccionLeche, setProduccionLeche] = useState({
    fecha: '2024-10-30',
    totalLitros: 250,
    numeroVacas: 20,
  });
  const [total, setTotal] = useState(0);
  const getConteoEtapas = async () => {
    try {
      setLoading(true); // Activa el estado de carga
      const response = await axios.get(`http://192.168.1.71:19000/api/contar/${1}`);
      const response4 = await axios.get(`http://192.168.1.71:19000/api/vacas/${1}`);
      const response2 = await axios.get(`http://192.168.1.71:19000/api/vacas/tratamiento/${1}`);
      const response3 = await axios.get(`http://192.168.1.71:19000/api/vacas/prenadas/${1}`);
      
      setSelectedCategory(response4.data);
      console.log(response4.data);
      setTratamiento(response2.data.nombres_vacas_en_tratamiento);
      const conteo = {
        ternero: 0,
        juvenil: 0,
        adulto: 0,
        cria: 0,
      };
      const conteoEstados = {
        enfermos: 0,
        preñadas: 0,
        gestante: 0,
        no_gestante: 0,
      };
      response.data.etapas.forEach(item => {
        conteo[item.etapa_de_crecimiento] = item.total;
      });
      conteoEstados.enfermos = response2.data.vacas_en_tratamiento;
      conteoEstados.preñadas = response3.data.vacas_preñadas;

      setConteoEtapas(conteo);

      response.data.estados_reproductivos.forEach(item => {
        conteoEstados[item.estado_reproductivo] = item.total;
       
      });
      
      
      setConteoEstado(conteoEstados);
      console.log(conteoEstado);
      setTratamiento(response2.data.nombres_vacas_en_tratamiento);
      setPreñada(response3.data.nombres_vacas_preñadas);
      setnoGestante(response.data.estados_reproductivos[1].nombres_vacas      );
      setGestante(response.data.estados_reproductivos[0].nombres_vacas      );
      setTotal(Object.values(conteo).reduce((acumulador, valor) => acumulador + valor, 0));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Desactiva el estado de carga
    }
  };

  const openModal = (category) => {
    const filteredData = selectedCategory.filter(item => item.etapa_de_crecimiento === category);
    console.log('Datos filtrados:', filteredData); // Asegúrate de que contienen el campo 'nombre'
    setDatos(filteredData);
    setModalVisible1(true);
  };
  
  const openModal1 = (category) => {
    let filteredData = [];
  
    // Filtramos según la categoría recibida
    switch (category) {
      case 'enfermos':
        filteredData = tratamiento; // Suponiendo que tratamiento es un array de objetos
        break;
      case 'prenadas':
        filteredData = preñada; // Suponiendo que preñada es un array de objetos
        break;
      case 'gestante':
        filteredData = gestante; // Suponiendo que gestante es un array de objetos
        break;
      case 'seco':
        filteredData = nogestante; // Suponiendo que nogestante es un array de objetos
        break;
    }
  
    // Extraemos solo los nombres de las vacas
    const nombresVacas = filteredData.map(vaca => vaca || 'Desconocido');
  
    console.log('Datos filtrados:', nombresVacas);  // Verifica que solo contienen los nombres
  
    setDatos2(nombresVacas);  // Establecemos solo los nombres
    setModalVisible2(true);  // Muestra el modal con los nombres filtrados
  };
  
  
  
  const closeModal = () => {
    setModalVisible1(false);
    setSelectedCategory('');
  };
  useFocusEffect(
    useCallback(() => {
      getConteoEtapas(); // Llama a la función de consultas al enfocar la pantalla
    }, [])
  );
  
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
  const obtenerProduccionLeche = async (mes) => {
    
    try {
      const response = await axios.get(`http://192.168.1.71:19000/api/produccion-leche/mes?mes=${mes}`);
      setProduccionLeche({
        fecha: `${response.data.año}-${response.data.mes}-01`,  // Formato de fecha: Año-Mes-01 (puedes ajustarlo)
        totalLitros: response.data.total_leche,
        numeroVacas: response.data.promedio_animales,
      });
      console.log('Producción de leche:', response.data);
    } catch (error) {
      console.error('Error al obtener producción de leche:', error);
    }
  };
  const obtenerProduccionLeche1 = async (fecha) => {
    // Formatear la fecha en formato 'YYYY-MM-DD'
    const año = fecha.getFullYear();  // Obtener el año de la fecha
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');  // Obtener el mes (sumamos 1 porque en JS los meses empiezan desde 0)
    const dia = String(fecha.getDate()).padStart(2, '0');  // Obtener el día del mes

    const fechaFormateada = `${año}-${mes}-${dia}`;  // Formato 'YYYY-MM-DD'
    console.log(fechaFormateada);

    try {
        // Enviar la fecha formateada a la API
        const response = await axios.get(`http://192.168.1.71:19000/api/produccion-leche/fecha?fecha=${fechaFormateada}`);
        
        // Setear los datos recibidos en el estado
        setProduccionLeche({
            fecha:  response.data.fecha,  // Formato de fecha: Año-Mes-01
            totalLitros: response.data.total_leche,
            numeroVacas: response.data.total_animales
            ,
        });

        console.log('Producción de leche:', response.data);
    } catch (error) {
        console.error('Error al obtener producción de leche:', error);
    }
};

  
  // Llamar la función con el mes 1 (enero)
 
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={require('../Imagenes/Vaca Leche 3.jpg')}
          style={styles.logo}
        />
      </View>

      {/* Total ganado */}
      <Text style={styles.headerText}>TOTAL GANADO: {total}</Text>

      {/* Primera fila: Vacas, Novillas, Terneros, Destetados */}
      <View style={styles.section}>
        <TouchableOpacity style={[styles.card, { backgroundColor: '#E74C3C' }]} onPress={() => openModal('adulto')}>
          <Image source={require('../Imagenes/vaca22.png')} style={styles.icon} />
          <Text style={styles.cardTitle}>Vacas</Text>
          <Text style={styles.cardNumber}>{conteoEtapas.adulto}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.card, { backgroundColor: '#27AE60' }]} onPress={() => openModal('juvenil')}>
          <Image source={require('../Imagenes/vaca (1).png')} style={styles.icon} />
          <Text style={styles.cardTitle}>Novillas</Text>
          <Text style={styles.cardNumber}>{conteoEtapas.juvenil}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.card, { backgroundColor: '#8E44AD' }]} onPress={() => openModal('ternero')}>
          <Image source={require('../Imagenes/vaca (2).png')} style={styles.icon} />
          <Text style={styles.cardTitle}>Terneros</Text>
          <Text style={styles.cardNumber}>{conteoEtapas.ternero}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.card, { backgroundColor: '#16A085' }]} onPress={() => openModal('cria')}>
          <Image source={require('../Imagenes/vaca (3).png')} style={styles.icon} />
          <Text style={styles.cardTitle}>Destetados</Text>
          <Text style={styles.cardNumber}>{conteoEtapas.cria}</Text>
        </TouchableOpacity>
      </View>
      <Modal
  animationType="slide"
  transparent={false}
  visible={modalVisible1}
  onRequestClose={closeModal}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalText1}>
        Detalles de {datos.length > 0 ? datos[0].etapa_de_crecimiento : 'N/A'}
      </Text>
      {datos.length > 0 ? (
        datos.map((vaca, index) => (
          <View key={vaca.vaca_id || index} style={styles.modalDetail}>
            <Text style={styles.reportText1}>
  Nombre: {vaca.nombre || 'Desconocido'}, Estados: {vaca.estado_reproductivo || 'No especificado'}
</Text>
          </View>
        ))
      ) : (
        <Text style={styles.reportText1}>No hay datos disponibles</Text>
      )}
      <Button title="Cerrar" onPress={() => setModalVisible1(false)} />
    </View>
  </View>
</Modal>



      {/* Subtítulo: Resumen Condicional */}
      <Text style={styles.subHeaderText}>RESUMEN CONDICIONAL</Text>

      {/* Segunda fila: Enfermos, Embarazadas, Ordeño, Seco */}
      <View style={styles.section}>
  <TouchableOpacity style={[styles.card, { backgroundColor: '#E74C3C' }]} onPress={() => openModal1('enfermos')}>
    <Image source={require('../Imagenes/botiquin-de-primeros-auxilios.png')} style={styles.icon} />
    <Text style={styles.cardTitle}>Enfermos</Text>
    <Text style={styles.cardNumber}>{conteoEstado.enfermos}</Text>
  </TouchableOpacity>
  <TouchableOpacity style={[styles.card, { backgroundColor: '#27AE60' }]} onPress={() => openModal1('prenadas')}>
    <Image source={require('../Imagenes/embarazada.png')} style={styles.icon} />
    <Text style={styles.cardTitle}>Preñada</Text>
    <Text style={styles.cardNumber}>{conteoEstado.preñadas}</Text>
  </TouchableOpacity>
  <TouchableOpacity style={[styles.card, { backgroundColor: '#F1C40F' }]} onPress={() => openModal1('gestante')}>
    <Image source={require('../Imagenes/ordeno.png')} style={styles.icon} />
    <Text style={styles.cardTitle}>Ordeño</Text>
    <Text style={styles.cardNumber}>{conteoEstado.gestante}</Text>
  </TouchableOpacity>
  <TouchableOpacity style={[styles.card, { backgroundColor: '#16A085' }]} onPress={() => openModal1('seco')}>
    <Image source={require('../Imagenes/ordeno (1).png')} style={styles.icon} />
    <Text style={styles.cardTitle}>Seco</Text>
    <Text style={styles.cardNumber}>{conteoEstado.no_gestante}</Text>
  </TouchableOpacity>
</View>

<Modal
  animationType="slide"
  transparent={false}
  visible={modalVisible2}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalText1}>
        Detalles de las vacas
      </Text>
      {datos2.length > 0 ? (
        datos2.map((nombre, index) => (
          <View key={index} style={styles.modalDetail}>
            <Text style={styles.reportText1}>
              Nombre: {nombre}
            </Text>
          </View>
        ))
      ) : (
        <Text style={styles.reportText1}>No hay datos disponibles</Text>
      )}
      <Button title="Cerrar" onPress={() => setModalVisible2(false)} />
    </View>
  </View>
</Modal>



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
              <Picker.Item label="Enero" value="1" />
              <Picker.Item label="Febrero" value="2" />
              <Picker.Item label="Marzo" value="3" />
              <Picker.Item label="Abril" value="4" />
              <Picker.Item label="Mayo" value="5" />
              <Picker.Item label="Junio" value="6" />
              <Picker.Item label="Julio" value="7" />
              <Picker.Item label="Agosto" value="8" />
              <Picker.Item label="Septiembre" value="9" />
              <Picker.Item label="Octubre" value="10" />
              <Picker.Item label="Noviembre" value="11" />
              <Picker.Item label="Diciembre" value="12" />
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

          

          

          {/* Muestra la opción seleccionada */}
          {selectedOption !== '' && (
            <Text style={styles.selectedOptionText}>Opción seleccionada: {selectedOption}</Text>
          )}

          {/* Botón para cerrar el sub-modal y abrir el modal de reportes */}
          <Button
  title="GENERAR"
  onPress={() => {
    setSubModalVisible(false); // Cierra el sub-modal
    setReportModalVisible(true); // Muestra el modal de reportes

    // Verifica si se ha seleccionado una fecha o un mes y pasa ese valor
    if (selectedOption === 'Diario' && selectedDate) {
      // Si la opción seleccionada es "Diario", pasa la fecha seleccionada
      obtenerProduccionLeche1(selectedDate);
    } else if (selectedOption === 'Mensual' && selectedMonth) {
      // Si la opción seleccionada es "Mensual", pasa el mes seleccionado
      obtenerProduccionLeche(selectedMonth);
    }
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
              <Text style={styles.reportText}>Fecha: {produccionLeche.fecha}</Text>
              <Text style={styles.reportText}>Total de litros: {produccionLeche.totalLitros} L</Text>
              <Text style={styles.reportText}>Número de vacas: {produccionLeche.numeroVacas}</Text>
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
  modalText1: {
    fontSize: 30,
    marginBottom: 30,
    fontWeight: 'bold',
    color: 'black',
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
  ,
  reportText1: {
    fontSize: 16,
    marginVertical: 5,
    color: 'black',
  }
  //modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  //modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%', alignItems: 'center' },
  //modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  //modalText: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
  //closeButton: { backgroundColor: '#E74C3C', padding: 10, borderRadius: 5 },
  //closeButtonText: { color: '#fff', fontWeight: 'bold' },
});

export default Finca;
