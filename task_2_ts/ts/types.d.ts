// Array<> is unnecessary, simply use below
export type CSVRecord = Record<string, unknown>;

export type CSV_Data = CSVRecord[];

export interface PersistanceConfigEntry {
    'sorted': string;
    'active': string;
}

export interface PersistanceConfig {
    [filename: `${ string }-${ number }`]: PersistanceConfigEntry
}
