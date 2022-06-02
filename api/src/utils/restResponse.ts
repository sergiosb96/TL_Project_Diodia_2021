import {Response} from "express";
import {getCsvStringFromJson} from "./csvConverter";

export enum ResponseBodyFormat {
    JSON = "json",
    CSV = "csv"
}

/**
 * Return a valid rest response format. Either csv or json
 * @param format
 */
export const getResponseBodyFormat = (format: any): ResponseBodyFormat => {
    switch (format) {
        case ResponseBodyFormat.CSV:
            return ResponseBodyFormat.CSV;
        case ResponseBodyFormat.JSON:
        default:
            return ResponseBodyFormat.JSON /* Default value */;
    }
}

/**
 * The response status
 */
export enum ResponseStatus {
    SUCCESS = 200,
    BAD_REQUEST = 400,
    NOT_AUTHORIZED = 401,
    NO_DATA = 402,
    SERVER_ERROR = 500
}

/**
 * This class manages a rest response
 */
export class RestResponse {
    public static success = (res: Response, {
        description,
        body,
        format,
        authInfo
    }: { description?: string, body?: any, format?: ResponseBodyFormat, authInfo?: string } = {}): Response => {
        try {
            if (format === ResponseBodyFormat.CSV) {
                let csv = ''
                if (body) {
                    csv = getCsvStringFromJson(body);
                } else {
                    csv = "status,message,description\n"
                        + 'OK,' + RestResponse.messages.get(ResponseStatus.SUCCESS) + ',' + (description ?? '');
                }

                return res.status(ResponseStatus.SUCCESS).send(csv);
            } else/* if (format === ResponseBodyFormat.JSON) */{
                return res.status(ResponseStatus.SUCCESS).json({
                    status: 'OK',
                    authInfo: authInfo,
                    message: RestResponse.messages.get(ResponseStatus.SUCCESS),
                    description: description,
                    data: body
                });
            }
        } catch (err) {
            console.error(err);
            return RestResponse.fail(res, ResponseStatus.SERVER_ERROR, err);
        }
    }

    public static fail = (res: Response, status: ResponseStatus, error?: any): Response => {
        return res.status(status).json({
            status: 'Failed',
            message: RestResponse.messages.get(status),
            error: error
        });
    }

    // List with response messages
    private static messages: Map<ResponseStatus, string> = new Map<ResponseStatus, string>([
        [ResponseStatus.SUCCESS, "Success"],
        [ResponseStatus.BAD_REQUEST, "Bad request"],
        [ResponseStatus.NOT_AUTHORIZED, "Not authorized"],
        [ResponseStatus.NO_DATA, "No data"],
        [ResponseStatus.SERVER_ERROR, "Server error"]
    ]);
}
