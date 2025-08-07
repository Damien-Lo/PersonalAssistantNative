import { useContext, useEffect, useMemo, useState } from "react";
import { DishListContext } from "../../contexts/DishListContext";
import { CalendarContext } from "../../contexts/CalendarContext";
import { ScrollView } from "react-native";

const MenuModule = ({ breakfastEvents, lunchEvents, dinnerEvents, selectedDay }) => {
    const {
        calendarEventList,
        setCalendarEventList,
        calendarEventTypes,
        setCalendarEventTypes,
        createCalendarEvent,
        editCalendarEvent,
        deleteCalendarEvent,
        createVirtualEvent,
        formatDateToYYYMMDD,
        removeIngredientsOfEventFromStock
    } = useContext(CalendarContext)


    const {
        fullDishList,
        setFullDishList,
        createDish,
        editDish,
        deleteDish
    } = useContext(DishListContext)

    const [totalCal, setTotalCal] = useState(0)
    const [totalProtein, setTotalProtein] = useState(0)
    const [totalCarbs, setTotalCarb] = useState(0)
    const [totalFats, setTotalFats] = useState(0)
    const [breakfastDishes, setBreakfastDishes] = useState([])
    const [lunchDishes, setLunchDishes] = useState([])
    const [dinnerDishes, setDinnerDishes] = useState([])

    const [selectedDish, setSelectedDish] = useState(null)
    const [selectedEventId, setSelectedEventId] = useState(null)
    const [selectedEventVirtuality, setSelectedEventVirtuality] = useState(null)



    //Set Dishes from Events 
    useEffect(() => {
        setBreakfastDishes(
            breakfastEvents.flatMap((event) =>
                event.dishList
                    .map((d) => {
                        const matchedDish = fullDishList.find((dish) => dish._id.toString() === d._id.toString());
                        if (!matchedDish) return null;
                        const eventTime = new Date(event.startDate)
                        const eventIsVirtual = event?.isVirtual ?? false;
                        const event_id = event?._refid ?? event._id

                        return {
                            event_id: event_id,
                            eventTitle: event.title,
                            eventTime: String(eventTime.getHours()) + ":" + String(eventTime.getMinutes()).padStart(2, '0'),
                            dish: matchedDish,
                            virtual: eventIsVirtual
                        }

                    })
                    .filter(Boolean)
            )
        );

        setLunchDishes(
            lunchEvents.flatMap((event) =>
                event.dishList
                    .map((d) => {
                        const matchedDish = fullDishList.find((dish) => dish._id.toString() === d._id.toString());
                        if (!matchedDish) return null;
                        const eventTime = new Date(event.startDate)
                        return {
                            event_id: event._id,
                            eventTitle: event.title,
                            eventTime: String(eventTime.getHours()) + ":" + String(eventTime.getMinutes()).padStart(2, '0'),
                            dish: matchedDish
                        };
                    })
                    .filter(Boolean)
            )
        );

        setDinnerDishes(
            dinnerEvents.flatMap((event) =>
                event.dishList
                    .map((d) => {
                        const matchedDish = fullDishList.find((dish) => dish._id.toString() === d._id.toString());
                        if (!matchedDish) return null;
                        const eventTime = new Date(event.startDate)
                        const eventIsVirtual = event?.isVirtual ?? false;
                        const event_id = event?._refid ?? event._id

                        return {
                            event_id: event_id,
                            eventTitle: event.title,
                            eventTime: String(eventTime.getHours()) + ":" + String(eventTime.getMinutes()).padStart(2, '0'),
                            dish: matchedDish,
                            virtual: eventIsVirtual
                        }

                    })
                    .filter(Boolean)
            )
        );
    }, [breakfastEvents, lunchEvents, dinnerEvents, fullDishList]);


    //Set Variables From Dishes
    useEffect(() => {
        let cal = 0;
        let protein = 0;
        let carbs = 0;
        let fats = 0;

        const allDishes = [...breakfastDishes, ...lunchDishes, ...dinnerDishes];
        allDishes.forEach((dishEvent) => {
            cal += dishEvent['dish'].calories ?? 0;
            protein += dishEvent['dish'].protein ?? 0;
            carbs += dishEvent['dish'].carbs ?? 0;
            fats += dishEvent['dish'].fats ?? 0;
        });

        setTotalCal(cal);
        setTotalProtein(protein);
        setTotalCarb(carbs);
        setTotalFats(fats);
    }, [breakfastDishes, lunchDishes, dinnerDishes]);

    /**
     * changeDishInCalendarFunc
     * Given a dish, it changes the selectedEvent and selcetedDish with passed dish
     * 
     * NOTE: This Function is passed down components, defined in MenuModule -> MenuDishDetailsInfoPage when a dish is selected
     *       -> AllMealsListPage when change button is clicked, where if forChange is true, selecting a dish will call this function
     *        passing said dish
     * @param {*} dish Dish to replace selected dish in selected event
     */
    const changeDishInCalendarFunc = (dish) => {
        const originalEvent = calendarEventList.find(e => e._id === selectedEventId);
        const { _id, ...rest } = originalEvent;
        const selected = new Date(selectedDay);
        selected.setHours(0, 0, 0, 0);

        const originalStart = new Date(originalEvent.startDate);
        const originalEnd = new Date(originalEvent.endDate);

        // Get time components
        const startHour = originalStart.getHours();
        const startMinute = originalStart.getMinutes();
        const endHour = originalEnd.getHours();
        const endMinute = originalEnd.getMinutes();

        // Construct new dates with selectedDay's date and original time
        const newStartDate = new Date(selected);
        newStartDate.setHours(startHour, startMinute, 0, 0);

        const newEndDate = new Date(selected);
        newEndDate.setHours(endHour, endMinute, 0, 0);

        const updatedEvent = {
            ...rest,
            dishList: [
                ...originalEvent.dishList.filter(d => d._id !== selectedDish._id),
                dish
            ],
            title: originalEvent.title.includes("Edited")
                ? originalEvent.title
                : originalEvent.title + " - Edited",
            repeat: 'none',
            repeatDays: [],
            repeatUntil: null,
            skipRenderDays: [],
            startDate: newStartDate.toISOString(),
            endDate: newEndDate.toISOString()
        };

        //If It is a Virtual event, break it off from previous, copy it and post it with new dishes
        if (selectedEventVirtuality) {
            const normalizedDay = new Date(selectedDay);
            normalizedDay.setHours(0, 0, 0, 0);
            const updatedOriginalEvent = {
                ...originalEvent,
                skipRenderDays: [...(originalEvent.skipRenderDays || []), normalizedDay.toISOString()]
            };
            editCalendarEvent(selectedEventId, updatedOriginalEvent)
            createCalendarEvent(updatedEvent)

        } else {
            //Directly Edit the event
            editCalendarEvent(selectedEventId, updatedEvent)
        }
    }

    const removeDishInCalendar = () => {
        const originalEvent = calendarEventList.find(e => e._id === selectedEventId);
        const { _id, ...rest } = originalEvent;
        const selected = new Date(selectedDay);
        selected.setHours(0, 0, 0, 0);

        const originalStart = new Date(originalEvent.startDate);
        const originalEnd = new Date(originalEvent.endDate);

        // Get time components
        const startHour = originalStart.getHours();
        const startMinute = originalStart.getMinutes();
        const endHour = originalEnd.getHours();
        const endMinute = originalEnd.getMinutes();

        // Construct new dates with selectedDay's date and original time
        const newStartDate = new Date(selected);
        newStartDate.setHours(startHour, startMinute, 0, 0);

        const newEndDate = new Date(selected);
        newEndDate.setHours(endHour, endMinute, 0, 0);

        const updatedEvent = {
            ...rest,
            dishList: [
                ...originalEvent.dishList.filter(d => d._id !== selectedDish._id),
            ],
            title: originalEvent.title.includes("Edited")
                ? originalEvent.title
                : originalEvent.title + " - Edited",
            repeat: 'none',
            repeatDays: [],
            repeatUntil: null,
            skipRenderDays: [],
            startDate: newStartDate.toISOString(),
            endDate: newEndDate.toISOString()
        };

        if (selectedEventVirtuality) {
            const normalizedDay = new Date(selectedDay);
            normalizedDay.setHours(0, 0, 0, 0);
            const updatedOriginalEvent = {
                ...originalEvent,
                skipRenderDays: [...(originalEvent.skipRenderDays || []), normalizedDay.toISOString()]
            };
            editCalendarEvent(selectedEventId, updatedOriginalEvent)
            createCalendarEvent(updatedEvent)

        } else {
            //Directly Edit the event
            editCalendarEvent(selectedEventId, updatedEvent)
        }
    }

    const addDishInCalendar = (dish) => {
        const originalEvent = calendarEventList.find(e => e._id === selectedEventId);
        const { _id, ...rest } = originalEvent;
        const selected = new Date(selectedDay);
        selected.setHours(0, 0, 0, 0);

        const originalStart = new Date(originalEvent.startDate);
        const originalEnd = new Date(originalEvent.endDate);

        // Get time components
        const startHour = originalStart.getHours();
        const startMinute = originalStart.getMinutes();
        const endHour = originalEnd.getHours();
        const endMinute = originalEnd.getMinutes();

        // Construct new dates with selectedDay's date and original time
        const newStartDate = new Date(selected);
        newStartDate.setHours(startHour, startMinute, 0, 0);

        const newEndDate = new Date(selected);
        newEndDate.setHours(endHour, endMinute, 0, 0);

        const updatedEvent = {
            ...rest,
            dishList: [
                ...originalEvent.dishList,
                dish
            ],
            title: originalEvent.title.includes("Edited")
                ? originalEvent.title
                : originalEvent.title + " - Edited",
            repeat: 'none',
            repeatDays: [],
            repeatUntil: null,
            skipRenderDays: [],
            startDate: newStartDate.toISOString(),
            endDate: newEndDate.toISOString()
        };

        //If It is a Virtual event, break it off from previous, copy it and post it with new dishes
        if (selectedEventVirtuality) {
            const normalizedDay = new Date(selectedDay);
            normalizedDay.setHours(0, 0, 0, 0);
            const updatedOriginalEvent = {
                ...originalEvent,
                skipRenderDays: [...(originalEvent.skipRenderDays || []), normalizedDay.toISOString()]
            };
            editCalendarEvent(selectedEventId, updatedOriginalEvent)
            createCalendarEvent(updatedEvent)

        } else {
            //Directly Edit the event
            editCalendarEvent(selectedEventId, updatedEvent)
        }
    }



    const EventCard = ({ meal, dishDictionary, eventList }) => {
        const [createNewEventOverlay, setCreateNewEventOverlay] = useState(false)
        const [addDishOverlay, setAddDishOverlay] = useState(false)
        const [newEventStartTime, setNewEventStartTime] = useState("")
        const [newEventEndTime, setNewEventEndTime] = useState("")

        const [currentEventIndex, setCurrentEventIndex] = useState(0)
        const [currentDishIndex, setCurrentDishIndex] = useState(0)
        const [flattenedIndex, setFlattenedIndex] = useState(0)

        useEffect(() => {
            if (meal == "Breakfast") {
                setNewEventStartTime("07:00")
                setNewEventEndTime("07:30")
            }
            if (meal == "Lunch") {
                setNewEventStartTime("12:00")
                setNewEventEndTime("13:00")
            }
            if (meal == "Dinner") {
                setNewEventStartTime("19:00")
                setNewEventEndTime("20:00")
            }
            console.log(eventList)
        })

        const closeCreateNewEventOverlay = () => {
            setCreateNewEventOverlay(false)
        }

        const closeAddDishOverlay = () => {
            setAddDishOverlay(false)
        }



        //===========================
        //         UI COMPONENT 
        //==========================


        //If there are no events
        if (eventList.length === 0) {
            return (
                <div className="py-3 px-2 border-2 border-gray-300 h-[125px] relative"
                    onClick={(e) => { setCreateNewEventOverlay(true) }}>
                    <div className="text-center text-lg font-semibold text-gray-800 mb-1">
                        No {meal} Events
                    </div>

                    <div className="text-center italic text-gray-700 text-sm leading-snug mb-2 px-1">
                        Click To Make An Event
                    </div>


                    {createNewEventOverlay && (
                        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-2">
                            <div className="bg-white w-full max-w-md max-h-[90vh] rounded-md overflow-y-auto p-4">
                                <NewCalendarEventPage
                                    presetstartDate={selectedDay}
                                    presetEndDate={selectedDay}
                                    presetStartTime={newEventStartTime}
                                    presetEndTime={newEventEndTime}
                                    presetMeal={meal}
                                    presetType={"Dining Event"}
                                    closeOverlay={closeCreateNewEventOverlay}
                                />
                            </div>
                        </div>
                    )}

                </div>
            );
        }

        //If there are events
        else {

            const handlePrev = () => {
                if (currentDishIndex > 0) {
                    setCurrentDishIndex(currentDishIndex - 1);
                } else {
                    const prevEventIndex = currentEventIndex > 0
                        ? currentEventIndex - 1
                        : eventList.length - 1;

                    const prevEvent = eventList[prevEventIndex];

                    setCurrentEventIndex(prevEventIndex);
                    setCurrentDishIndex(prevEvent.dishList.length - 1);
                }
            };

            const handleNext = () => {
                const event = eventList[currentEventIndex]
                if (flattenedIndex + 1 == dishDictionary.length) {
                    setFlattenedIndex(0)
                } else {
                    setFlattenedIndex(flattenedIndex + 1)
                }


                if (currentDishIndex + 1 <= event.dishList.length - 1) {
                    setCurrentDishIndex(currentDishIndex + 1)
                }
                else {
                    setCurrentDishIndex(0)
                    if (currentEventIndex + 1 <= eventList.length - 1) {
                        setCurrentEventIndex(currentEventIndex + 1)
                    }
                    else {
                        setCurrentEventIndex(0)
                    }
                }
            }


            {/* If the currently selceted event has no dishes */ }

            if (eventList[currentEventIndex].dishList.length === 0) {
                return (
                    <div className="py-3 px-2 border-2 border-gray-300 h-[125px] relative"
                        onClick={(e) => {
                            setAddDishOverlay(true);
                            setSelectedEventId(eventList[currentEventIndex]._id)
                        }}>
                        <div className="flex items-center justify-center text-lg font-semibold text-gray-800 mb-1">
                            <div>{eventList[currentEventIndex].title}</div>
                        </div>

                        <div className="text-center italic text-gray-700 text-sm leading-snug mb-2 px-1">
                            Current Event Has No Meals <br />  Click to Add A Meal
                        </div>



                        {eventList.length > 1 && (
                            <div className="absolute top-1/2 left-2 transform -translate-y-1/2 cursor-pointer" onClick={(e) => { e.stopPropagation(); handlePrev(); }}>
                                ❮
                            </div>
                        )}
                        {eventList.length > 1 && (
                            <div className="absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer" onClick={(e) => { e.stopPropagation(); handleNext(); }}>
                                ❯
                            </div>
                        )}


                        {addDishOverlay && (
                            <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-2 h-[650px] top-[80px]"
                                onClick={(e) => { e.stopPropagation(); }}>
                                <div className="bg-white w-full max-w-md max-h-[90vh] rounded-md overflow-y-auto p-4 h-[600px]">
                                    <div className="flex justify-end" onClick={(e) => { e.stopPropagation(); setAddDishOverlay(false); }}>
                                        <div className="text-red-500 underline cursor-pointer">
                                            Cancel
                                        </div>
                                    </div>
                                    <div className="">
                                        <AllMealsListPage
                                            forChange={true}
                                            changeDishInCalendar={addDishInCalendar}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                )
            }


            //If the currently selected event has dishes
            else {
                const dish = fullDishList.find((d) => d._id === eventList[currentEventIndex].dishList[currentDishIndex]._id)

                return (
                    <div className="py-3 px-2 border-2 border-gray-300 h-[125px] relative"
                        onClick={(e) => {
                            setSelectedEventId(eventList[currentEventIndex]._id)
                            const dishId = eventList[currentEventIndex].dishList[currentDishIndex]._id
                            const dish = fullDishList.find((d) => d._id === dishId)
                            setSelectedDish(dish)

                        }}>
                        <button
                            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEventId(eventList[currentEventIndex]._id)
                                setAddDishOverlay(true);
                            }}
                        >+</button>
                        <div className="flex items-center justify-center text-lg font-semibold text-gray-800 mb-1">
                            <div>{eventList[currentEventIndex].title}</div>
                            <div className="text-xs text-gray-600 ml-2">
                                ({flattenedIndex + 1} / {dishDictionary.length})
                            </div>

                        </div>


                        <div className="text-center italic text-gray-700 text-sm leading-snug mb-2 px-1">
                            {dish?.name || "Cant Find Dish"}
                        </div>

                        <div className="flex justify-center gap-4 text-[11px] text-gray-500 font-medium">
                            <div>cal: {Math.round(dish?.calories * 10) / 10} cal</div>
                            <div>protein: {Math.round(dish?.protein * 10) / 10}g</div>
                            <div>carbs: {Math.round(dish?.carbs * 10) / 10}g</div>
                            <div>fats: {Math.round(dish?.fats * 10) / 10}g</div>
                        </div>


                        {((eventList.length > 1) || (eventList[currentEventIndex].dishList.length > 1)) && (
                            <div className="absolute top-1/2 left-2 transform -translate-y-1/2 cursor-pointer" onClick={(e) => { e.stopPropagation(); handlePrev(); }}>
                                ❮
                            </div>
                        )}
                        {((eventList.length > 1) || (eventList[currentEventIndex].dishList.length > 1)) && (
                            <div className="absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer" onClick={(e) => { e.stopPropagation(); handleNext(); }}>
                                ❯
                            </div>
                        )}


                        {addDishOverlay && (
                            <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-2 h-[650px] top-[80px]"
                                onClick={(e) => { e.stopPropagation(); }}>
                                <div className="bg-white w-full max-w-md max-h-[90vh] rounded-md overflow-y-auto p-4 h-[600px]">
                                    <div className="flex justify-end" onClick={(e) => { e.stopPropagation(); setAddDishOverlay(false); }}>
                                        <div className="text-red-500 underline cursor-pointer">
                                            Cancel
                                        </div>
                                    </div>
                                    <div className="">
                                        <AllMealsListPage
                                            forChange={true}
                                            changeDishInCalendar={addDishInCalendar}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                    </div >
                )
            }
        };
    }






















    return (
        <ScrollView>
            <EventCard meal="breakfast" dishDictionary={breakfastDishes} eventList={breakfastEvents}/>
        </ScrollView>
    );
};

export default MenuModule;