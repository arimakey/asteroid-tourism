import * as React from 'react';
import { View, Text, SafeAreaView, Platform, Image, TouchableOpacity } from 'react-native';
import { Button, Menu, Divider, Provider as PaperProvider } from 'react-native-paper';
import { hp } from '../helpers/common';
import { useAuth } from '../context/authContext';
import { useRouter } from 'expo-router';

const Home = () => {
  const {user} = useAuth();
  const router = useRouter();
  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <PaperProvider>
      <SafeAreaView style={{ paddingTop: Platform.OS === 'android' ? 25 : 0 }}>
        <View className="flex flex-row justify-between items-center px-5">
          <View>
            <Text
              className="text-2xl font-bold"
              style={{ fontSize: hp(3) }}
            >
              Hi, {user?.username}!
            </Text>
            <Text
              className="text-gray-500"
              style={{ fontSize: hp(2) }}
            >
              Explore the world.
            </Text>
          </View>
          {/* Imagen con menú desplegable al hacer clic */}
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            style={{ marginTop: hp(5), paddingRight: hp(6)}}
            contentStyle={{ width: hp(20), backgroundColor: '#EDEDED', borderColor: 'gray', borderWidth: 1 }}

            anchor={
              <TouchableOpacity onPress={openMenu}>
                <Image
                  source={require('@/assets/images/userIcon.jpg')}
                  className="block rounded-full object-contain"
                    style={{
                    width: hp(8),
                    height: hp(8),
                    borderRadius: hp(40),
                    borderWidth: 2,
                    borderColor: 'gray',
                    }}
                />
              </TouchableOpacity>
            }
          >
            <Menu.Item onPress={(e) => {router.navigate("/(tabs)/itinerario"); e.preventDefault()}} title="Itinerario" titleStyle={{color: "black"}} rippleColor={"#EDEDED"} />
            <Divider />
            <Menu.Item onPress={() => {router.navigate("/(tabs)/recompensas")}} title="Recompenzas" titleStyle={{color: "black"}} rippleColor={"#EDEDED"}/>
          </Menu>

        </View>
        
        <View className="flex-1 gap-4"
            style={{marginTop: hp(4)}}
        >
            <Image 
                source={require('@/assets/images/plaza.jpg')}
                style={{width: '100%', height: hp(30), borderRadius: 7}}
            />
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
};

export default Home;

//👑