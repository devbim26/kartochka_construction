import { RefObject, useEffect } from 'react';

/**
 * @name `useOutsideClick`
 *
 * @description A hook that works out the callback after the `click` event, which is performed outside of some elements.
 *
 * @param containerRef - Ref to parent container. If omitted, `document` is used.
 * @param callback - The callback that will be called (Use useCallback to memoize).
 * @param refs - Array of RefObjects to target elements.
 *
 * @example
 * const div1 = useRef();
 *
 * useOutsideClick(()=> {
 *  console.log(`click outside from ${div1.current}`)
 * }, [div1])
 *
 * return (
 *    <div className="someDiv" ref={div1}>
 *       some div
 *    </div>
 * );
 */

export const useOutsideClick = (
	callback: () => void,
	refs: Array<RefObject<HTMLElement> | null> = [],
	containerRef?: RefObject<HTMLElement> | null,
) => {
	useEffect(() => {
		const handleClickOutside: EventListener = (event) => {
			const mouseEvent = event as MouseEvent;
			if (!refs.some((ref) => ref?.current?.contains(mouseEvent.target as Node))) {
				callback();
			}
		};
		const parentContainer: Document | HTMLElement =
			containerRef && containerRef.current ? containerRef.current : document;
		parentContainer.addEventListener('mousedown', handleClickOutside);
		return () => {
			parentContainer.removeEventListener('mousedown', handleClickOutside);
		};
	}, [callback, refs, containerRef]);
};
