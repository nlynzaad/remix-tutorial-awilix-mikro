import type {ValidationError} from "@domain/shared/ValidationError";

export type Result<T> = T & { error?: never } | {error: ValidationError, T?: never}

export type UpdateResult = true | {error: ValidationError}
