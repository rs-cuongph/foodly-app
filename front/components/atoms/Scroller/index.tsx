"use client";

import SimpleBar from "simplebar";
import "simplebar/dist/simplebar.css";
import { useEffect, useRef } from "react";

import Spinner from "../Spinner";

interface ScrollerProps {
  height?: number | string;
  width?: number | string;
  direction?: "vertical" | "horizontal";
  children?: JSX.Element | JSX.Element[] | string;
  autoHide?: boolean;
  isFetching?: boolean;
  hasLoadMore?: boolean;
  hasStartLoadMore?: boolean;
  scrollPosition?: "top" | "bottom";
  scrollLength?: number;
  scrollPaddingBottom?: number;
  noScrollPadding?: boolean;
  onScrollEnd?: () => void;
  onScrollStart?: () => void;
  onScroll?: () => void;
  onLoaded?: (simpleBar: SimpleBar) => void;
  paddingRight?: number;
}

export const Scroller = ({
  children,
  autoHide,
  hasLoadMore,
  hasStartLoadMore,
  scrollPosition,
  scrollLength,
  onScrollEnd,
  onScrollStart,
  onScroll,
  onLoaded,
  ...rest
}: ScrollerProps) => {
  const simpleBarRef = useRef<HTMLDivElement>(null);
  const childrenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let simpleBar: SimpleBar;
    const scrollHandler = (event: Event) => {
      const { scrollHeight, scrollTop, clientHeight } =
        event.target as HTMLDivElement;
      const isBottomReached =
        scrollHeight - Math.round(scrollTop) <= clientHeight;

      if (isBottomReached) {
        onScrollEnd?.();
      }

      if (scrollTop === 0) {
        onScrollStart?.();
      }

      onScroll?.();
    };

    if (simpleBarRef.current) {
      simpleBar = new SimpleBar(simpleBarRef.current as HTMLElement, {
        autoHide: autoHide || false,
      });

      if (scrollPosition === "bottom") {
        if (scrollLength) {
          const scrollInterval = setInterval(() => {
            const scrollHeight = simpleBar.getScrollElement()?.scrollHeight;

            if (
              childrenRef.current?.querySelectorAll(".message").length ===
              scrollLength
            ) {
              simpleBar.getScrollElement()?.scrollTo({
                behavior: "auto",
                top: scrollHeight,
              });
              clearInterval(scrollInterval);
            }
          }, 1000);
        } else {
          const scrollHeight = simpleBar.getScrollElement()?.scrollHeight;

          simpleBar.getScrollElement()?.scrollTo({
            behavior: "auto",
            top: scrollHeight,
          });
        }
      }

      simpleBar
        ?.getScrollElement?.()
        ?.addEventListener("scroll", scrollHandler);
      onLoaded?.(simpleBar);
    }

    return () => {
      if (simpleBar) {
        simpleBar
          ?.getScrollElement?.()
          ?.removeEventListener("scroll", scrollHandler);
      }
    };
  }, [simpleBarRef.current, onScrollEnd]);

  return (
    <div
      className={`${rest?.height ? `max-h-[${rest?.height}]` : "max-h-auto"} ${rest?.width ? `w-[${rest?.width}]` : "w-auto"} ${rest?.width ? `min-w-[${rest?.width}]` : "min-w-auto"} ${rest?.direction === "horizontal" ? "overflow-x-auto" : "overflow-x-hidden"} ${rest?.direction === "horizontal" ? "overflow-y-hidden" : "overflow-y-auto"} ${rest?.noScrollPadding ? "pr-0" : "pr-[16px]"} h-full`}
    >
      <style>{`
        .simplebar-track.simplebar-vertical .simplebar-scrollbar:before {
          opacity: 1;
          background-color: var(--a-divider, #d8d8d8);
          border-radius: 2px;
          width: 4px;
          margin-left: 3px;
        }
        .simplebar-scrollbar {
          min-height: 0;
        }
        .simplebar-placeholder {
          width: auto !important;
        }
      `}</style>
      <div
        style={{
          height: "100%",
        }}
      >
        <div
          ref={simpleBarRef}
          style={{
            maxHeight: rest.height,
            paddingRight: rest?.paddingRight,
          }}
        >
          <div
            className={`h-[ ${hasStartLoadMore ? "50" : "0"}] flex items-center visible overflow-hidden`}
          >
            <Spinner />
          </div>
          <div ref={childrenRef}>{children}</div>
          <div
            className={`h-[ ${hasLoadMore ? "50" : "0"}] flex items-center visible overflow-hidden`}
          >
            <Spinner />
          </div>
        </div>
      </div>
    </div>
  );
};
