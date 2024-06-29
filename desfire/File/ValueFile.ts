import { DESFIRE_COMM_MODE } from "../DesfireConstants";
import DesfireFile from "./DesfireFile";
import DesfireFileBuilder from "./DesfireFileBuilder";

class ValueFile extends DesfireFile {
    private lowerLimit: number;
    private upperLimit: number;
    private value: number;
    private limitedCreditEnabled: boolean;
    private freeGetValue: boolean;

    constructor(
        fileNumber: number,
        readAccess: boolean,
        writeAccess: boolean,
        readWriteAccess: boolean,
        changeAccess: boolean,
        communicationMode: DESFIRE_COMM_MODE,
        rfuBinary: string,
        additionalAccessRights: string,
        lowerLimit: number,
        upperLimit: number,
        value: number,
        limitedCreditEnabled: boolean,
        freeGetValue: boolean
    ) {
        super(fileNumber, readAccess, writeAccess, readWriteAccess, changeAccess, communicationMode, rfuBinary, additionalAccessRights);
        this.lowerLimit = lowerLimit;
        this.upperLimit = upperLimit;
        this.value = value;
        this.limitedCreditEnabled = limitedCreditEnabled;
        this.freeGetValue = freeGetValue;
    }

    public getLowerLimit(): number {
        return this.lowerLimit;
    }

    public getUpperLimit(): number {
        return this.upperLimit;
    }

    public getValue(): number {
        return this.value;
    }

    public isLimitedCreditEnabled(): boolean {
        return this.limitedCreditEnabled;
    }

    public isFreeGetValue(): boolean {
        return this.freeGetValue;
    }
    
    public getFileDetails() {
        
    }
}

class ValueFileBuilder extends DesfireFileBuilder<ValueFile, ValueFileBuilder> {
    private lowerLimit: number = 0;
    private upperLimit: number = 0;
    private value: number = 0;
    private limitedCreditEnabled: boolean = false;
    private freeGetValue: boolean = false;

    public withLowerLimit(lowerLimit: number): ValueFileBuilder {
        this.lowerLimit = lowerLimit;
        return this;
    }

    public withUpperLimit(upperLimit: number): ValueFileBuilder {
        this.upperLimit = upperLimit;
        return this;
    }

    public withValue(value: number): ValueFileBuilder {
        this.value = value;
        return this;
    }

    public withLimitedCreditEnabled(limitedCreditEnabled: boolean): ValueFileBuilder {
        this.limitedCreditEnabled = limitedCreditEnabled;
        return this;
    }

    public withFreeGetValue(freeGetValue: boolean): ValueFileBuilder {
        this.freeGetValue = freeGetValue;
        return this;
    }

    public build(): ValueFile {
        return new ValueFile(
            this.fileNumber,
            this.readAccess,
            this.writeAccess,
            this.readWriteAccess,
            this.changeAccess,
            this.communicationMode,
            this.rfuBinary,
            this.additionalAccessRights,
            this.lowerLimit,
            this.upperLimit,
            this.value,
            this.limitedCreditEnabled,
            this.freeGetValue
        );
    }
}

export { ValueFile, ValueFileBuilder };