import moment from "moment";

/**
 * This function returns a date from date string (Either with format "YYYYMMDD" or ISO strings)
 * @param dateStr
 */
export const getDateFromParams = (dateStr: string): Date => {
    return moment(dateStr, "YYYYMMDD").utcOffset(0, true).toDate();
}
