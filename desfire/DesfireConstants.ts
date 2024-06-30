export enum DESFIRE_STATUS {
    SUCCESS = 0x00,
    ADDITIONAL_FRAME = 0xAF,
    COMMAND_ABORTED = 0xCA,
    INTEGRITY_ERROR = 0x1E,
    LENGTH_ERROR = 0x7E,
    PARAMETER_ERROR = 0x9E,
    PERMISSION_DENIED = 0x9D,
    AUTHENTICATION_ERROR = 0xAE,
    DUPLICATE_ERROR = 0xDE,
    OUT_OF_MEMORY = 0x0E,
    MEMORY_ERROR = 0xEE,
};

export enum DESFIRE_INS {
    ADDITIONAL_FRAME = 0xAF,
    COMMIT = 0xC7,
    CREDIT = 0x0C,
    DEBIT = 0xDC,
    GET_VALUE = 0x6C,
    AUTH_AES = 0xAA,
    AUTH_LEGACY = 0x0A,
    AUTH_EV2_FIRST = 0x71,
    SELECT_APPLICATION = 0x5A,
    CREATE_APPLICATION = 0xCA,
    FORMAT = 0xFC,

    // Create Files Instructions
    CREATE_VALUE_FILE = 0xCC,
    CREATE_STANDARD_FILE = 0xCD,
    CREATE_BACKUP_FILE = 0xCB,
    CREATE_CYCLIC_FILE = 0xC0,
    CREATE_LINEAR_FILE = 0xC1,

    GET_UID = 0x60,
    CHANGE_KEY = 0xC4,
}

export enum DESFIRE_AUTH_TYPE {
    AES = "AES",
    DES = "DES",
}

/**
 * The value of each mode is in binary, presented in String
 */
export enum DESFIRE_COMM_MODE {
    PLAIN = '00',
    MAC = '01',
    FULL = '11',
}

// export type DesfireCommMode = typeof DESFIRE_COMM_MODE[keyof typeof DESFIRE_COMM_MODE];