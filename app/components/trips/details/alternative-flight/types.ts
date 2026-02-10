export type Airport = {
    code: string;
    time: string;
};

export type DatesVal = {
    from: Airport;
    to: Airport;
};

export type Block = {
    kind: string;
    name: string;
    val: string | DatesVal;
    weekDay?: string;
};

type Choices = {
    airline?: string;
    blocks: Block[];
    price?: string;
    type: string;
    value: number;
};

export type AlternativeFlightsData = {
    choices: Choices[];
    selected: number;
};
