import type { RefObject } from 'react';
import { useEffect } from 'react';

interface IScrollOptions {
	block?: 'start' | 'center' | 'end' | 'nearest';
	inline?: 'start' | 'center' | 'end' | 'nearest';
	behavior?: 'smooth' | 'auto';
}

/**
 * @name `useAutoScroll`
 *
 * @description A hook that scrolls to the selected list item when the list shows.
 *
 * @param containerRef - Ref to the list container.
 * @param show - Flag (true/false) that shows or hides the list.
 * @param selectedID - ID of the selected item (`selectedId` === attribute `id` on the list item).
 * @param scrollOptions - Default `scrollIntoViewOptions`.
 *
 * @interface `IScrollOptions`
 * @property {'start' | 'center' | 'end' | 'nearest'} [block = 'start'] - vertical scroll
 * @property {'start' | 'center' | 'end' | 'nearest'} [inline = 'nearest'] - horizontal scroll
 * @property {'smooth' | 'instant' | 'auto'} [behavior = 'smooth']
 *
 * @example
 * const div1 = useRef();
 * const [selected1, setSelected1] = useState("");
 * const [show1, setShow1] = useState(false);
 *
 * useAutoScroll(
 *   containerRef: div1,
 *   show: show1,
 *   selectedID: selected1
 * )
 *
 * return (
 *   <>
 *     {show1 && (
 *       <div className="someDiv" ref={div1}>
 *         {arr.map((item) => (
 *           <p
 *             key={item.id}
 *             id={item.id}
 *             style={{ color: selected1 === item.id ? "red" : "" }}
 *             onClick={() => setSelected1(item.id)}
 *           >
 *             {item.id} div1
 *           </p>
 *         ))}
 *       </div>
 *     )}
 *   </>
 * );
 */

export const useAutoScroll = (
	containerRef: RefObject<HTMLElement> | null,
	show: boolean,
	selectedID: string,
	scrollOptions: IScrollOptions = {
		block: 'start',
		inline: 'nearest',
		behavior: 'smooth',
	},
) => {
	useEffect(() => {
		show &&
			containerRef &&
			containerRef?.current
				?.querySelector(`[id="${selectedID}"]`)
				?.scrollIntoView({ ...scrollOptions });
	}, [show]);
};
