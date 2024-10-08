/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type { PropsWithChildren } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';

import {
    Colors,
    DebugInstructions,
    Header,
    LearnMoreLinks,
    ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
 
import NfcManager, {NfcTech} from 'react-native-nfc-manager';
import log from './utils/logger';
import DesfireEV3 from './desfire/DesfireEV3';
import { DESFIRE_AUTH_TYPE, DESFIRE_COMM_MODE } from './desfire/DesfireConstants';
import { ValueFileBuilder } from './desfire/File/ValueFile';

// Pre-step, call this before any NFC operations
NfcManager.start();
const desfire = new DesfireEV3();

async function readNdef() {
    console.log("Calling library")
    try {
        await NfcManager.requestTechnology(NfcTech.IsoDep);

        await desfire.selectApplication();
        await desfire.authenticate(0, DESFIRE_AUTH_TYPE.DES, "0000000000000000");
        await desfire.format();
        await desfire.createApplication();
        await desfire.selectApplication([0x12, 0x0, 0x0]);
        await desfire.authenticate(0, DESFIRE_AUTH_TYPE.AES, "00000000000000000000000000000000");
        
        // create value file
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

        await desfire.createValueFile(valueFile);

    } catch (e) {
        log.error('Oops!', e);
    } finally {
        NfcManager.cancelTechnologyRequest();
    }
}

type SectionProps = PropsWithChildren<{
    title: string;
}>;

function Section({ children, title }: SectionProps): React.JSX.Element {
    const isDarkMode = useColorScheme() === 'dark';
    return (
        <View style={styles.sectionContainer}>
            <Text
                style={[
                    styles.sectionTitle,
                    {
                        color: isDarkMode ? Colors.white : Colors.black,
                    },
                ]}>
                {title}
            </Text>
            <Text
                style={[
                    styles.sectionDescription,
                    {
                        color: isDarkMode ? Colors.light : Colors.dark,
                    },
                ]}>
                {children}
            </Text>
        </View>
    );
}

function App(): React.JSX.Element {
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    return (
        <SafeAreaView style={backgroundStyle}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={backgroundStyle.backgroundColor}
            />
            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                style={backgroundStyle}>
                <Header />
                <View
                    style={{
                        backgroundColor: isDarkMode ? Colors.black : Colors.white,
                    }}>
                    <Section title="Step One">
                        Edit <Text style={styles.highlight}>App.tsx</Text> to change this
                        screen and then come back to see your edits.
                    </Section>
                    <TouchableOpacity onPress={readNdef} style={styles.sectionContainer} >
                        <Text style={styles.sectionDescription}>Scan a Tag</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
    highlight: {
        fontWeight: '700',
    },
});

export default App;
