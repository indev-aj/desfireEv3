import { DESFIRE_COMM_MODE } from "./DesfireConstants";
import { ValueFileBuilder } from "./File/ValueFile";

const valueFile = new ValueFileBuilder()
    .withFileNumber(1)
    .withReadAccess(true)
    .withWriteAccess(false)
    .withCommunicationMode(DESFIRE_COMM_MODE.PLAIN)
    .withLowerLimit(0)
    .withUpperLimit(1000)
    .withValue(500)
    .withLimitedCreditEnabled(true)
    .withFreeGetValue(false)
    .build();

console.log(valueFile);