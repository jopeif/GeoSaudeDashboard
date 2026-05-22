import { useEffect, useRef, useState } from "react";
import { Info } from "lucide-react";

import "./InfoTooltip.css";

type InfoTooltipProps = {
  text: string;
};

export const InfoTooltip = ({
  text
}: InfoTooltipProps) => {
  const [open, setOpen] =
    useState(false);

  const tooltipRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <div
      className="info-tooltip"
      ref={tooltipRef}
    >
      <button
        type="button"
        className="info-tooltip-button"
        onClick={() =>
          setOpen(!open)
        }
      >
        <Info size={16} />
      </button>

      {open && (
        <div className="info-tooltip-box">
          <p>{text}</p>
        </div>
      )}
    </div>
  );
};