import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

const SwipeCard: React.FC = () => {
    const router = useRouter();

    // Función para manejar la navegación
    const handleNavigate = () => {
        router.push("/(tabs)/step3/index3"); 
    };

    return (
        <TouchableOpacity onPress={handleNavigate} style={styles.cardContainer}>
            <View>
                <Text style={styles.cardText}>Swipe Card</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        padding: 16,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 10,
    },
    cardText: {
        fontSize: 16,
        color: '#333',
    },
});

export default SwipeCard;
