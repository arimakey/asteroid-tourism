import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
import { firestoreDB } from "@/firebaseConfig";
import { doc, getDoc, setDoc, collection, getDocs , query, where} from 'firebase/firestore';
import { useAuth } from '@/src/context/authContext';
import Swiper from 'react-native-deck-swiper';

type TouristFoods = {
    id: string;
    name: string;
    description: string;
    image: string;
    selected: boolean | null;
};

interface SelectionData {
    selected_foods: {
        likes: string[];
        unlikes: string[];
    };
    step: number;
}

interface Seleccion {
    id: string;
    [key: string]: any; // Permite otros campos adicionales que pueden estar en el documento
}

const TouristFoods = ({ goToNextStep }: { goToNextStep: () => void }) => {
    const { user } = useAuth();
    const [data, setData] = useState<TouristFoods[]>([]);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (user?.uid) {
            getOptFoods(user.uid);
        }
    }, [user]);

    const getOptFoods = async (userId: string) => {
        try {
            const response = await fetch('https://getoptfood-glxwkatvia-uc.a.run.app', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId }),
            });

            if (!response.ok) {
                throw new Error("Error en la respuesta de la API");
            }

            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error("Error fetching foods:", error);
        }
    };

    const handleSwipe = (index: number, isLiked: boolean) => {
        if (index >= data.length) return;

        const updatedData = data.map((food, idx) =>
            idx === index ? { ...food, selected: isLiked } : food
        );
        setData(updatedData);
        setProgress(updatedData.filter((food) => food.selected !== null).length);
    };

        async function obtenerSeleccionesDeUsuario(userId: string) {
            try {
            // Obtén una referencia al documento del usuario
            const userRef = doc(firestoreDB, 'users', userId);
        
            // Obtén una referencia a la colección 'selections'
            const selectionsRef = collection(firestoreDB, 'selections');
        
            // Crea una consulta contra la colección
            const q = query(selectionsRef, where('user', '==', userRef));
        
            // Ejecuta la consulta
            const snapshot = await getDocs(q);
        
            // Procesa los resultados
            const selecciones: Seleccion[] = [];
            snapshot.forEach((doc) => {
                selecciones.push({ id: doc.id, ...doc.data() });
            });
        
            return selecciones[0].id;
            } catch (error) {
            console.error('Error al obtener las selecciones:', error);
            throw error;
            }
        }

    const saveToFirebase = async () => {
        if (!user?.uid) {
            Alert.alert("Error", "Usuario no autenticado");
            return;
        }

        try {
            const documentId = await obtenerSeleccionesDeUsuario(user.uid);

            console.log("docu: ", documentId)

            if (documentId) {
                // Si encontramos el documento, lo actualizamos
                const selectionRef = doc(firestoreDB, "selections", documentId);

                const likes = data.filter((food) => food.selected === true).map((food) => doc(firestoreDB, "food_categories", food.id));
                const unlikes = data.filter((food) => food.selected === false).map((food) => doc(firestoreDB, "food_categories", food.id));

                await setDoc(
                    selectionRef,
                    {
                        selected_foods: {
                            likes,
                            unlikes,
                        },
                        step: 5,
                    },
                     { merge: true } // Usar merge para actualizar sin sobrescribir todo el documento
                );
                
                Alert.alert("Éxito", "Tus selecciones se han guardado en Firebase");
                goToNextStep();
            } else {
                 // Si no encontramos el documento, mostramos un mensaje de error
                Alert.alert("Error", "No se encontró el documento de selección para este usuario.");
            }

        } catch (error) {
            console.error("Error al guardar selecciones en Firebase:", error);
            Alert.alert("Error", "No se pudo guardar en Firebase.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Preferencias en Comidas</Text>
            <Text style={styles.progressText}>Progreso: {progress}/{data.length}</Text>
            {data.length > 0 ? (
                <Swiper
                    cards={data}
                    renderCard={(item) => (
                        <View style={styles.card}>
                            <Image source={{ uri: item.image }} style={styles.image} />
                            <Text style={styles.placeName}>{item.name}</Text>
                            <Text style={styles.placeDescription}>{item.description}</Text>
                        </View>
                    )}
                    onSwipedRight={(index) => handleSwipe(index, true)}
                    onSwipedLeft={(index) => handleSwipe(index, false)}
                    cardIndex={0}
                    backgroundColor="transparent"
                    stackSize={3}
                />
            ) : (
                <Text style={styles.noDataText}>No hay más preferencias de comidas</Text>
            )}
            <TouchableOpacity style={styles.saveButton} onPress={saveToFirebase}>
                <Text style={styles.saveButtonText}>Guardar y continuar</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f1f1f1',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 10,
    },
    progressText: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginBottom: 20,
    },
    card: {
        flex: 0.8,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
    },
    placeName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    placeDescription: {
        fontSize: 16,
        color: '#666',
        marginTop: 10,
        textAlign: 'justify',
    },
    noDataText: {
        fontSize: 18,
        color: '#999',
        textAlign: 'center',
        marginTop: 20,
    },
    saveButton: {
        marginTop: 20,
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default TouristFoods;