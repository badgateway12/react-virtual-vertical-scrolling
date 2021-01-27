import {memo} from "react";

export type RowItemProps = {
    index: number;
}
export const RowItem = memo(({ index }: RowItemProps) => (
    <div
        style={{
            height: 30 + (index % 10),
            lineHeight: "30px",
            display: "flex",
            justifyContent: "space-between",
            padding: "0 10px"
        }}
        className="row"
        key={index}
    >
        Bla-bla-bla row index {index}
    </div>
));