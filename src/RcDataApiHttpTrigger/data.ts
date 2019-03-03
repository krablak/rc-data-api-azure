import { Closure } from './index';
import { toClosuresFromHighways, toClosuresFromRoads1, toClosuresFromRoads23 } from './converters';
import { readAsJson, downloadAsJson, writeAsJson } from './ioUtils';
import { logger } from './logger';

export namespace Data {

    /**
     * Loads closures stored in local files in data directory.
     */
    export function loadFromLocalFiles(): Closure[] {
        logger.info(`Loading from local files`)
        let closuresData = [] as Closure[]
        // Highways
        closuresData = closuresData.concat(toClosuresFromHighways(readAsJson(__dirname, '../', 'data', 'highways-planned.geojson')))
        closuresData = closuresData.concat(toClosuresFromHighways(readAsJson(__dirname, '../', 'data', 'highways-current.geojson')))
        // R1
        closuresData = closuresData.concat(toClosuresFromRoads1(readAsJson(__dirname, '../', 'data', 'roads-current.geojson')))
        closuresData = closuresData.concat(toClosuresFromRoads1(readAsJson(__dirname, '../', 'data', 'roads-planned.geojson')))
        // R23
        closuresData = closuresData.concat(toClosuresFromRoads23(readAsJson(__dirname, '../', 'data', 'roads2and3-all.geojson')))
        logger.info(`Data from local files loaded with ${closuresData.length} items`)
        return closuresData;
    }

    /**
     * Reloads data from online esri dump and updates local files with data.
     */
    export function reloadFromEsriDump(): Promise<Closure[]> {
        logger.info('Starting new data reload from RSD ESRI server')
        return Promise.all([
            downloadAsJson('https://rc-escridump.azurewebsites.net/api/highways-planned')
                .then(json => writeAsJson(json, __dirname, '../', 'data', 'highways-planned.geojson'))
                .then(json => {
                    let closures = toClosuresFromHighways(json)
                    logger.info(`Parsed highways-planned: ${closures.length} items`)
                    return closures
                }),
            downloadAsJson('https://rc-escridump.azurewebsites.net/api/highways-current')
                .then(json => writeAsJson(json, __dirname, '../', 'data', 'highways-current.geojson'))
                .then(json => {
                    let closures = toClosuresFromHighways(json)
                    logger.info(`Parsed highways-current: ${closures.length} items`)
                    return closures
                }),
            downloadAsJson('https://rc-escridump.azurewebsites.net/api/roads-planned')
                .then(json => writeAsJson(json, __dirname, '../', 'data', 'roads-planned.geojson'))
                .then(json => {
                    let closures = toClosuresFromRoads1(json)
                    logger.info(`Parsed roads-planned: ${closures.length} items`)
                    return closures
                }),
            downloadAsJson('https://rc-escridump.azurewebsites.net/api/roads-current')
                .then(json => writeAsJson(json, __dirname, '../', 'data', 'roads-current.geojson'))
                .then(json => {
                    let closures = toClosuresFromRoads1(json)
                    logger.info(`Parsed roads-current: ${closures.length} items`)
                    return closures
                }),
            downloadAsJson('https://rc-escridump.azurewebsites.net/api/roads2and3-all')
                .then(json => writeAsJson(json, __dirname, '../', 'data', 'roads2and3-all.geojson'))
                .then(json => {
                    let closures = toClosuresFromRoads23(json)
                    logger.info(`Parsed roads2and3-all: ${closures.length} items`)
                    return closures
                })
        ]).then(allResultLists => {
            let closuresData = allResultLists.flat() as Closure[]
            logger.info(`New data downloaded with total of ${closuresData.length} items`)
            return closuresData
        });
    }



}