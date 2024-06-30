import { extendTheme } from "@chakra-ui/react";
import { lightThemeColors } from "./colors";
import { cardTheme } from "./card";
import { ButtonStyle } from "./button";

const themeConfig = {
  styles: {
    global: {
      body: {
        backgroundColor: "#000",
      },
    },
  },
  components: {
    Card: cardTheme,
    Button: ButtonStyle,
  },

  // 2. Add your color mode config
  initialColorMode: "dark",
  useSystemColorMode: true,

  semanticTokens: {
    colors: {
      "chakra-body-text": {
        _dark: "#F7F7F7",
      },
      "chakra-body-bg": {
        _dark: "#1E1E1E",
      },
    },
  },
  colors: {
    //dynamic primary coor based on the light/dark

    orange: {
      "50": "#FFF7E6",   // Very light neon orange
      "100": "#FFEBCC",  // Light neon orange
      "200": "#FFD699",  // Lighter neon orange
      "300": "#FFC266",  // Light neon orange
      "400": "#FFAD33",  // Neon orange
      "500": "#FF9900",  // Primary neon orange
      "600": "#FF8500",  // Slightly darker neon orange
      "700": "#FF7000",  // Darker neon orange
      "800": "#FF5C00",  // Even darker neon orange
      "900": "#FF4700",  // Darkest neon orange
    },
    
  },
};

export const theme = extendTheme({
  ...themeConfig,
  colors: lightThemeColors,
});
