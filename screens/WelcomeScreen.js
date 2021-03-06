import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components';
import {
  updateAuth,
  updateCreds,
  updateVars,
} from '../redux/actions/authActions';
import Spinner from 'react-native-loading-spinner-overlay';
import Qualtrics from 'react-native-qualtrics';

import {
  SafeAreaView,
  TextInput,
  PrimaryButton,
  ImageLogo,
  PrimaryButtonText,
  PrimaryTextInput,
} from '../controls/styles';
import {
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import CardView from '../controls/CardView';

function WelcomeScreen({ auth, setLogin, setCreds, setVars }) {
  const [isBusy, setIsBusy] = useState(false);
  const [brandID, setBrandID] = useState(auth.creds.brandID);
  const [projectID, setProjectID] = useState(auth.creds.projectID);
  const [extRefID, setExtRefID] = useState(auth.creds.extRefID);
  const [doExtRef, toggleExtRef] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    //console.log("WelcomeAuth", auth);
    //console.log("creds--", auth.creds);
  }, [auth.auth, auth.creds]);

  function brandTextChange(text) {
    setBrandID(text);
  }

  function projectTextChange(text) {
    setProjectID(text);
  }

  function extRefTextChange(text) {
    setExtRefID(text);
  }

  async function initilizeQualt() {
    //console.log('init goes here.', brandID, projectID);
    setIsBusy(true);

    if (doExtRef) {
      console.log('brand:', brandID, ' proj:', projectID, 'extRef:', extRefID);
      Qualtrics.initializeProjectWithExtRefId(
        brandID,
        projectID,
        extRefID,
        result => {
          console.log('result:', result);
          if (result.ERROR == null && Object.keys(result).length > 0) {
            console.log('Qualtrics Initilized!');
            setLogin({
              brandID: brandID,
              projectID: projectID,
              extRefID: extRefID,
              intercepts: result,
            });
            setCreds({
              brandID: brandID,
              projectID: projectID,
              extRefID: extRefID,
            });
            setIsBusy(false);
          } else {
            let msg = '';
            if (result.ERROR == null) {
              msg =
                'There was a problem logging in. Please check your credentials';
            } else {
              msg = result.ERROR.message;
            }
            Alert.alert(
              'Failed To Initilize',
              msg + '\nResult:' + JSON.stringify(result),
              [
                {
                  text: 'OK',
                  onPress: () => {
                    setIsBusy(false);
                  },
                },
              ],
              { cancelable: false },
            );
          }
        },
      );
    } else {
      Qualtrics.initializeProject(brandID, projectID, result => {
        console.log('result:', result);
        if (result.ERROR == null && Object.keys(result).length > 0) {
          console.log('Qualtrics Initilized!');
          setLogin({
            brandID: brandID,
            projectID: projectID,
            intercepts: result,
          });
          setCreds({
            brandID: brandID,
            projectID: projectID,
          });
          setIsBusy(false);
        } else {
          let msg = '';
          console.log('failed result:', result);
          if (result.ERROR == null) {
            msg =
              'There was a problem logging in. Please check your credentials';
          } else {
            msg = result.ERROR.message;
          }
          Alert.alert(
            'Failed To Initilize',
            msg + '\nResult : ' + JSON.stringify(result),
            [
              {
                text: 'OK',
                onPress: () => {
                  setIsBusy(false);
                },
              },
            ],
            { cancelable: false },
          );
        }
      });
    }
  }

  const doExtRefValChange = () => {
    toggleExtRef(!doExtRef);
  };

  return (
    <SafeAreaView>
      <KeyboardAvoidingView behavior="height">
        <ScrollView>
          <Spinner visible={isBusy} textContent={'loading...'} />
          <CardView style={styles.card}>
            <View style={styles.logoContainer}>
              {/*<Image
              style={styles.logo}
              source={require('../assets/Walker.png')}
            /> */}
              <Image
                style={styles.Wlogo}
                resizeMethod="scale"
                source={require('../assets/Walker_Logo.png')}
              />
              <Image
                source={require('../assets/qualtrics3.png')}
                resizeMethod="scale"
                style={styles.Qlogo}
              />
              <Text style={{ alignSelf: 'center', marginBottom: 10 }}>
                React Native 2.3.0 SDK Demo
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 15,
                }}>
                <Switch
                  trackColor={{ false: '#767577', true: '#81b0ff' }}
                  value={doExtRef}
                  onValueChange={doExtRefValChange}
                />
                <Text style={{ marginLeft: 15 }}>
                  Initilize with External Data Reference
                </Text>
              </View>
            </View>

            <Text style={styles.header}>Input Your Project Credendials:</Text>

            <View>
              <PrimaryTextInput
                style={styles.input}
                value={brandID}
                placeholder="Brand ID"
                placholderTextColor="#adb5bd"
                onChangeText={brandTextChange}
                autoCapitalize="none"
              />
              <Text style={{ marginLeft: 18, fontSize: 9, marginTop: -5 }}>
                Brand ID
              </Text>
              <PrimaryTextInput
                style={styles.input}
                value={projectID}
                autoCapitalize="none"
                placeholder="Project ID"
                placholderTextColor="#adb5bd"
                onChangeText={projectTextChange}
              />
              <Text style={{ marginLeft: 18, fontSize: 9, marginTop: -5 }}>
                Project ID
              </Text>
              {doExtRef ? (
                <>
                  <PrimaryTextInput
                    style={styles.input}
                    value={extRefID}
                    autoCapitalize="none"
                    placeholder="External Reference ID"
                    placholderTextColor="#adb5bd"
                    onChangeText={extRefTextChange}
                  />
                  <Text style={{ marginLeft: 18, fontSize: 9, marginTop: -5 }}>
                    ExtRef ID
                  </Text>
                </>
              ) : (
                  <></>
                )}
            </View>

            <PrimaryButton onPress={initilizeQualt} style={{ marginTop: 20 }}>
              <PrimaryButtonText style={styles.initBtn}>Initilize Project</PrimaryButtonText>
            </PrimaryButton>
          </CardView>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  logoContainer: {},
  Wlogo: {
    alignSelf: 'center',
    alignContent: 'center',
  },
  Qlogo: {
    alignSelf: 'center',
    alignContent: 'center',
    marginVertical: 5,
    marginTop: 12
  },
<<<<<<< HEAD
  inputText: {
    marginLeft: 18,
    fontSize: 15,
    marginTop: 5,
    fontWeight: 'bold',
  },
=======
>>>>>>> parent of 9bd3fce... Stable with UI improvements for Walker
  card: {
    marginTop: 15,
    alignSelf: 'center',
    width: '90%',
    backgroundColor: '#ff00ff',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 10,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  header: {
    alignSelf: 'center',
    fontSize: 20,
    marginVertical: 15,
    margin: 5,
    fontWeight: 'bold',
    textShadowRadius: .5,
    textShadowColor: 'black'
  },
  input: {
    margin: 10,
  },
  initBtn: {
    fontWeight: 'bold',
    fontSize: 20,
    textShadowRadius: 1,
    textShadowColor: 'black'
  }
});

const mapStateToProps = ({ auth, creds, custom_vars }) => ({
  auth,
  creds,
  custom_vars,
});

const mapDispatchToProps = dispatch => ({
  setLogin: data => dispatch(updateAuth(data)),
  setCreds: data => dispatch(updateCreds(data)),
  setVars: data => dispatch(updateVars(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WelcomeScreen);
