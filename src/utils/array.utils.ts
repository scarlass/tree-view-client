
export function ArrayMove<T>(container: T[], from: int, to: int) {
    const arr = [...container];
    return arr.splice(from, 0, ...arr.splice(from, to));
}