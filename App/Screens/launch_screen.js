import { Text, ScrollView, Image, View } from 'react-native';
import React, { Component } from 'react';
import FancyBackground from '../Components/fancy_background';
import { Fonts, Metrics, Colors } from '../Themes/'
import {StyleSheet} from 'react-native'
import ButtonOutline from '../Components/ButtonOutline'
import ButtonWhiteFill from '../Components/button_white_fill';

const styles = StyleSheet.create({
  section: {
    flex: 1,
  },
  brandSection :{
    justifyContent: 'center',
    alignItems: 'center',
  },
  brand: {
    alignItems: 'center'
  },
  container: {
    flex: 1
  },
  brandName: {
    color: Colors.snow,
    fontSize: Fonts.size.big,
    fontWeight: '500'
  },
  slogan: {
    color: Colors.snow,
    width: '85%',
    fontSize: Fonts.size.regular,
    textAlign: 'center'
  },
  label: {
    color: Colors.snow,
    marginBottom: 11,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 13,
  },
  actions: {
    justifyContent: 'flex-end',
    paddingBottom: 70
  },
  actionWrapper: {
    alignItems: 'center'
  },
  actionWrapperLast: {
    marginTop: 35
  }
});


export default class LaunchScreen extends Component {

  constructor (props) {
    super(props)
  }

  render () {
    return (
      <FancyBackground>
        <View style={styles.container}>
          <View style={[styles.section, styles.brandSection]}>
            <Text style={styles.brandName}>AutoGraph</Text>
            <Text style={styles.slogan}>Profesjonalne narzędzie do zarządzania szkołami jazdy.</Text>
          </View>

          <View style={[styles.section, styles.actions]}>

            <View style={styles.actionWrapper}>
              <Text style={styles.label}>Nie masz jeszcze konta?</Text>
              <ButtonWhiteFill>ZAREJESTRUJ SIĘ</ButtonWhiteFill>
            </View>

            <View style={[styles.actionWrapper, styles.actionWrapperLast]}>
              <Text style={styles.label}>Masz już konto?</Text>
              <ButtonOutline onPress={()=>{this.props.navigation.navigate('login')}}>ZALOGUJ SIĘ</ButtonOutline>
            </View>

          </View>
        </View>
      </FancyBackground>
    )
  }
}
