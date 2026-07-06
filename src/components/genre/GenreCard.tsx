// "use client";

// import { motion } from "framer-motion";
// import { LucideIcon } from "lucide-react";

// interface GenreCardProps {
//   name: string;
//   icon: LucideIcon;
// }

// export default function GenreCard({ name, icon: Icon }: GenreCardProps) {
//   return (
//     <motion.div
//       whileHover={{
//         y: -8,
//         scale: 1.03,
//       }}
//       transition={{
//         duration: 0.25,
//       }}
//       className="
//         group
//         cursor-pointer
//         rounded-2xl
//         border
//         border-slate-800
//         bg-slate-900
//         p-8
//         text-center
//         transition
//         hover:border-red-600
//         hover:bg-slate-800
//       "
//     >
//       <div
//         className="
//           mx-auto
//           mb-5
//           flex
//           h-16
//           w-16
//           items-center
//           justify-center
//           rounded-full
//           bg-red-600/10
//           transition
//           group-hover:bg-red-600
//         "
//       >
//         <Icon
//           size={30}
//           className="text-red-500 transition group-hover:text-white"
//         />
//       </div>

//       <h3 className="text-lg font-semibold">{name}</h3>
//     </motion.div>
//   );
// }

"use client";

import { motion } from "framer-motion";
// 1. Import only the specific icons you need
import {
  Flame,
  Popcorn,
  Ghost,
  Rocket,
  Heart,
  Palette,
  HelpCircle,
  LucideIcon,
} from "lucide-react";

// 2. Create an explicit lookup object mapping your strings to the Components
const iconRegistry: Record<string, LucideIcon> = {
  Flame: Flame,
  Popcorn: Popcorn,
  Ghost: Ghost,
  Rocket: Rocket,
  Heart: Heart,
  Palette: Palette,
};

interface GenreCardProps {
  name: string;
  iconName: string;
}

export default function GenreCard({ name, iconName }: GenreCardProps) {
  // 3. Look up the component securely from your registry
  const IconComponent = iconRegistry[iconName] || HelpCircle;

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.03 }}
      transition={{ duration: 0.25 }}
      className="group cursor-pointer rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center transition hover:border-red-600 hover:bg-slate-800"
    >
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-600/10 transition group-hover:bg-red-600">
        <IconComponent
          size={30}
          className="text-red-500 transition group-hover:text-white"
        />
      </div>

      <h3 className="text-lg font-semibold text-white">{name}</h3>
    </motion.div>
  );
}
