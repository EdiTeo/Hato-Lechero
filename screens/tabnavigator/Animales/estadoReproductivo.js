import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const EstadoReproductivo = ({ route, navigation }) => {
    const { vaca } = route.params;
    const fechaNacimiento = new Date(vaca.fecha_nacimiento);

    const calcularFecha = (meses) => {
        const fecha = new Date(fechaNacimiento);
        fecha.setMonth(fecha.getMonth() + meses);
        return fecha.toISOString().split('T')[0];
    };

    const etapas = [
        { nombre: 'Ternera', fecha: calcularFecha(0) },
        { nombre: 'Destetada', fecha: calcularFecha(7) },
        { nombre: 'Novilla', fecha: calcularFecha(12) },
        { nombre: 'Vacia', fecha: calcularFecha(15) }, // Cambiado a 15 meses para un ejemplo lógico
    ];

    console.log("Fechas de etapas:", etapas);

    const fechaActual = new Date();

    // Determinar la etapa actual basándonos en la fecha
    const etapaActual = etapas.reverse().find(etapa => fechaActual >= new Date(etapa.fecha));
    const mostrarBotonAdd = etapaActual && (etapaActual.nombre === 'Novilla' || etapaActual.nombre === 'Vacia');

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Estado reproductivo</Text>
            {etapas.reverse().map((etapa, index) => {
                const fechaEtapa = new Date(etapa.fecha);
                const esEtapaAlcanzada = fechaActual >= fechaEtapa;

                return (
                    <View
                        key={index}
                        style={[
                            styles.etapaContainer,
                            esEtapaAlcanzada ? styles.etapaAlcanzada : styles.etapaNoAlcanzada
                        ]}
                    >
                        <Text style={styles.etapaTexto}>{etapa.nombre}</Text>
                        <Text style={styles.etapaFecha}>{etapa.fecha}</Text>
                    </View>
                );
            })}
            {mostrarBotonAdd && (
                <TouchableOpacity style={styles.botonAdd}>
                    <Text style={styles.botonAddText}
                    onPress={() => navigation.navigate('embarazo',route.params)}
                    >+</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { padding: 20 },
    titulo: { fontSize: 20, fontWeight: 'bold' },
    etapaContainer: { padding: 10, margin: 5, borderRadius: 8 },
    etapaTexto: { fontSize: 18 },
    etapaFecha: { color: 'gray' },
    etapaAlcanzada: { backgroundColor: '#a4e5a4' },
    etapaNoAlcanzada: { backgroundColor: '#f0f0f0' },
    botonAdd: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#007AFF',
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center'
    },
    botonAddText: { color: '#fff', fontSize: 24 },
});

export default EstadoReproductivo;
