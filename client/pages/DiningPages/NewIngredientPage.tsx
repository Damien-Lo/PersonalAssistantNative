import { useState, useEffect } from "react";
import { useContext } from "react";
import {
  Ingredient,
  IngredientListContext,
  NewIngredient,
} from "../../contexts/IngredientListContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/NavTypes";
import {
  SafeAreaFrameContext,
  SafeAreaView,
} from "react-native-safe-area-context";
import { Text, View } from "react-native";

interface NewIngredientPageProps {
  passedName: string;
  passedCloseOverlay: () => void;
}

type Nav = NativeStackNavigationProp<RootStackParamList>;

type IngredientByCategory = Record<string, Ingredient[]>;

const NewIngredientPage: React.FC<NewIngredientPageProps> = ({
  passedName,
  passedCloseOverlay,
}) => {
  //=====================================
  //              VARIABLES
  //=====================================

  //CONTEXTS
  const {
    fullIngredientList,
    setFullIngredientList,
    createIngredient,
    editIngredient,
    deleteIngredient,
  } = useContext(IngredientListContext);

  //STATE VARIABLES
  //Dish Object Variables
  const [ingredientName, setIngredientName] = useState<string>(
    passedName || ""
  );
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string | null>("");
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [brand, setBrand] = useState<string>("Generic");
  const [portionsAvaliable, setPortionsAvaliable] = useState<string | null>(
    null
  );
  const [portionUnit, setPortionUnit] = useState<string | null>("g");
  const [calories, setCalories] = useState<number | null>(null);
  const [protein, setProtein] = useState<number | null>(null);
  const [carbs, setCarbs] = useState<number | null>(null);
  const [fats, setFats] = useState<number | null>(null);
  const [fiber, setFiber] = useState<number | null>(null);
  const [sodium, setSodium] = useState<number | null>(null);

  //Supporting Variables
  const navigation = useNavigation<Nav>();
  const [categorisedIngredientDict, setCategorisedIngredientDict] =
    useState<IngredientByCategory>({});
  const [unitTypes, setUnitTypes] = useState<Set<string>>(new Set());
  const [knownBrands, setKnownBrands] = useState<Set<string>>(new Set());

  //=====================================
  //              FUNCTIONS
  //=====================================

  const testFunc = () => {
    console.log(knownBrands);
  };

  //Navigate Functions

  /**
   * useEffect
   * Sets Categorised Ingredients and Unit typesList Upon First Render
   */
  useEffect(() => {
    // Group data by category
    const unitsSet: Set<string> = new Set();
    const brandsSet: Set<string> = new Set();
    const grouped = fullIngredientList.reduce<IngredientByCategory>(
      (acc, item) => {
        item.portionUnit == null ? null : unitsSet.add(item.portionUnit);
        brandsSet.add(item.brand);
        const cat: string = item.category ?? "Uncategorized";
        (acc[cat] ??= []).push(item);
        return acc;
      },
      {}
    );

    setCategorisedIngredientDict(grouped);
    setUnitTypes(unitsSet);
    setKnownBrands(brandsSet);
  }, []);

  /**
   * handleSave
   * POSTS the ingredient to db and updates local fullIngredeintsList, if page is called as overaly,
   * close overllay, if not return to main ingredient page
   */
  const handleSave = async () => {
    const newIngredient: NewIngredient = {
      name: ingredientName,
      description: description,
      category: category === null ? "Uncategorised" : category,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      brand: brand === null ? "Generic" : brand,
      portionsAvaliable:
        portionsAvaliable === null ? null : Number(portionsAvaliable),
      portionUnit: portionUnit,
      calories: calories === null ? 0 : Number(calories),
      protein: protein === null ? 0 : Number(protein),
      carbs: carbs === null ? 0 : Number(carbs),
      fats: fats === null ? 0 : Number(fats),
      fiber: fiber === null ? 0 : Number(fiber),
      sodium: sodium === null ? 0 : Number(sodium),
    };

    console.log("Saving Ingredient:", newIngredient);

    createIngredient(newIngredient);

    navigateBack();
  };

  const navigateBack = () => {
    if (passedCloseOverlay) {
      passedCloseOverlay();
    } else {
      navigation.navigate("AllIngredientsPage");
    }
  };

  //=====================================
  //              UI COMPONENTS
  //=====================================

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-4">
        <Text className="text-xl font-bold mb-4">New Ingredients Page</Text>
        {/* form content goes here */}
      </View>
    </SafeAreaView>
  );
};

export default NewIngredientPage;
