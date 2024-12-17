import React, { useState,useCallback  } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, Image, TextInput } from 'react-native';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
const Produccion = () => {
    const route1 = useRoute();
        const { productor_id } = route1.params;
  const [mostrarOpciones, setMostrarOpciones] = useState(false);
  const [mostrarDetalleProduccion, setMostrarDetalleProduccion] = useState(false);
  const [mostrarRegistroMasivo, setMostrarRegistroMasivo] = useState(false);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState("");  // Almacenamos el turno seleccionado
  const [animalesOrdeñados, setAnimalesOrdeñados] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState(new Date());
  const [lecheExtraida, setLecheExtraida] = useState("");
  const [registro, setRegistro] = useState([]);
  const [produccionHoy, setProduccionHoy] = useState([]);
  const [produccionMes, setProduccionMes] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleProduccionLeche = () => {
    setMostrarDetalleProduccion(true);
    setMostrarOpciones(false);
  };

  const handleRegistroMasivo = () => {
    console.log('Producción de hoy:', produccionHoy);
    console.log('Producción de hoy:', produccionMes);
    setMostrarRegistroMasivo(true);
    setMostrarOpciones(false);
  };

  const handleVolver = () => {
    obtenerProduccionHoy();
    obtenerProduccionMensual();
    setMostrarDetalleProduccion(false);
    setMostrarOpciones(false);
    setMostrarRegistroMasivo(false);
  };

  const handleAñadir = async() => {
    console.log(fechaNacimiento.toISOString().split('T')[0]);
    if (turnoSeleccionado && animalesOrdeñados && lecheExtraida) {
      // Añadir el registro a la lista con el turno seleccionado
      setRegistro([
        ...registro,
        { turno: turnoSeleccionado, animales: animalesOrdeñados, leche: lecheExtraida },
      ]);
      console.log(registro);
      try {
        const response = await axios.post('http://192.168.1.71:8081/api/produccion-leche', {
          productor_id: productor_id, // Siempre un número entero
          cantidad_animales: parseInt(animalesOrdeñados, 10), // Convierte a entero
          cantidad_litros: parseFloat(lecheExtraida), // Convierte a flotante
          tipo_ordeño: turnoSeleccionado, // Si es un string válido, déjalo tal cual
          fecha_produccion: fechaNacimiento.toISOString().split('T')[0], // Debe estar en formato 'YYYY-MM-DD'
        });
        
      } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
      }
      
      // Limpiar los campos después de añadir
      setAnimalesOrdeñados("");
      setLecheExtraida("");
      setTurnoSeleccionado("");
    }
  };


  useFocusEffect(
    useCallback(() => {
      obtenerProduccionHoy();
      obtenerProduccionMensual();
    }, [])
  );

  const obtenerProduccionHoy = async () => {
    console.log(productor_id);
    const response = await axios.get(`http://192.168.1.71:8081/api/produccion-leche/hoy/${productor_id}`);
    setProduccionHoy(response.data);
    console.log('Producción de hoy:', produccionHoy);
  };
  
  const obtenerProduccionMensual = async () => {
    const response = await axios.get(`http://192.168.1.71:8081/api/produccion-leche/mes/${productor_id}`);
    setProduccionMes(response.data);
    console.log('Producción de hoy:', produccionMes);

  };


  return (
    <View style={styles.container}>
      {mostrarRegistroMasivo ? (
        // Formulario de Registro Masivo
        <View style={styles.registroMasivoContainer}>
          <Text style={styles.header}>Datos del Registro</Text>
          <Text style={styles.label}>Fecha</Text>
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

          <Text style={styles.subheader}>Producción de la Vaca</Text>

          <Text style={styles.label}>Turno*</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              onPress={() => setTurnoSeleccionado("mañana")}
              style={[styles.radioOption, turnoSeleccionado === "mañana" && styles.radioSelectedContainer]}
            >
              <Text style={turnoSeleccionado === "mañana" ? styles.radioSelected : styles.radioUnselected}>○</Text>
              <Text>Mañana</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setTurnoSeleccionado("tarde")}
              style={[styles.radioOption, turnoSeleccionado === "tarde" && styles.radioSelectedContainer]}
            >
              <Text style={turnoSeleccionado === "tarde" ? styles.radioSelected : styles.radioUnselected}>○</Text>
              <Text>Tarde</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setTurnoSeleccionado("ambos")}
              style={[styles.radioOption, turnoSeleccionado === "ambos" && styles.radioSelectedContainer]}
            >
              <Text style={turnoSeleccionado === "ambos" ? styles.radioSelected : styles.radioUnselected}>○</Text>
              <Text>Ambos</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Total de Animales Ordeñados*</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingrese la cantidad de animales"
            keyboardType="numeric"
            value={animalesOrdeñados}
            onChangeText={setAnimalesOrdeñados}
          />

          <Text style={styles.label}>Total de Leche Extraída*</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingrese la cantidad de litros"
            keyboardType="numeric"
            value={lecheExtraida}
            onChangeText={setLecheExtraida}
          />

          <Button title="Añadir" onPress={handleAñadir} color="#18C3D1" />

          <View style={styles.tableContainer}>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>Turno</Text>
              <Text style={styles.tableHeader}>Animales</Text>
              <Text style={styles.tableHeader}>Leche (L)</Text>
            </View>
            {registro.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{item.turno}</Text>
                <Text style={styles.tableCell}>{item.animales}</Text>
                <Text style={styles.tableCell}>{item.leche}</Text>
              </View>
            ))}
          </View>

          <Button title="Guardar" onPress={handleVolver} color="#18C3D1" />
        </View>
      ) : mostrarDetalleProduccion ? (
        // Vista de detalle de producción de leche
        <View style={styles.detalleProduccion}>
          <Text style={styles.header}>Producción Hoy</Text>
          <Text style={styles.item}>
            Total <Text style={styles.value}>200 Litros</Text>
          </Text>
          <Text style={styles.item}>
            En ordeño <Text style={styles.value}>10 animales</Text>
          </Text>
          <Text style={styles.item}>
            Promedio Diario <Text style={styles.value}>100 Litros</Text>
          </Text>

          <Text style={styles.header}>Producción de la finca</Text>
          <Text style={styles.item}>
            Total hoy <Text style={styles.value}>200 Litros</Text>
          </Text>
          <Text style={styles.item}>
            Total ayer <Text style={styles.value}>90 Litros</Text>
          </Text>
          <Text style={styles.item}>
            2da Quincena Mayo <Text style={styles.value}>100 Litros</Text>
          </Text>

          <Button title="Volver atrás" onPress={handleVolver} color="#18C3D1" />
        </View>
      ) : mostrarOpciones ? (
        // Vista con las opciones "Producción de leche" y "Registro masivo"
        <>
          <View style={styles.opcionesContainer}>
            
            <TouchableOpacity style={styles.opcion} onPress={handleRegistroMasivo}>
              <Image source={{uri: 'https://res.cloudinary.com/deqnrwzno/image/upload/v1734441236/botellas-de-leche_mgn61g.png'}} style={styles.imagen} />
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
            <Text style={styles.header}>Produccion leche hoy</Text>
            <Text style={styles.item}>Total animales: {produccionHoy.total_animales}</Text>
            <Text style={styles.item}>Producción: {produccionHoy.total_leche}</Text>
            
          </View>

          <View style={styles.section}>
            <Text style={styles.header}>PRODUCCIÓN LECHE DEL MES</Text>
            <Text style={styles.item}>Total Litros:{produccionMes.total_leche} </Text>
            <Text style={styles.item}>Promedio de animales: {produccionMes.promedio_animales}</Text>
            <Text style={styles.item}>Cantidad de Dias: {produccionMes.dias_con_registro}</Text>
            <Text style={styles.item}>Promedio Diario: {produccionMes.promedio_leche_diaria}</Text>
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
    marginTop: 10,
  },
  label: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
  },
  tableContainer: {
    marginTop: 20,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  tableHeader: {
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioUnselected: {
    color: '#000',
    fontSize: 18,
    marginRight: 5,
  },
  radioSelected: {
    color: '#18C3D1',
    fontSize: 18,
    marginRight: 5,
  },
});

export default Produccion;
