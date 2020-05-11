import React, { useState, useEffect } from 'react';
import {
    Layout,
    Text,
    Button,
    Input,
    Modal,
    Icon,
} from '@ui-kitten/components';
import { StyleSheet, Dimensions, ToastAndroid, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Share from 'react-native-share';
import Clipboard from '@react-native-community/clipboard';

import { getFromAsyncStorage } from '../actions/utils';

const styles = StyleSheet.create({
    layout: {
        padding: 25,
        flex: 1,
        width: Dimensions.get('window').width - 10,
    },
    pubKeyText: {
        flex: 19
    },
    textBold: {
        fontWeight: '500',
        color: '#fff',
        textAlign: 'center',
    },
    buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)',
        textAlign: 'center',
    },
    buttonTouchable: {
        padding: 40,
    },
    pubKeyLayout: {
        marginVertical: 20,
        backgroundColor: 'transparent'
    },
    displayCenter: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        flex: 1,
        borderWidth: 1,
        borderColor: "red",
        height: 25
    },
    cpLayout: {
        flex: 1,
        flexDirection: "row",
        width: "100%"
    }
});

const InputEyeIcon = (props) => (
    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
        <Icon {...props} name={!showPassword ? 'eye-off' : 'eye'} />
    </TouchableOpacity>
);

const PubKeyModal = ({ visible, setVisible, setError }) => {
    const [pubKey, setPubKey] = useState('');
    const [svg, setSvg] = useState('');
    // ComponentDidMount
    useEffect(() => {
        ToastAndroid.showWithGravity('Getting Public Key...', ToastAndroid.SHORT, ToastAndroid.BOTTOM);
        (async function () {
            const keystore = JSON.parse(await getFromAsyncStorage('keystore'));
            if (keystore) {
                setPubKey('0x' + keystore.address);
                setError('');
            } else {
                setError('Error getting Public Key for given keystore');
            }
        })();
    }, []);
    shareQR = () => {
        const title = 'Ethential Wallet address';
        svg.toDataURL(dataURL => {
            const options = Platform.select({
                default: {
                    title,
                    url: `data:image/png;base64,${dataURL}`,
                    subject: title,
                    message: `${pubKey}`,
                },
            });
            Share.open(options);
        });
    }
    copyPubKey = () => {
        Clipboard.setString(pubKey);
        ToastAndroid.showWithGravity('Public key copied to clipboard!', ToastAndroid.SHORT, ToastAndroid.BOTTOM);
    }
    const CopyIcon = (props) => (
        <TouchableOpacity onPress={() => copyPubKey()}>
          <Icon {...props} name='copy' />
        </TouchableOpacity>
    );
    return (
        <Modal visible={visible} backdropStyle={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
            <Layout level="3" style={styles.layout}>
                <Layout style={[styles.pubKeyLayout, styles.displayCenter]}>
                    <Text style={styles.paswdText} h1>Public Key</Text>
                    {
                        pubKey.length > 0 &&
                        <Layout>
                            <Layout style={styles.cpLayout}>
                                <Input style={styles.pubKeyText} disabled value={pubKey} accessoryRight={CopyIcon}/>
                            </Layout>
                            <Layout style={styles.displayCenter}>
                                <QRCode size={270} value={pubKey} quietZone={5} getRef={(c) => setSvg(c)}/>
                            </Layout>
                        </Layout>
                    }
                </Layout>
                <Layout
                    style={styles.modalStyle}>
                    <Button
                        onPress={() => {
                            setPubKey('');
                            setVisible(false);
                        }}>
                        Ok
                    </Button>
                    <Button
                        onPress={shareQR}>
                        Share
                    </Button>
                </Layout>
            </Layout>
        </Modal>
    )
}

export default PubKeyModal;