"use client";

import CustomIcon from "../CustomIcon";
interface TagType {
  label: string;
  icon: string | undefined;
}
export const Tag: React.FC<TagType> = ({ label, icon }) => {
  return (
    <div className="flex items-center p-2 shadow-sunset rounded-xl gap-1">
      <CustomIcon name={icon} />
      <span className="text-xs text-dark-gray font-bold">{label}</span>
    </div>
  );
}
