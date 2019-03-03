export function isDefined(...checkedArgs: any[]): boolean {
    return checkedArgs.filter(arg => arg === undefined).length === 0
}

export function isDateIn(checked: Date, rangeStart: Date, rangeEnd: Date): boolean {
    return checked.getTime() >= rangeStart.getTime() && checked.getTime() <= rangeEnd.getTime()
}