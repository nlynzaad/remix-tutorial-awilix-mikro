import { Result } from "./Result";

export type IValidator<T> = (value: T) => Result<T>;
