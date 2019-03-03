import { parseValidityFromCustomFormats } from './validityParser';
import { logger } from './logger';

export function toClosuresFromHighways(geoJsonData: any) {
    let result: any[] = []
    let features = toFeatures(geoJsonData)
    if (features) {
        logger.info(`D - Parsing ${features.length} items`)
        result = features
            .filter(hasCommonRequiredFields)
            .map((item: any) => {
                return {
                    type: 'D',
                    coordinates: toCoordinates(item),
                    validFrom: new Date(item.properties.ValidFrom),
                    validTo: new Date(item.properties.ValidTo),
                    description: item.properties.Description
                }
            })
    } else {
        logger.warn('Given data were not resolved as features containing geojson.');
    }
    return result
}

export function toClosuresFromRoads1(geoJsonData: any) {
    let result: any[] = []
    let features = toFeatures(geoJsonData)
    if (features) {
        logger.info(`Roads1 - Parsing ${features.length} items`)
        result = features
            .filter(hasCommonRequiredFields)
            .map((item: any) => {
                return {
                    type: 'R1',
                    coordinates: toCoordinates(item),
                    validFrom: new Date(item.properties.ValidFrom),
                    validTo: new Date(item.properties.ValidTo),
                    description: item.properties.Description
                }
            })
    } else {
        logger.warn('Given data were not resolved as features containing geojson.');
    }
    return result
}

export function toClosuresFromRoads23(geoJsonData: any) {
    let result: any[] = []
    let features = toFeatures(geoJsonData)
    if (features) {
        logger.info(`Roads23 - Parsing ${features.length} items`)
        result = features
            .filter(hasR23RequiredFields)
            .map((item: any) => {
                let validity = parseValidityFromCustomFormats(item)
                return {
                    type: 'R23',
                    coordinates: toCoordinates(item),
                    validFrom: validity.from,
                    validTo: validity.to,
                    description: `${item.properties.POPIS} ${item.properties.NAZEV}`
                }
            })
    }
    return result
}

function toCoordinates(item: any) {
    let res = [[]];
    if (item.geometry.type === 'LineString') {
        res = [item.geometry.coordinates.map((coord: any) => {
            return {
                lat: coord[1],
                lng: coord[0]
            }
        })]
    } else if (item.geometry.type === 'MultiLineString') {
        res = item.geometry.coordinates.map((coords: any) => {
            return coords.map((coord: any) => {
                return {
                    lat: coord[1],
                    lng: coord[0]
                }
            })
        })
    }
    return res;
}

function hasCommonRequiredFields(item: any) {
    let res = true
    if (item.geometry) {
        let validGeometryType = item.geometry.type && (item.geometry.type === 'LineString' || item.geometry.type === 'MultiLineString')
        let validGeometryCoordinates = item.geometry.coordinates && item.geometry.coordinates && item.geometry.coordinates.length && item.geometry.coordinates.length > 1
        res = validGeometryType && validGeometryCoordinates
    } else {
        res = false
    }
    if (res && item.properties) {
        res = item.properties.Description && item.properties.ValidTo && item.properties.ValidFrom
    } else {
        res = false
    }
    if (!res) {
        logger.error(`Invalid road item. JSON: ${JSON.stringify(item)}`)
    }
    return res
}

function hasR23RequiredFields(item: any) {
    let res = true
    if (item.geometry) {
        let validGeometryType = item.geometry.type && (item.geometry.type === 'LineString' || item.geometry.type === 'MultiLineString')
        let validGeometryCoordinates = item.geometry.coordinates && item.geometry.coordinates && item.geometry.coordinates.length && item.geometry.coordinates.length > 1
        res = validGeometryType && validGeometryCoordinates
    } else {
        res = false
    }
    if (res && item.properties && item.properties.POPIS === null && item.properties.NAZEV === null) {
        res = false
    }
    if (!res) {
        logger.error(`Invalid road 23 item. JSON: ${JSON.stringify(item)}`)
    }
    return res
}

function toFeatures(geoJsonData: any): any[] {
    if (geoJsonData && geoJsonData.features && geoJsonData.features.map) {
        return geoJsonData.features as any[];
    } else if (geoJsonData && geoJsonData.map && geoJsonData.length) {
        return geoJsonData as any[];
    } else {
        return [];
    }
}
