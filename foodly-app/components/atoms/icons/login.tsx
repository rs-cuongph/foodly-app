import { IconSvgProps } from "@/types";

export const Login: React.FC<IconSvgProps> = ({
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
      d="M8.56613 13.2812L12.1453 10L8.56613 6.71875"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.59827 10H12.1428"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.7818 3.125H16.9176C17.0984 3.125 17.2718 3.19085 17.3996 3.30806C17.5275 3.42527 17.5993 3.58424 17.5993 3.75V16.25C17.5993 16.4157 17.5275 16.5747 17.3996 16.6919C17.2718 16.8092 17.0984 16.875 16.9176 16.875H10.7818"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
