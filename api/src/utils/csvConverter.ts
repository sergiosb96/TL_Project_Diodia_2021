/*
This file includes functions which concern the convert json object to csv
 */

/**
 * This function returns a csv string from a json object
 * @param obj
 */
export const getCsvStringFromJson = (obj: any) => {
    const columns = makeArrayToString(findColumnsFromJson(obj));

    const rows = findRowsFromJson(obj);

    let returnString = columns + '\n';

    rows.forEach((row) => returnString += row + '\n');

    return returnString;
}

/**
 * This function find and returns the csv columns from a json
 * @param jsonObj
 */
const findColumnsFromJson = (jsonObj: any): string[] => {
    const columns: string[] = []
    if (typeof jsonObj === 'object') {
        for (const [key, value] of Object.entries(jsonObj)) {
            if (!Array.isArray(jsonObj[key]) && typeof jsonObj[key] !== 'object') {
                columns.push(key);
            }
        }
        for (const [key, value] of Object.entries(jsonObj)) {
            if (Array.isArray(jsonObj[key])) {
                const list: any[] = (jsonObj[key] as []);
                if (list.length > 0) {
                    findColumnsFromJson(list[0]).forEach((item) => columns.push(item));
                }
            } else if (typeof jsonObj[key] === 'object') {
                findColumnsFromJson(jsonObj[key]).forEach((item) => columns.push(item));
            }
        }
    }

    return columns;
}

/***
 * This function finds and returns the rows of csv from a json
 * @param jsonObj
 */
const findRowsFromJson = (jsonObj: any): string[] => {
    const rows: string[] = []
    if (typeof jsonObj === 'object') {
        let sameValues: any[] = [];
        for (const [key, value] of Object.entries(jsonObj)) {
            if (!Array.isArray(jsonObj[key]) && typeof jsonObj[key] !== 'object') {
                sameValues.push(value);
            }
        }
        let wroteSameValues = false;
        for (const [key, value] of Object.entries(jsonObj)) {
            if (Array.isArray(jsonObj[key])) {
                const list: any[] = (jsonObj[key] as []);
                for (let i = 0; i < list.length; i++) {
                    let newValues: any[] = [];
                    for (const [key, value] of Object.entries(list[i])) {
                        if (!Array.isArray(jsonObj[key]) && typeof jsonObj[key] !== 'object') {
                            newValues.push(value);
                        }
                    }
                    wroteSameValues = true;
                    rows.push(makeArrayToString([...sameValues, ...newValues]));
                }
            }
        }
        if (!wroteSameValues) {
            rows.push(makeArrayToString(sameValues));
        }
    }

    return rows;
}

/// Tools

/**
 * This function make an array to string
 * @param array
 */
const makeArrayToString = (array: string[]) => {
    let returnValue = '';

    if (array && array.length > 0) {
        returnValue += array[0];
        for (let i = 1; i < array.length; i++) {
            returnValue += ',' + array[i];
        }
    }

    return returnValue
}
