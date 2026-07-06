// import { Flame, Popcorn, Ghost, Rocket, Heart, Palette } from "lucide-react";

// import { LucideIcon } from "lucide-react";

// export interface Genre {
//   id: number;
//   name: string;
//   iconName: LucideIcon;
// }

// const genres: Genre[] = [
//   {
//     id: 1,
//     name: "Action",
//     iconName: Flame,
//   },
//   {
//     id: 2,
//     name: "Comedy",
//     iconName: Popcorn,
//   },
//   {
//     id: 3,
//     name: "Horror",
//     iconName: Ghost,
//   },
//   {
//     id: 4,
//     name: "Sci-Fi",
//     iconName: Rocket,
//   },
//   {
//     id: 5,
//     name: "Romance",
//     iconName: Heart,
//   },
//   {
//     id: 6,
//     name: "Animation",
//     iconName: Palette,
//   },
// ];

// export default genres;

export interface Genre {
  id: number;
  name: string;
  iconName: string; // Changed from LucideIcon to string
}

const genres: Genre[] = [
  {
    id: 1,
    name: "Action",
    iconName: "Flame",
  },
  {
    id: 2,
    name: "Comedy",
    iconName: "Popcorn",
  },
  {
    id: 3,
    name: "Horror",
    iconName: "Ghost",
  },
  {
    id: 4,
    name: "Sci-Fi",
    iconName: "Rocket",
  },
  {
    id: 5,
    name: "Romance",
    iconName: "Heart",
  },
  {
    id: 6,
    name: "Animation",
    iconName: "Palette",
  },
];

export default genres;