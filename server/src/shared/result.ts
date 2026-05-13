export type Success<T> = { readonly ok: true; readonly value: T };
export type Failure<E> = { readonly ok: false; readonly error: E };
export type Result<T, E> = Success<T> | Failure<E>;

export function ok<T>(value: T): Success<T> {
  return { ok: true, value };
}

export function fail<E>(error: E): Failure<E> {
  return { ok: false, error };
}

export function isOk<T, E>(r: Result<T, E>): r is Success<T> {
  return r.ok;
}

export function isFail<T, E>(r: Result<T, E>): r is Failure<E> {
  return !r.ok;
}
