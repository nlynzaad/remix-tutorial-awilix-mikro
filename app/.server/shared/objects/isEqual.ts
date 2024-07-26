import {isEqual as rIsEqual} from "radash";

export const isEqual = (value: unknown, other: unknown): boolean => {
	return rIsEqual(value, other)
}
