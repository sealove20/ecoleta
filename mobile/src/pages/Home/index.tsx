import React, { useState, useEffect } from "react";
import { Feather as Icon } from "@expo/vector-icons";
import {
  View,
  Image,
  StyleSheet,
  Text,
  ImageBackground,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import axios from "axios";
import Picker from "react-native-picker-select";

import { RectButton } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";

interface IBGEUfResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

interface PickerObject {
  label: string;
  value: string;
}

const Home = () => {
  const [uf, setUf] = useState("0");
  const [city, setCity] = useState("0");
  const [pickerUfs, setPickerUfs] = useState<PickerObject[]>([]);
  const [pickerCities, setPickerCities] = useState<PickerObject[]>([]);

  const navigation = useNavigation();

  function hadleNavigateToPoints() {
    navigation.navigate("Points", {
      uf,
      city,
    });
  }

  useEffect(() => {
    axios
      .get<IBGEUfResponse[]>(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
      )
      .then((response) => {
        const ufInitials = response.data.map((uf) => uf.sigla);
        const parsedUfs = ufInitials.map((uf) => ({ label: uf, value: uf }));

        setPickerUfs(parsedUfs);
      });
  }, []);

  useEffect(() => {
    if (uf === "0") {
      return;
    }

    axios
      .get<IBGECityResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`
      )
      .then((response) => {
        const cityNames = response.data.map((city) => city.nome);
        const parsedCities = cityNames.map((city) => ({
          label: city,
          value: city,
        }));

        setPickerCities(parsedCities);
      });
  }, [uf]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ImageBackground
        source={require("../../assets/home-background.png")}
        style={styles.container}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={require("../../assets/logo.png")} />
          <View>
            <Text style={styles.title}>
              Seu marketplace de coleta de resíduos
            </Text>
            <Text style={styles.description}>
              Ajudamos pessoas a encontrarem pontos de coleta eficiente.
            </Text>
          </View>
        </View>
        <View style={styles.footer}>
          <Picker
            style={{
              inputAndroid: {
                height: 60,
                backgroundColor: "#FFF",
                borderRadius: 10,
                marginBottom: 8,
                paddingHorizontal: 24,
                paddingRight: 30,
                fontSize: 16,
              },
              iconContainer: { top: 15, right: 15 },
            }}
            onValueChange={(value) => setUf(value)}
            items={pickerUfs}
            placeholder={{ label: "Escolha a UF" }}
            Icon={() => {
              return <Icon name="chevron-down" color="#000" size={24} />;
            }}
          />
          <Picker
            style={{
              inputAndroid: {
                height: 60,
                backgroundColor: "#FFF",
                borderRadius: 10,
                marginBottom: 8,
                paddingHorizontal: 24,
                paddingRight: 30,
                fontSize: 16,
              },
              iconContainer: { top: 15, right: 15 },
            }}
            onValueChange={(value) => setCity(value)}
            items={pickerCities}
            placeholder={{ label: "Escolha a Cidade" }}
            Icon={() => {
              return <Icon name="chevron-down" color="#000" size={24} />;
            }}
          />
          <RectButton style={styles.button} onPress={hadleNavigateToPoints}>
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#FFF" size={12} />
              </Text>
            </View>
            <Text style={styles.buttonText}>Entrar</Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: "center",
  },

  title: {
    color: "#322153",
    fontSize: 32,
    fontFamily: "Ubuntu_700Bold",
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: "#6C6C80",
    fontSize: 16,
    marginTop: 16,
    fontFamily: "Roboto_400Regular",
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#34CB79",
    height: 60,
    flexDirection: "row",
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
    color: "#FFF",
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "purple",
    borderRadius: 8,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

export default Home;
