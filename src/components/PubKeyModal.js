import React, {useState, useEffect} from 'react';
import {Layout, Text, Button, Input, Modal, Icon} from '@ui-kitten/components';
import {TouchableOpacity, StyleSheet, Dimensions, ToastAndroid, Platform} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Share from 'react-native-share';
import Clipboard from '@react-native-community/clipboard';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  layout: {
    padding: 25,
    flex: 1,
    width: Dimensions.get('window').width - 10,
  },
  cpLayout: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
  },
  pubKeyContainer: {
    width: '100%',
  },
  pubKeyText: {
    textAlign: 'justify',
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
    backgroundColor: 'transparent',
  },
  displayCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'red',
    height: 25,
  },
});

const PubKeyModal = ({address, visible, setVisible, setError}) => {
  const [pubKey, setPubKey] = useState('');
  const [svg, setSvg] = useState('');
  // ComponentDidMount
  useEffect(() => {
    setPubKey(address);
    setError('');
  }, []);

  const shareQR = () => {
    const title = 'Ethential Wallet address';
    svg.toDataURL((dataURL) => {
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
  };
  const copyPubKey = () => {
    Clipboard.setString(pubKey);
    ToastAndroid.showWithGravity(
      'Public key copied to clipboard!',
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM
    );
  };
  const CopyIcon = (props) => (
    <TouchableOpacity onPress={() => copyPubKey()}>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Icon {...props} name="copy" />
    </TouchableOpacity>
  );
  return (
    <Modal visible={visible} backdropStyle={{backgroundColor: 'rgba(0,0,0,0.8)'}}>
      <Layout level="3" style={styles.layout}>
        <Layout style={[styles.pubKeyLayout, styles.displayCenter]}>
          <Text style={styles.paswdText} h1>
            Public Key
          </Text>
          {pubKey.length > 0 && (
            <Layout>
              <Layout style={styles.cpLayout}>
                <Input
                  style={styles.pubKeyContainer}
                  textStyle={styles.pubKeyText}
                  disabled
                  value={pubKey}
                  accessoryRight={CopyIcon}
                />
              </Layout>
              <Layout style={styles.displayCenter}>
                <QRCode size={270} value={pubKey} quietZone={5} getRef={setSvg} />
              </Layout>
            </Layout>
          )}
        </Layout>
        <Layout style={styles.modalStyle}>
          <Button
            onPress={() => {
              setPubKey('');
              setVisible(false);
            }}>
            Ok
          </Button>
          <Button onPress={shareQR}>Share</Button>
        </Layout>
      </Layout>
    </Modal>
  );
};

PubKeyModal.propTypes = {
  address: PropTypes.string,
  visible: PropTypes.bool,
  setError: PropTypes.func,
  setVisible: PropTypes.func,
};

export default PubKeyModal;
