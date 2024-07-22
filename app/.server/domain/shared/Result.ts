import type {ValidationError} from "~/.server/domain/shared/ValidationError";

export type Result<T> = T & {error?: never} | {error: ValidationError}

export type UpdateResult = true | {error: ValidationError}
