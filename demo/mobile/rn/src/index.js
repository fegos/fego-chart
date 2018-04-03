import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import ChartView from './Chart';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgray',
  },
});

export default class Demo extends Component {
  componentWillMount() {
  }

  render() {
    return (
      <View style={styles.container}>
        <ChartView />
      </View>
    );
  }
}
