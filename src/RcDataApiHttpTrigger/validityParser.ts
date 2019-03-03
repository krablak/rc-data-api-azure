import { logger } from './logger'

const MIN_DATE = new Date('2017')
const MAX_DATE = new Date('2050')

/**
 * Result of validity parsing.
 */
export interface Validity {
    from: Date
    to: Date
}

/**
 * Parses item validity from JSON object.
 * @param closureItem data source item represting single closure.
 */
export function parseValidityFromCustomFormats(closureItem: any): Validity {
    let res = { from: new Date(MIN_DATE), to: new Date(MAX_DATE) }
    if (closureItem.properties) {
        if (hasFromToFormat(closureItem)) {
            res = parseFromToFormat(closureItem)
        } else {
            if (closureItem.properties.ZAC_OMEZ) {
                res.from = parseCustomDate(closureItem.properties.ZAC_OMEZ)
            }
            if (closureItem.properties.KON_OMEZ) {
                res.to = parseCustomDate(closureItem.properties.KON_OMEZ)
            }
            if (closureItem.properties.ZAC_OMEZ === undefined && closureItem.properties.KON_OMEZ) {
                logger.warning(`Cannot parse validity, default validity will be used. Start and and of resctriction validity is not defined. JSON: ${JSON.stringify(closureItem)}`)
            }
        }
    } else {
        logger.error(`Cannot parse validity, default validity will be used. Closure item JSON has not section 'properties'. JSON: ${JSON.stringify(closureItem)}`)
    }
    return res
}

function parseCustomDate(dateStr: string): Date {
    let resDate = new Date(0)
    if (dateStr.indexOf('/') !== -1) {
        let parts = dateStr.split('/')
        try {
            let monthStr = parts[0]
            if (monthStr.indexOf('-') !== -1) {
                let monthParts = dateStr.split('-')
                monthStr = monthParts[0].trim()
            }
            let yearStr = parts[1]
            yearStr = yearStr.length === 2 ? `20${yearStr}` : yearStr
            resDate.setMonth(+monthStr - 1)
            resDate.setFullYear(+yearStr)
        } catch (e) {
            console.error(e)
        }
    } else if (dateStr.indexOf('.') !== -1) {
        let parts = dateStr.split('.')
        try {
            let dayStr = parts[0]
            let monthStr = parts[1]
            let yearStr = parts[2]
            resDate.setDate(+dayStr)
            resDate.setMonth(+monthStr - 1)
            resDate.setFullYear(+yearStr)
        } catch (e) {
            console.error(e)
        }
    }
    return resDate
}


/**
 * Returns true when item contains from/to in single field in format "M - M/YYYY"
 * @param item data item.
 */
function hasFromToFormat(item: any): boolean {
    let res = false;
    if (item.properties.ZAC_OMEZ && item.properties.KON_OMEZ === undefined) {
        let dateStr = item.properties.ZAC_OMEZ;
        res = dateStr.indexOf('/') !== -1 && dateStr.split('/')[0].indexOf('-') !== -1
    }
    return res
}

function parseFromToFormat(item: any): Validity {
    let res = { from: new Date(MIN_DATE), to: new Date(MAX_DATE) }
    let dateStr = item.properties.ZAC_OMEZ
    if (dateStr && dateStr.indexOf('/') !== -1) {
        let parts = dateStr.split('/')
        // Year
        let yearStr = parts[1]
        yearStr = yearStr.length === 2 ? `20${yearStr}` : yearStr
        // From month
        try {
            let fromMonthStrPart = parts[0]
            if (fromMonthStrPart.indexOf('-') !== -1) {
                let fromMonthStr = dateStr.split('-')[0].trim()
                // First day of month
                res.from = new Date(yearStr, +fromMonthStr - 1, 1)
            }
        } catch (e) {
            console.error(e)
        }
        // To month
        try {
            let toMonthStrPart = parts[0]
            if (toMonthStrPart.indexOf('-')) {
                let toMonthStr = toMonthStrPart.trim().split('-')[1].trim()
                // Last day of month
                res.to = new Date((new Date(+yearStr, +toMonthStr, 1) as any - 1))
                console.log(`res.to: ${res.to}`)
            }
        } catch (e) {
            console.error(e)
        }
    }
    return res
}
