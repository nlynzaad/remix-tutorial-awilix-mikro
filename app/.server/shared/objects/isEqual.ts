import {isEqual as radashIsEqual} from "radash";

export const isEqual = (value: unknown, other: unknown): boolean => {
	return radashIsEqual(value, other)
}
