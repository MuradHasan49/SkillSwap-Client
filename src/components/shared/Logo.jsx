import SkillSwapIcon from "./SkillSwapIcon";

export default function Logo({ className = "h-8 sm:h-9 w-auto" }) {
  return (
    <div className="flex items-center gap-3">
      <SkillSwapIcon className={className} />
      <span className="text-2xl font-extrabold tracking-tight text-indigo-600 dark:text-indigo-400 select-none">
        Skill<span className="text-gray-900 dark:text-white">Swap</span>
      </span>
    </div>
  );
}
