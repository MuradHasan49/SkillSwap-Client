import Image from "next/image";
import icon from "@/app/icon.png";

export default function SkillSwapIcon({ className = "size-8" }) {
  return (
    <Image 
      src={icon} 
      alt="SkillSwap Logo" 
      className={`object-contain ${className}`}
    />
  );
}
