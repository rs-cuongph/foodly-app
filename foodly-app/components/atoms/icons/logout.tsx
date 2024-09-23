import { IconSvgProps } from "@/types";

export const Logout: React.FC<IconSvgProps> = ({
  size = 20,
  width,
  height,
  ...props
}) => (
  <svg
    width={size || width}
    height={size || height}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.66667 10.8334H11.25V9.16669H1.66667V10.8334Z"
      fill="white"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3.99402 6.49414L1.07735 9.41083C0.751911 9.73625 0.751911 10.2639 1.07735 10.5893L3.99402 13.506L5.17252 12.3275L2.84512 10.0001L5.17252 7.67265L3.99402 6.49414Z"
      fill="white"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.7818 4.16667C9.982 4.16667 8.37308 5.01429 7.32156 6.34903L6.01237 5.31762C7.36228 3.60417 9.4435 2.5 11.7818 2.5C15.8741 2.5 19.167 5.87157 19.167 10C19.167 14.1284 15.8741 17.5 11.7818 17.5C9.4435 17.5 7.36228 16.3958 6.01237 14.6823L7.32156 13.651C8.37308 14.9857 9.982 15.8333 11.7818 15.8333C14.9264 15.8333 17.5003 13.2353 17.5003 10C17.5003 6.76463 14.9264 4.16667 11.7818 4.16667Z"
      fill="white"
    />
  </svg>
);
