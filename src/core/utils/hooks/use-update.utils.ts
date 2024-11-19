import { useEffect, useRef } from 'react';

/**
 * @name `useComponentUpdate`
 *
 * @description A hook that works out the callback after component update event (not mount, only on change events).
 *
 * @param callback - The callback that will be called (Use useCallback to memoize).
 * @param deps - Data dependencies.
 *
 * @example
 * const [updateDate, setUpdateDate] = useState(Date.now());
 * const [value, setValue] = useState<string>("");
 *
 * useComponentUpdate(()=>{
 *  console.log(`component updated);
 * },[updateDate]);
 *
 * return (
 *    <div>
 *       <input value={value} onChange={(e: any) => {
 *          setValue(e.target.value);
 *          setUpdateDate(Date.now());
 *       }}/>
 *    </div>
 * );
 */

export const useComponentUpdate = (callback: () => void, deps: React.DependencyList = []) => {
	const wasMountRef = useRef<boolean>(false);
	useEffect(() => {
		if (wasMountRef.current) {
			callback();
		} else {
			wasMountRef.current = true;
		}
	}, deps);
};
