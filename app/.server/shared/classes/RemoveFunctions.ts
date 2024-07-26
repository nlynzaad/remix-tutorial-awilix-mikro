type NonFunctionProperties<T extends object> = {
	// eslint-disable-next-line @typescript-eslint/ban-types
	[K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

export type RemoveFunctions<T extends object> = Pick<T, NonFunctionProperties<T>>
