import React, { Component } from 'react';
import { Alert, View } from 'react-native';
import { ListItem } from 'react-native-elements';
import IconF from 'react-native-vector-icons/FontAwesome';
import IconM from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconE from 'react-native-vector-icons/Entypo';
import { Colors } from '../Themes';
import { connect } from 'react-redux';

class SettingsScreen extends Component {
  static navigationOptions = { header: null };

  saveSuccessCallback = () => {
    const title = 'Congratulations!';
    const message = 'Your changes have been saved.';
    const buttons = [{
      text: 'OK', onPress: () => {
        this.props.navigation.goBack(null);
      }
    }];

    Alert.alert(title, message, buttons);
  };

  render() {
    const { navigation, id } = this.props;
    const navParams = {
      handleSubmitSuccess: this.saveSuccessCallback,
      id
    };
    const ICON_SIZE = 25;

    return (
      <View style={{flex: 1}}>
        <ListItem
          leftIcon={<IconF size={ICON_SIZE} name={'cog'} color={Colors.strongGrey} style={styles.icon} />}
          title={'Information'}
          subtitle={'Edit basic info about your school.'}
          containerStyle={{ borderBottomWidth: 0, marginLeft: 0 }}
          keyExtractor={(item, index) => index}
          wrapperStyle={{marginLeft: 0}}
          onPress={() => {
            navigation.navigate('editSchoolInfo', navParams)
          }}
        />

        <ListItem
          leftIcon={<IconM size={ICON_SIZE} name={'schedule'} color={Colors.strongGrey} style={styles.icon} />}
          title={'Schedule Bounadries'}
          subtitle={'Edit schedule boundaries'}
          containerStyle={{ borderBottomWidth: 0 }}
          keyExtractor={(item, index) => index}
          wrapperStyle={{marginLeft: 0}}
          onPress={() => {
            navigation.navigate('editValidTimeFrames', navParams)
          }}
        />

        <ListItem
          leftIcon={<Icon size={ICON_SIZE} name={'calendar'} color={Colors.strongGrey} style={styles.icon}/>}
          title={`Calendar`}
          subtitle={'Edit calendar settings'}
          containerStyle={{ borderBottomWidth: 0 }}
          keyExtractor={(item, index) => index}
          wrapperStyle={{marginLeft: 0}}
          onPress={() => {
            navigation.navigate('editScheduleSettings', navParams)
          }}
        />

        {/*<ListItem*/}
          {/*leftIcon={<IconE size={25} name={'trash'} color={Colors.salmon} style={styles.icon}/>}*/}
          {/*title={`Usun szkole`}*/}
          {/*subtitle={'Lorem ipsum dolor sit melt'}*/}
          {/*containerStyle={{ borderBottomWidth: 0 }}*/}
          {/*keyExtractor={(item, index) => index}*/}
          {/*wrapperStyle={{marginLeft: 0}}*/}
          {/*onPress={() => {*/}
            {/*// navigation.navigate('editScheduleSettings', navParams)*/}
          {/*}}*/}
        {/*/>*/}
      </View>
    )
  }
}

const styles = {
  icon: {
    marginRight: 15, alignSelf: 'center'
  }
};

const mapStateToProps = state => ({
  id: state.context.currentDrivingSchoolID
});

export default connect(mapStateToProps)(SettingsScreen)
