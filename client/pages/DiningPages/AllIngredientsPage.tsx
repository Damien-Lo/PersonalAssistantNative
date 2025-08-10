import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  SectionList,
  Modal,
} from "react-native";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  IngredientListContext,
  Ingredient,
} from "../../contexts/IngredientListContext";
import NewIngredientPage from "./NewIngredientPage";
import SearchBar from "../../components/HomeComponents/SearchBar";

export default function AllIngredientsPage() {
  const navigator = useNavigation();

  //=====================================
  //              VARIABLES
  //=====================================

  type IngredientByCategory = Record<string, Ingredient[]>;

  //CONTEXTS
  const {
    fullIngredientList,
    setFullIngredientList,
    createIngredient,
    editIngredient,
    deleteIngredient,
  } = useContext(IngredientListContext);

  //SUPPORTING VARIABLES
  const [categorisedIngredientDict, setCategorisedIngredientDict] =
    useState<IngredientByCategory>({});
  const [ingredientSectionListData, setIngredientSectionListData] = useState<
    { title: string; data: Ingredient[] }[]
  >([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const shownSections = useMemo(
    () =>
      ingredientSectionListData.map((s) => ({
        title: s.title,
        data: expanded.has(s.title) ? s.data : [],
      })),
    [ingredientSectionListData, expanded]
  );

  const [selectedIngredient, setSelectedIngredient] =
    useState<Ingredient | null>(null);
  const expandedRef = useRef(new Set());

  const [showNewIngredientOverlay, setShowNewIngredientOverlay] =
    useState<boolean>(false);

  const [q, setQ] = useState("");

  //=====================================
  //              FUNCTIONS
  //=====================================
  const testFunc = () => {
    console.log(selectedIngredient);
  };

  /**
   * closeIngredientDetailOverlay
   */
  const closeIngredientDetailOverlay = () => {
    setSelectedIngredient(null);
  };

  /**
   * useEffect
   * Categorise Ingredient Categories on render
   */
  useEffect(() => {
    const grouped = fullIngredientList.reduce<IngredientByCategory>(
      (acc, item) => {
        const cat: string =
          item.category == null || item.category == ""
            ? "Uncategorized"
            : item.category;
        (acc[cat] ??= []).push(item); // same as: if (!acc[cat]) acc[cat] = []; acc[cat].push(item);
        return acc;
      },
      {}
    );
    setCategorisedIngredientDict(grouped);

    const sections = Object.entries(grouped).map(([title, data]) => ({
      title,
      data,
    }));

    setIngredientSectionListData(sections);
  }, [fullIngredientList]);

  /** TODO
   * useEffect
   * Changes shown ingredients when search bar query changes and is not blank ""
   */
  useEffect(() => {
    console.log("Search Query Changed");
  }, [q]);

  const toggleSection = (title: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(title) ? next.delete(title) : next.add(title);
      return next;
    });
  };

  /**
   * itrIngredientCount
   * Change ingredient portionsAvaliable by itr amount
   * @param {*} ingredient Ingredient Editted
   * @param {*} itr Iterated Amount
   */
  const itrIngredientCount = (ingredient: Ingredient, itr: number) => {
    const ingredient_id = ingredient._id;
    const updatedIngredient = {
      ...ingredient,
      portionsAvaliable:
        ingredient.portionsAvaliable == null
          ? null
          : ingredient.portionsAvaliable + itr,
    };

    editIngredient(ingredient_id, updatedIngredient);
  };

  //=====================================
  //              UI COMPONENTS
  //=====================================

  const Header = (
    <View className="px-5 pt-4 pb-3">
      <View className="flex flex-row justify-between items-center">
        <Text className="text-4xl font-bold text-gray-800 pb-2">
          All Ingredients Page
        </Text>
        <Pressable
          className="bg-gray-300 rounded-full w-[30px] h-[30px] items-center justify-center"
          onPress={() => setShowNewIngredientOverlay(true)}
        >
          <Text>+</Text>
        </Pressable>
      </View>

      <Pressable
        onPress={() => console.log("TEST")}
        className="bg-red-300 w-[50px] h-[28px] mt-2 items-center justify-center rounded"
      >
        <Text>TEST</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-5 pt-4 pb-3">
        <Text className="text-4xl font-bold text-gray-800 pb-2">
          All Ingredients Page
        </Text>
      </View>
      <View className="flex flex-row items-center justify-between px-5">
        <View className="w-[90%] mr-[10px]">
          <SearchBar
            value={q}
            onChangeText={setQ}
            placeholder="Search ingredients"
            debounceMs={150}
            returnKeyType="search"
          />
        </View>
        <Pressable
          className="w-[40px] h-[40px] bg-gray-400 rounded-full flex items-center justify-center"
          onPress={() => {
            setShowNewIngredientOverlay(true);
          }}
        >
          <Text>+</Text>
        </Pressable>
      </View>
      <SectionList
        sections={shownSections}
        renderSectionHeader={({ section: { title } }) => (
          <Pressable
            className="bg-gray-300 rounded-lg h-[40px] mx-5 mt-3 px-2 justify-center"
            onPress={() => toggleSection(title)}
          >
            <Text className="text-xl">{title}</Text>
          </Pressable>
        )}
        renderItem={({ item }) => (
          <Pressable
            className="flex flex-row h-[40px] w-full px-5 mt-1 items-center"
            onPress={() => setSelectedIngredient(item)}
          >
            <Text className="text-lg flex-1">{item.name}</Text>

            <View className="flex flex-row w-[140px] items-center justify-between">
              <Pressable className="w-[30px] h-[30px] items-center justify-center bg-gray-300 rounded-xl">
                <Text>-</Text>
              </Pressable>

              <Text className="w-[80px] text-center">
                {item.portionsAvaliable == null ? "∞ " : item.portionsAvaliable}
                {item.portionUnit ?? ""}
              </Text>

              <Pressable className="w-[30px] h-[30px] items-center justify-center bg-gray-300 rounded-xl">
                <Text>+</Text>
              </Pressable>
            </View>
          </Pressable>
        )}
        contentContainerStyle={{ paddingBottom: 24 }}
      />

      {/* Overlay as a Modal */}
      <Modal
        visible={showNewIngredientOverlay}
        transparent
        animationType="slide"
        onRequestClose={() => setShowNewIngredientOverlay(false)}
      >
        {/* Backdrop */}
        <Pressable
          className="flex-1 bg-black/40"
          onPress={() => setShowNewIngredientOverlay(false)}
        />

        {/* Sheet content */}
        <View className="absolute bottom-0 left-[2.5%] right-0 h-[90%] w-[95%] bg-white rounded-t-2xl p-4">
          <NewIngredientPage
            passedName=""
            passedCloseOverlay={() => setShowNewIngredientOverlay(false)}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}
