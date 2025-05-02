declare module '*.gif' {
	const src: string;
	export default src;
}

declare module '*.svg' {
	const content: any;
	export default content;
}

declare module '*.png' {
	const contentPng: any;
	export default contentPng;
}
