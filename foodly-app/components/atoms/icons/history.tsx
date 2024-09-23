import { IconSvgProps } from "@/types";

export const HistoryOrder: React.FC<IconSvgProps> = ({
  size = 24,
  width,
  height,
  ...props
}) => (
  <svg
    width={size || width}
    height={size || height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M21 12V4.5C21 3.67158 20.3285 3 19.5 3H4.5C3.67158 3 3 3.67158 3 4.5V19.5C3 20.3285 3.67158 21 4.5 21H12"
      stroke="#FE724C"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 19C17.6569 19 19 17.6569 19 16C19 14.3431 17.6569 13 16 13C14.3431 13 13 14.3431 13 16C13 17.6569 14.3431 19 16 19Z"
      stroke="#FE724C"
      strokeWidth="2"
    />
    <path
      d="M18.5 18L21 20"
      stroke="#FE724C"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 8H17"
      stroke="#FE724C"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 12H11"
      stroke="#FE724C"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
