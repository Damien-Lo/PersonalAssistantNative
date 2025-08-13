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
import EditIngredientPage from "./EditIngredientPage";
import { Dish, DishListContext } from "../../contexts/DishListContext";
import NewDishPage from "./NewDishPage";
import EditDishPage from "./EditDishPage";

export default function AllDishesPage() {
  const navigator = useNavigation();

  //=====================================
  //              VARIABLES
  //=====================================

  type DishByCategory = Record<string, Dish[]>;

  //CONTEXTS
  const {
    fullIngredientList,
    setFullIngredientList,
    createIngredient,
    editIngredient,
    deleteIngredient,
  } = useContext(IngredientListContext);

  const { fullDishList, setFullDishList, createDish, editDish, deleteDish } =
    useContext(DishListContext);

  //SUPPORTING VARIABLES
  const [categorisedDishDict, setCategorisedDishDict] =
    useState<DishByCategory>({});
  const [dishSectionListData, setDishSectionListData] = useState<
    { title: string; data: Dish[] }[]
  >([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const shownSections = useMemo(
    () =>
      dishSectionListData.map((s) => ({
        title: s.title,
        data: expanded.has(s.title) ? s.data : [],
      })),
    [dishSectionListData, expanded]
  );

  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const expandedRef = useRef(new Set());

  const [showNewDishOverlay, setShowNewDishOverlay] = useState<boolean>(false);

  const [q, setQ] = useState("");

  //=====================================
  //              FUNCTIONS
  //=====================================
  const testFunc = () => {
    console.log(selectedDish);
  };

  /**
   * closeIngredientDetailOverlay
   */
  const closeIngredientDetailOverlay = () => {
    setSelectedDish(null);
  };

  /**
   * useEffect
   * Categorise Ingredient Categories on render
   */
  useEffect(() => {
    const grouped = fullDishList.reduce<DishByCategory>((acc, item) => {
      const cat: string =
        item.category == null || item.category == ""
          ? "Uncategorized"
          : item.category;
      (acc[cat] ??= []).push(item); // same as: if (!acc[cat]) acc[cat] = []; acc[cat].push(item);
      return acc;
    }, {});
    setCategorisedDishDict(grouped);

    const sections = Object.entries(grouped).map(([title, data]) => ({
      title,
      data,
    }));

    setDishSectionListData(sections);
  }, [fullDishList]);

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

  //=====================================
  //              UI COMPONENTS
  //=====================================

  const Header = (
    <View className="px-5 pt-4 pb-3">
      <View className="flex flex-row justify-between items-center">
        <Text className="text-4xl font-bold text-gray-800 pb-2">
          All Dishes Page
        </Text>
        <Pressable
          className="bg-gray-300 rounded-full w-[30px] h-[30px] items-center justify-center"
          onPress={() => setShowNewDishOverlay(true)}
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
          All Dishes Page
        </Text>
      </View>
      <View className="flex flex-row items-center justify-between px-5">
        <View className="w-[90%] mr-[10px]">
          <SearchBar
            value={q}
            onChangeText={setQ}
            placeholder="Search Dishes"
            debounceMs={150}
            returnKeyType="search"
          />
        </View>
        <Pressable
          className="w-[40px] h-[40px] bg-gray-400 rounded-full flex items-center justify-center"
          onPress={() => {
            setShowNewDishOverlay(true);
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
            className="flex flex-row h-[50px] w-[395px] px-5 mt-1 items-center bg-gray-100 rounded-lg mx-5 px-2"
            onPress={() => setSelectedDish(item)}
          >
            <View className="h-[40px]">
              <Text className="text-lg flex-1">{item.name}</Text>
              <Text className="text-md text-gray-500">
                {item.restaurant}, {item.description}
              </Text>
            </View>
          </Pressable>
        )}
        contentContainerStyle={{ paddingBottom: 24 }}
      />

      {/* Overlay as a Modal */}
      <Modal
        visible={showNewDishOverlay}
        transparent
        animationType="slide"
        onRequestClose={() => setShowNewDishOverlay(false)}
      >
        {/* Backdrop */}
        <Pressable
          className="flex-1 bg-black/40"
          onPress={() => setShowNewDishOverlay(false)}
        />

        {/* Sheet content */}
        <View className="absolute bottom-0 left-[2.5%] right-0 h-[90%] w-[95%] bg-white rounded-t-2xl p-4">
          <NewDishPage
            passedCloseOverlay={() => setShowNewDishOverlay(false)}
          />
        </View>
      </Modal>

      <Modal
        visible={selectedDish != null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedDish(null)}
      >
        {/* Backdrop */}
        <Pressable
          className="flex-1 bg-black/40"
          onPress={() => setSelectedDish(null)}
        />

        {/* Sheet content */}
        <View className="absolute bottom-0 left-[2.5%] right-0 h-[95%] w-[95%] bg-white rounded-t-2xl p-4">
          {selectedDish && (
            <EditDishPage
              passedDish={selectedDish}
              passedCloseOverlay={() => setSelectedDish(null)}
            />
          )}
        </View>
      </Modal>

      <Modal
        visible={selectedDish != null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedDish(null)}
      >
        {/* Backdrop */}
        <Pressable
          className="flex-1 bg-black/40"
          onPress={() => setSelectedDish(null)}
        />

        {/* Sheet content */}
        <View className="absolute bottom-0 left-[2.5%] right-0 h-[95%] w-[95%] bg-white rounded-t-2xl p-4">
          {selectedDish && (
            <EditDishPage
              passedDish={selectedDish}
              passedCloseOverlay={() => setSelectedDish(null)}
            />
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}
