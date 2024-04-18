import { icons, images } from "../../../constants";
export const data = [
  {
    ads: [
      {
        id: "adBanner-1",
        banner: images.ad1,
      },
      {
        id: "adBanner-2",
        banner: images.ad2,
      },
      {
        id: "adBanner-3",
        banner: images.ad1,
      },      
    ],
    categories: [
      {
        icon: icons.cardioIcon,
        title: "Cardio",
        badge: "New",
        moreDetails: [
          {
            id: "cat_cardio_1",
            name: "Deep Crazy",
            calories: "125 kcal",
            time: "15min",
            type: "Beginner - Full body",
            thumnail: images.dummyImage
          },
          {
            id: "cat_cardio_2",
            name: "Deep Amrap Burner",
            calories: "125 kcal",
            time: "15min",
            type: "Beginner - Full body",
            thumnail: images.dummyImage
          },
          {
            id: "cat_cardio_3",
            name: "Deep Butt Sculp",
            calories: "88 kcal",
            time: "30min",
            type: "Beginner - Full body",
            thumnail: images.dummyImage
          },
          {
            id: "cat_cardio_4",
            name: "Deep Amrap Killer",
            calories: "125 kcal",
            time: "15min",
            type: "Beginner - Full body",
            thumnail: images.dummyImage
          },
          {
            id: "cat_cardio_5",
            name: "Deep Amrap Blaster",
            calories: "125 kcal",
            time: "15min",
            type: "Beginner - Full body",
            thumnail: images.dummyImage
          }
        ]
      },
      {
        icon: icons.strengthIcon,
        title: "Strength",  
        moreDetails: [
          {
            id: "cat_strength_1",
            name: "Deep Crazy Strength",
            calories: "125 kcal",
            time: "15min",
            type: "Beginner - Full body",
            thumnail: images.dummyImage
          },
          {
            id: "cat_strength_2",
            name: "Deep Amrap Burner Strength",
            calories: "125 kcal",
            time: "15min",
            type: "Beginner - Full body",
            thumnail: images.dummyImage
          },
          {
            id: "cat_strength_3",
            name: "Deep Butt Sculp Strength",
            calories: "88 kcal",
            time: "30min",
            type: "Beginner - Full body",
            thumnail: images.dummyImage
          },
          {
            id: "cat_strength_4",
            name: "Deep Amrap Killer Strength",
            calories: "125 kcal",
            time: "15min",
            type: "Beginner - Full body",
            thumnail: images.dummyImage
          },          
        ]      
      },
      {
        icon: icons.enduranceIcon,
        title: "Endurance",    
        moreDetails: [
          {
            id: "cat_endurance_1",
            name: "Deep Crazy Endurance",
            calories: "125 kcal",
            time: "15min",
            type: "Beginner - Full body",
            thumnail: images.dummyImage
          },
          {
            id: "cat_endurance_2",
            name: "Deep Amrap Burner Endurance",
            calories: "125 kcal",
            time: "15min",
            type: "Beginner - Full body",
            thumnail: images.dummyImage
          },
          {
            id: "cat_endurance_3",
            name: "Deep Butt Sculp Endurance",
            calories: "88 kcal",
            time: "30min",
            type: "Beginner - Full body",
            thumnail: images.dummyImage
          },
          {
            id: "cat_endurance_4",
            name: "Deep Amrap Killer",
            calories: "125 kcal",
            time: "15min",
            type: "Beginner - Full body",
            thumnail: images.dummyImage
          },
          {
            id: "cat_endurance_5",
            name: "Deep Amrap Blaster Endurance",
            calories: "125 kcal",
            time: "15min",
            type: "Beginner - Full body",
            thumnail: images.dummyImage
          }
        ]    
      },
      {
        icon: icons.coreIcon,
        title: "Core",
        moreDetails: [
          {
            id: "cat_core_1",
            name: "Deep Crazy Core",
            calories: "125 kcal",
            time: "15min",
            type: "Beginner - Full body",
            thumnail: images.dummyImage
          },
          {
            id: "cat_core_2",
            name: "Deep Amrap Burner Core",
            calories: "125 kcal",
            time: "15min",
            type: "Beginner - Full body",
            thumnail: images.dummyImage
          },
          {
            id: "cat_core_3",
            name: "Deep Butt Sculp Core",
            calories: "88 kcal",
            time: "30min",
            type: "Beginner - Full body",
            thumnail: images.dummyImage
          },
          {
            id: "cat_core_4",
            name: "Deep Amrap Killer Core",
            calories: "125 kcal",
            time: "15min",
            type: "Beginner - Full body",
            thumnail: images.dummyImage
          },
          {
            id: "cat_core_5",
            name: "Deep Amrap Blaster Core",
            calories: "125 kcal",
            time: "15min",
            type: "Beginner - Full body",
            thumnail: images.dummyImage
          }
        ]
      },
    ],
    session:[
      {
        id: "session_id_1",
        title: "Basic of Training",
        coach: "Marco Wagner",
        time: "12:00 pm",
        date: "12/04/2022",
        location: "Gym",
        price: 22,
      },
      {
        id: "session_id_2",
        title: "Intermediate Level",
        coach: "Kylee Danford",
        time: "12:00 pm",
        date: "12/04/2022",
        location: "Gym",
        price: 30,
      },
      {
        id: "session_id_3",
        title: "Advanced Level",
        coach: "Marco Wagner",
        time: "12:00 pm",
        date: "12/04/2022",
        location: "Gym",
        price: 20,
      }
    ],
    coachs: [
      {
        id: "coach_1",
        name: "Marco Wagner",
        rating: "5.0",
        image: images.userDummyImage,
      },
      {
        id: "coach_2",
        name: "Kylee Danford",
        rating: "4.5",
        image: images.userDummyImage,
      },
      {
        id: "coach_3",
        name: "Aileen Fullbright",
        rating: "4.9",
        image: images.userDummyImage,
      },
      {
        id: "coach_4",
        name: "Robin Backenbauer",
        rating: "5.0",
        image: images.userDummyImage,
      },
      {
        id: "coach_5",
        name: "Brittni Lando",
        rating: "4.0",
        image: images.userDummyImage,
      }
    ]
  },
];
