import React, {memo, useMemo} from "react";
import {useScroll} from "../hooks/useScroll";

export type VirtualScrollProps = {
    Item: any;
    itemCount: number;
    height: number; //container height
    getChildHeight: (index: number) => number;
    renderAheadCount?: number;
}

export function VirtualScroll({Item, itemCount, height, getChildHeight, renderAheadCount = 10}: VirtualScrollProps){
    const childPositions = useMemo(() => {
        let results = [0];
        for (let i = 1; i < itemCount; i++) {
            results.push(results[i - 1] + getChildHeight(i - 1));
        }
        return results;
    }, [getChildHeight, itemCount]);

    const [scrollTop, ref] = useScroll();

    const lastChildIndex = itemCount - 1;
    const totalHeight = childPositions[lastChildIndex] + getChildHeight(lastChildIndex);

    const firstVisibleNode = useMemo(
        () => findStartNode(scrollTop, childPositions, itemCount),
        [scrollTop, childPositions, itemCount]
    );

    const lastVisibleNode = useMemo(
        () => findEndNode(childPositions, firstVisibleNode, itemCount, height),
        [childPositions, firstVisibleNode, itemCount, height]
    );

    const startNode = Math.max(0, firstVisibleNode - renderAheadCount);
    const endNode = Math.min(itemCount - 1, lastVisibleNode + renderAheadCount);

    const visibleNodeCount = endNode - startNode + 1;
    const offsetY = childPositions[startNode];

    //provide key
    const visibleChildren = useMemo(
        () =>
            new Array(visibleNodeCount)
                .fill(null)
                .map((_, index: number) => (
                    <Item key={index + startNode} index={index + startNode} />
                )),
        [startNode, visibleNodeCount, Item]
    );

    return (
        <div style={{ height, overflow: "auto" }} ref={ref}>
            <div
                className="viewport"
                style={{
                    overflow: "hidden",
                    willChange: "transform",
                    height: totalHeight,
                    position: "relative"
                }}
            >
                <div
                    style={{
                        willChange: "transform",
                        transform: `translateY(${offsetY}px)`
                    }}
                >
                    {visibleChildren}
                </div>
            </div>
        </div>
    );
}

// binary search into separate function
function findStartNode(upperPosition: number, childPositions: number[], itemCount: number) {
    let startRange = 0;
    let endRange = itemCount - 1;
    while (endRange !== startRange) {
        const middle = Math.floor((endRange - startRange) / 2 + startRange);

        if (
            childPositions[middle] <= upperPosition &&
            childPositions[middle + 1] > upperPosition
        ) {
            return middle;
        }

        if (middle === startRange) {
            return endRange;
        } else {
            if (childPositions[middle] <= upperPosition) {
                startRange = middle;
            } else {
                endRange = middle;
            }
        }
    }
    return itemCount;
}

function findEndNode(childPositions: number[], startNode: number, itemCount: number, height: number) {
    let endNode;
    for (endNode = startNode; endNode < itemCount; endNode++) {
        if (childPositions[endNode] > childPositions[startNode] + height) {
            return endNode;
        }
    }
    return endNode;
}

export default memo(VirtualScroll);
