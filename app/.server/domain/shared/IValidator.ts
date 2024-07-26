import { Result } from "./Result";

export type IValidator<T> = (value: unknown) => Result<T>;
