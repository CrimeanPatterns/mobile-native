import _ from 'lodash';

import API from './api';

type FlightClass = {
    global: string;
    regional: string;
};

export type MileValueResponse = {
    title: string;
    data: {
        name: string;
        value: {
            primary: string;
            secondary: string;
        };
        custom: boolean;
        flightClass: {
            economy: FlightClass;
            business: FlightClass;
        };
        id: number;
    }[];
}[];

type ResponseData = {
    success: boolean;
};

async function getMileValue(): Promise<MileValueResponse | null> {
    const response = await API.post<MileValueResponse>(`/mile-value/data`);
    const {data} = response;

    if (_.isObject(data)) {
        return data;
    }

    return null;
}

async function addMileValue({id, value}: {id: string; value: string}): Promise<boolean> {
    const response = await API.post<ResponseData>(`/mile-value/${id}`, {value});
    const {data} = response;

    if (_.isObject(data)) {
        const {success} = data;

        return success;
    }

    return false;
}

async function editMileValue({id, value}: {id: string; value: string}): Promise<boolean> {
    const response = await API.post<ResponseData>(`/mile-value/${id}`, {value});
    const {data} = response;

    if (_.isObject(data)) {
        const {success} = data;

        return success;
    }

    return false;
}

async function deleteMileValue({id}: {id: number}): Promise<boolean> {
    const response = await API.delete<ResponseData>(`/mile-value/${id}`);
    const {data} = response;

    if (_.isObject(data)) {
        const {success} = data;

        return success;
    }

    return false;
}

export {getMileValue, addMileValue, editMileValue, deleteMileValue};
