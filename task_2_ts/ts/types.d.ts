// Array<> is unnecessary, simply use below
export type CSVRecord = Record<string, unknown>;

export type CSV_Data = CSVRecord[];

export interface PersistanceConfigEntry {
    'sorted': string;
    'active': string;
    'ascending': boolean;
}

export interface PersistanceConfig {
    [filename: `${ string }-${ string }`]: PersistanceConfigEntry
}
