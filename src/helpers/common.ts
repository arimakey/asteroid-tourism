import { Dimensions, PixelRatio } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export const wp = (percentaje: number) => {
    const width = SCREEN_WIDTH;
    return (percentaje * width) / 100;
}

export const hp = (percentaje: number) => {
    const height = SCREEN_HEIGHT;
    return (percentaje * height) / 100;
} 