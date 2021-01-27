import {useCallback, useEffect, useRef, useState} from "react";

export function useScroll() {
    const [scrollTop, setScrollTop] = useState(0);
    const ref = useRef() as any;
    const animationFrame = useRef<any>();

    const onScroll = useCallback<(e: any) => void>((e: any) => {
        if (animationFrame.current) {
            cancelAnimationFrame(animationFrame.current);
        }
        animationFrame.current = requestAnimationFrame(() => {
            setScrollTop(e.target.scrollTop);
        });
    }, []);

    useEffect(() => {
        const container = ref.current;
        setScrollTop(container.scrollTop);
        container.addEventListener("scroll", onScroll);

        return () => container.removeEventListener("scroll", onScroll);
    }, []);

    return [scrollTop, ref];
}