import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'
import { wp } from '../helpers/common'

interface ImageCuatroProps {
    image1: string,
    image2: string,
    image3: string,
    image4: string,
}

const ImageCuatro = (images: ImageCuatroProps) => {
    return (
        <View style={styles.container}>
          {/* Columna de imágenes pequeñas */}
          <View style={styles.smallImagesColumn}>
            <Image source={{ uri: images.image1 }} style={styles.smallImage} />
            <Image source={{ uri: images.image2 }} style={styles.smallImage} />
            <Image source={{ uri: images.image3 }} style={styles.smallImage} />
          </View>
          
          {/* Imagen principal */}
          <View style={styles.mainImageContainer}>
            <Image source={{ uri: images.image4 }} style={styles.mainImage} />
            <View style={styles.locationTag}>
              <Text style={styles.locationText}>Cusco</Text>
            </View>
          </View>
        </View>
      );
}

const styles = StyleSheet.create({
container: {
    flexDirection: 'row',
    padding: 16,
},
smallImagesColumn: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
},
smallImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginBottom: 8,
},
mainImageContainer: {
    flex: 1,
    position: 'relative',
    borderRadius: 20,
    overflow: 'hidden',
},
mainImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
},
locationTag: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 15,
},
locationText: {
    color: 'white',
    fontWeight: 'bold',
},
});

export default ImageCuatro