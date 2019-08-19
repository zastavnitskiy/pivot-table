import React, { useRef, useEffect, useState } from "react";
import styles from "./StickyTH.module.css";
/**
 *
 * Table Component — it's responsible for rendering the table headers and values,
 * grouping headers, etc.
 *
 * It needs some refactoring, if I will have time I will do that.
 *
 * For now, the code is a bit complex and has comments.
 *
 */
interface StickyTHProps
  extends React.TdHTMLAttributes<HTMLTableDataCellElement> {}

export const StickyTH: React.FC<StickyTHProps> = props => {
  const ref = useRef<HTMLTableDataCellElement>(null);
  const [left, setLeft] = useState<number | string>("auto");

  // todo not handing any layout changes,
  // however, if we will change dencity of the table, we might need to
  // recalculate styles.
  useEffect(() => {
    const left = ref.current && ref.current.offsetLeft;
    typeof left === "number" && setLeft(left);
  }, [ref]);

  const { className = "", style = {}, ...passThroughProps } = props;
  return (
    <th
      ref={ref}
      className={[className, styles.element].join(" ")}
      style={{
        ...style,
        ...{
          left: left === "auto" ? left : left + "px"
        }
      }}
      {...passThroughProps}
    ></th>
  );
};
