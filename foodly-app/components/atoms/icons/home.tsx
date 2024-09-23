import { IconSvgProps } from "@/types";

export const Home: React.FC<IconSvgProps> = ({
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
    <g clipPath="url(#clip0_109_245)">
      <mask
        id="mask0_109_245"
        style={{
          maskType: "luminance",
        }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="24"
        height="24"
      >
        <path d="M24 0H0V24H24V0Z" fill="white" />
      </mask>
      <g mask="url(#mask0_109_245)">
        <path
          d="M19 20.9999H5C4.73478 20.9999 4.48043 20.8946 4.29289 20.707C4.10536 20.5195 4 20.2651 4 19.9999V10.9999H1L11.327 1.61192C11.5111 1.4444 11.7511 1.35156 12 1.35156C12.2489 1.35156 12.4889 1.4444 12.673 1.61192L23 10.9999H20V19.9999C20 20.2651 19.8946 20.5195 19.7071 20.707C19.5196 20.8946 19.2652 20.9999 19 20.9999ZM6 18.9999H18V9.15692L12 3.70292L6 9.15692V18.9999ZM8 14.9999H16V16.9999H8V14.9999Z"
          fill="#FE724C"
        />
      </g>
    </g>
    <defs>
      <clipPath id="clip0_109_245">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
