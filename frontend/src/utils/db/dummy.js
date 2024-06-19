export const POSTS = [
  {
    _id: "1",
    text: "OMG #goals 😍",
    img: "/posts/post4.png",
    user: {
      username: "Sparky",
      profileImg: "/avatars/dog2.jpg",
      fullName: "ThatBoySpark",
    },
    comments: [
      {
        _id: "1",
        text: "😍😍😍😍😍",
        user: {
          username: "Louie",
          profileImg: "/avatars/dog8.jpg",
          fullName: "BoujeeLouie",
        },
      },
    ],
    likes: ["6658s891", "6658s892", "6658s893", "6658s894"],
  },
  {
    _id: "2",
    text: "God I hate dogs. Why are they always drooling? #yuck",
    user: {
      username: "ItsMeMeeko",
      profileImg: "/avatars/cat3.jpg",
      fullName: "Meeko",
    },
    comments: [
      {
        _id: "2",
        text: "@ItsMeMeeko I think you're mistaken. Dogs are the best! #toxic 🐶",
        user: {
          username: "TobySparks",
          profileImg: "/avatars/dog5.jpg",
          fullName: "Jane Doe",
        },
      },
    ],
    likes: ["6658s891", "6658s892", "6658s893", "6658s894"],
  },
  {
    _id: "3",
    text: "BUY THE DIP!!🚀🚀",

    user: {
      username: "LunaTrades",

      profileImg: "/avatars/cat5.jpg",
      fullName: "Luna",
    },
    comments: [],
    likes: [
      "6658s891",
      "6658s892",
      "6658s893",
      "6658s894",
      "6658s895",
      "6658s896",
    ],
  },
  {
    _id: "4",
    text: "Hey y'all. Just posting my daily reminder that I know rust",
    user: {
      username: "DoYouKnowRusty",
      profileImg: "/avatars/dog4.jpg",
      fullName: "Rusty",
    },
    comments: [
      {
        _id: "1",
        text: "OMG SHUT UP ALREADY",
        user: {
          username: "Kava",
          profileImg: "/avatars/cat8.jpg",
          fullName: "CryptoKava",
        },
      },
    ],
    likes: [
      "6658s891",
      "6658s892",
      "6658s893",
      "6658s894",
      "6658s895",
      "6658s896",
      "6658s897",
      "6658s898",
      "6658s899",
    ],
  },
];

export const USERS_FOR_RIGHT_PANEL = [
  {
    _id: "1",
    fullName: "Ollie",
    username: "TheRealOllie",
    profileImg: "/avatars/dog1.jpg",
  },
  {
    _id: "2",
    fullName: "Meeko",
    username: "ItsMeMeeko",
    profileImg: "/avatars/cat3.jpg",
  },
  {
    _id: "3",
    fullName: "Rusty",
    username: "DoYouKnowRusty",
    profileImg: "/avatars/dog4.jpg",
  },
  {
    _id: "4",
    fullName: "Luna",
    username: "LunaTrades",
    profileImg: "/avatars/cat5.jpg",
  },
  {
    _id: "5",
    fullName: "Toby",
    username: "TobySparks",
    profileImg: "/avatars/dog5.jpg",
  },
];
