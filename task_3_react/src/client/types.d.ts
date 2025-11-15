export type CSVRecord = Record<string, unknown>;

export type CSV_Data = CSVRecord[];

// InfoCard receives this via props
export type fileInfo = {
    filename: string;
    filetype: string;
    filesize: string;
    rowcount: number;
}
