import {
    Flame,
    Orbit,
    BookOpen,
    Landmark,
    Music,
    Flower2,
} from "lucide-react";

const navigation = [
    {
  id: 1,
  title: "Daily Prayer",
  icon: Flame,
  target: "hero",
},
{
  id: 2,
  title: "Mantras",
  icon: Orbit,
  target: "mantras",
},
{
  id: 3,
  title: "Bhajans",
  icon: Music,
  target: "mantras",
},
{
  id: 4,
  title: "Aarti",
  icon: Flower2,
  target: "aarti",
},
{
  id: 5,
  title: "Stories",
  icon: BookOpen,
  target: "stories",
},
{
  id: 6,
  title: "Virtual Tour",
  icon: Landmark,
  target: "virtual-tour",
},
];

export default navigation;