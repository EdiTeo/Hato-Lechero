import { View, Text, StyleSheet, TextInput, Button, Alert, Modal, FlatList } from 'react-native';
import React, { useState, useEffect  } from 'react';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import moment from 'moment';
import 'moment/locale/es';
import axios from 'axios';

// Configurar el calendario en español
LocaleConfig.locales['es'] = {
  monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  monthNamesShort: ['Ene.', 'Feb.', 'Mar.', 'Abr.', 'May.', 'Jun.', 'Jul.', 'Ago.', 'Sep.', 'Oct.', 'Nov.', 'Dic.'],
  dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  dayNamesShort: ['Dom.', 'Lun.', 'Mar.', 'Mié.', 'Jue.', 'Vie.', 'Sáb.'],
  today: 'Hoy',
};

// Establecer el idioma del calendario
LocaleConfig.defaultLocale = 'es';

const Alerta = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventType, setEventType] = useState('');
  const [events, setEvents] = useState([]); // Estado para almacenar eventos
  const [modalVisible, setModalVisible] = useState(false); // Estado para controlar el modal
  const [selectedEventIndex, setSelectedEventIndex] = useState(null); // Estado para el evento seleccionado
  const [isEditing, setIsEditing] = useState(false); // Estado para controlar la edición

  const productorId = 1; // Este valor debe provenir del contexto o ser dinámico

  useEffect(() => {
    // Consultar las alertas desde la API
    axios.get(`http://192.168.1.71:19000/api/alertas/productor/${productorId}`)
      .then(response => {
        setEvents (response.data); // Almacenar las alertas
      })
      .catch(error => {
        console.error('Error al obtener alertas:', error);
      });
  }, []);

  const onDayPress = (day) => {
    const selectedDayEvents = events.filter(event => event.date === day.dateString);

    if (selectedDayEvents.length > 0) {
      // Mostrar la descripción del evento si existe un evento en la fecha seleccionada
      const eventInfo = selectedDayEvents.map(event => `Tipo: ${event.type}\nDescripción: ${event.description}`).join('\n\n');
      Alert.alert('Eventos en esta fecha:', eventInfo);
    } else {
      // Si no hay eventos, sólo actualizar la fecha seleccionada
      setSelectedDate(day.dateString);
    }
  };

  const handleEventRegistration = () => {
    if (!eventDescription) {
      Alert.alert('Error', 'Por favor, ingrese una descripción del evento.');
      return;
    }
    if (!eventType) {
      Alert.alert('Error', 'Por favor, seleccione un tipo de evento.');
      return;
    }

    const newEvent = { productor_id:productorId, fecha_alerta: selectedDate, tipo_alerta: eventType, nota: eventDescription };

    if (isEditing) {
      // Editar evento existente
      const updatedEvents = [...events];
      updatedEvents[selectedEventIndex] = newEvent; // Actualizar el evento existente
      setEvents(updatedEvents);
      setIsEditing(false); // Resetear modo de edición
    } else {
      // Agregar nuevo evento
      axios.post('http://192.168.1.71:19000/api/alertas', newEvent)
      .then(response => {
        // Agregar evento localmente
        setEvents([...events, newEvent]);
        
      })
      .catch(error => {
        console.error('Error al registrar evento:', error);
        Alert.alert('Error', 'Hubo un problema al registrar el evento.');
      });
      
      
    }

    // Limpiar los campos y cerrar el modal
    setEventDescription('');
    setSelectedDate('');
    setEventType('');
    setModalVisible(false);

    Alert.alert('Evento registrado', `Tipo: ${eventType}\nFecha: ${selectedDate}\nDescripción: ${eventDescription}`);
  };

  const handleDeleteEvent = () => {
    if (selectedEventIndex === null) {
      Alert.alert('Error', 'Por favor, seleccione un evento para borrar.');
      return;
    }

    Alert.alert(
      'Eliminar evento',
      '¿Está seguro de que desea eliminar este evento?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: () => {
            const updatedEvents = events.filter((_, i) => i !== selectedEventIndex);
            setEvents(updatedEvents);
            setSelectedEventIndex(null); // Resetear el índice seleccionado
            Alert.alert('Evento eliminado', 'El evento ha sido eliminado con éxito.');
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleEditEvent = () => {
    if (selectedEventIndex === null) {
      Alert.alert('Error', 'Por favor, seleccione un evento para editar.');
      return;
    }

    const eventToEdit = events[selectedEventIndex];
    setEventDescription(eventToEdit.description);
    setEventType(eventToEdit.type);
    setIsEditing(true);
    setModalVisible(true);
  };

  // Función para generar los marcadores del calendario
  const getMarkedDates = () => {
    const markedDates = {};
    events.forEach((event) => {
      markedDates[event.fecha_alerta] = {
        selected: true,
        marked: true,
        selectedColor: getEventColor(event.tipo_alerta), // Color del evento basado en el tipo
      };
    });

    // También marcamos la fecha seleccionada actual
    if (selectedDate && !markedDates[selectedDate]) {
      markedDates[selectedDate] = { selected: true, marked: true, selectedColor: 'blue' };
    }

    return markedDates;
  };

  // Función para obtener el color de cada tipo de evento
  const getEventColor = (type) => {
    switch (type) {
      case 'Tarea':
        return '#fffacd'; // Amarillo claro
      case 'Evento':
        return '#ffa500'; // Naranja
      case 'Aviso':
        return '#90ee90'; // Verde claro
      default:
        return 'blue'; // Color por defecto
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seleccione una fecha:</Text>
      <Calendar
        onDayPress={onDayPress}
        markedDates={getMarkedDates()} // Llamada a la función para obtener las fechas marcadas
      />
      {selectedDate ? (
        <View style={styles.eventContainer}>
          <Text style={styles.selectedDate}>Fecha seleccionada: {selectedDate}</Text>

          {/* Botones para seleccionar el tipo de evento */}
          <View style={styles.buttonContainer}>
            <Button title="Tarea" onPress={() => { setEventType('Tarea'); setModalVisible(true); }} />
            <Button title="Aviso" onPress={() => { setEventType('Aviso'); setModalVisible(true); }} />
            <Button title="Evento" onPress={() => { setEventType('Evento'); setModalVisible(true); }} />
          </View>

          {/* Modal para ingresar la descripción del evento */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.eventType}>Tipo de evento: {eventType}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={`Descripción de la ${eventType.toLowerCase()}`}
                  value={eventDescription}
                  onChangeText={setEventDescription}
                />
                <Button title={isEditing ? "Actualizar evento" : "Registrar evento"} onPress={handleEventRegistration} />
                <Button title="Cancelar" onPress={() => setModalVisible(false)} />
              </View>
            </View>
          </Modal>
        </View>
      ) : (
        <Text style={styles.selectedDate}>No se ha seleccionado ninguna fecha.</Text>
      )}

      {/* Lista de eventos registrados */}
      <FlatList
        data={events}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={[styles.eventItem, { backgroundColor: getEventColor(item.tipo_alerta) }]}>
            <Text
              style={[
                styles.eventText,
                selectedEventIndex === index ? styles.selectedEvent : null, // Añadir estilo si está seleccionado
              ]}
              onPress={() => setSelectedEventIndex(index)} // Seleccionar evento
            >
              {`Fecha: ${item.fecha_alerta}, Tipo: ${item.tipo_alerta}, Descripción: ${item.nota}`}
            </Text>
          </View>
        )}
      />

      {/* Mostrar botones de Borrar y Editar solo si hay un evento seleccionado */}
      {selectedEventIndex !== null && (
        <View style={styles.actionButtons}>
          <Button title="Borrar" onPress={handleDeleteEvent} />
          <Button title="Editar" onPress={handleEditEvent} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  selectedDate: {
    marginTop: 20,
    fontSize: 16,
  },
  eventContainer: {
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  eventType: {
    marginTop: 10,
    fontSize: 16,
  },
  eventItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  eventText: {
    fontSize: 16,
  },
  selectedEvent: {
    backgroundColor: '#cce5ff', // Color de fondo para el evento seleccionado
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});

export default Alerta;
