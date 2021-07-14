import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TextInput, Button } from 'react-native';
import Qualtrics from 'react-native-qualtrics';
import { ScrollView } from 'react-native-gesture-handler';

function QualtVar(props) {
  const [key, setKey] = useState(props.input.key);
  const [name, setName] = useState(props.input.name);
  const [val, setVal] = useState(props.input.value);
  let [numeric, setNumeric] = useState(false);

  useEffect(() => {
    setKey(props.input.key);
    setName(props.input.name);
    setVal(props.input.value);
  }, [props.input])

  useEffect(() => {
    let v = parseInt(val);
    if (Number.isNaN(v)) {
      Qualtrics.setString(name, val);
      setNumeric(false);
    } else {
      Qualtrics.setNumber(name, v);
      setNumeric(true);
    }
  }, [props])

  function onVarNameChange(e) {
    console.log('name-change:', e);
    setName(e);
    props.changeValue(key, e, val);
  }

  function onVarValChange(e) {
    console.log('val-change:', e);
    setVal(e);
    props.changeValue(key, name, e);
  }
  function deleteMe() {
    console.log("reging");
    props.removeVar(props.input.key);
  }

  return (
    <View style={styles.bar}>
      <Text onPress={deleteMe} style={styles.removeText}>
        -
      </Text>
      <ScrollView style={{ borderWidth: 1, paddingVertical: 4, borderRadius: 10, backgroundColor: '#d3d3d3' }} horizontal={true} >
        <TextInput
          style={styles.varText}
          onChangeText={onVarNameChange}
          placeholder="Name"
          value={name}
          autoCapitalize='none'>

        </TextInput>
        <Text style={{ fontSize: 18, padding: 10, marginLeft: 15 }}>:</Text>
        <TextInput
          onChangeText={onVarValChange}
          placeholder="Value"
          style={numeric ? styles.varNumeric : styles.varText}
          value={val}
          autoCapitalize='none'>
        </TextInput>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 5,
    //backgroundColor: '#bfbfbf',
    borderRadius: 15,
    padding: 5
  },
  removeText: {
    borderRadius: 10,
    fontSize: 30,
    backgroundColor: 'white',
    margin: 7,
    paddingLeft: 20,
    alignSelf: 'center',
    borderWidth: 1,
    width: 60,
  },
  varText: {
    fontSize: 18,
    marginLeft: 15,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 15,
    borderRadius: 10,
    backgroundColor: 'white'
    //backgroundColor: 'red'
  },
  varNumeric: {
    fontSize: 18,
    marginLeft: 15,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#ffffcc'
  }
});

export default QualtVar;