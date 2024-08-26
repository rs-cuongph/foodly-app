import { lazy, Suspense, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";

import { IconSvgProps } from "@/types";

const CustomIcon = ({ name, ...props }: IconSvgProps) => {

  const Svg = lazy(() => import(`../../../public/images/icons/${name}.svg`));

  return (
    <Suspense fallback={<Icon icon="eos-icons:loading" />}>
      <Svg {...props}/>
    </Suspense>
  );
};

export default CustomIcon;
