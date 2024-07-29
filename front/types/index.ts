import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  name?: string;
  size?: number;
};
