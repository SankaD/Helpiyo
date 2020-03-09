import React, { Component } from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import PropTypes from 'prop-types';
import { Answers } from 'react-native-fabric';
import { SafeAreaView } from 'react-navigation';
import { View, Text, ActivityIndicator, FlatList, TouchableHighlight, TextInput } from 'react-native';
import { Button } from 'react-native-vector-icons/MaterialCommunityIcons';
import ProfileView from '../profile_view/component';
import styles from './styles';
import Toast from '../../utils/toast';
import Logger from '../../utils/logger';
import commonStyles from '../../common/styles';
import EmptyView from '../../common/empty_view/component';
import ActivityListItem from '../activity_list_item/container';
import CustomModal from '../../common/custom_modal/component';
import RequestComponent from '../../requests/request_view/container';
import ErrorPanel from '../../common/error_panel/component';

export default class MyProfileComponent extends Component {
    static navigationOptions={
      title: 'My Profile',
      headerStyle: { backgroundColor: commonStyles.colors.color_2 },
      headerTitleStyle: { color: commonStyles.colors.label_color },
      headerTintColor: commonStyles.colors.label_color,
    };

    constructor(props) {
      super(props);
      this.loadActivities = this.loadActivities.bind(this);
      this.showImageSelector = this.showImageSelector.bind(this);
    }

    state = {
      displayName: '',
    };

    static renderLoadupScreen() {
      return (
        <SafeAreaView style={styles.loadupScreen}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadupScreenText}>Loading profile</Text>
        </SafeAreaView>
      );
    }

    static renderEmptyView() {
      return (
        <EmptyView
          label1="No recent activities found."
          label2="Please check again later"
        />
      );
    }

    showImageSelector() {
      ImagePicker.openPicker({
        multiple: false,
        compressImageMaxWidth: 640,
        compressImageMaxHeight: 640,
        compressImageQuality: 0.8,
        mediaType: 'photo',
      })
        .then((image) => {
          Logger.info('images selected.');
          const sizeLimitInMB = 1;
          if (image.size > sizeLimitInMB * 1024 * 1024) {
            Toast.warn(`Not uploading images larger than ${sizeLimitInMB}MB`);
            return;
          }
          this.props.uploadProfilePic(this.props.profileId, image.path);
        })
        .catch((error) => {
          Logger.info('Images not selected');
          Logger.error(error);
        });
    }

    loadActivities() {
      this.props.loadActivities(this.props.profileId);
    }

    componentWillMount() {
      this.props.loadProfile(this.props.profileId);
      this.loadActivities();
      Answers.logCustom('my-profile-view', { profileId: this.props.profileId });
    }

    componentDidMount() {
      Answers.logCustom('load-page', { name: 'my-profile-page' });
    }

    componentDidUpdate() {
      if (this.props.tobeRefreshed) {
        this.props.loadProfile(this.props.profileId);
      }
    }

    static renderListItem(item) {
      const element = item.item;
      return (
        <RequestComponent request={element} />
      );
      // <ActivityListItem element={element} />
    }

    renderProfilePage(profile) {
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.mainPanel}>
            <View style={styles.topPanel}>
              <ProfileView
                profile={profile}
                menuButtonVisible={false}
                onMenuButtonClicked={() => {}}
                showFollowers={() => {}}
                picChangeAllowed
                nameChangeAllowed
                showImageSelector={this.showImageSelector}
                showNameChangeModal={this.props.showDisplayNameModal}
              />

            </View>
            <View style={styles.buttonPanel}>
              <Button
                name="trophy"
                style={styles.button}
                backgroundColor="#0000"
                color="#FFF"
                onPress={() => this.props.showBadges(this.props.profileId)}
                size={24}
              />
              <Button
                name="wallet"
                style={styles.button}
                backgroundColor="#0000"
                color="#FFF"
                onPress={() => this.props.showWallet()}
                size={24}
              />
              <Button
                name={commonStyles.icons.services}
                style={styles.button}
                backgroundColor="#0000"
                color="#FFF"
                onPress={() => this.props.showServices(this.props.profile)}
                size={24}
              />
            </View>
          </View>
          <View style={styles.bottomPanel}>
            <FlatList
              data={this.props.activities}
              renderItem={item => MyProfileComponent.renderListItem(item)}
              keyExtractor={(item, index) => `${item.target}_${index}`}
              refreshing={this.props.loadingActivities}
              onRefresh={this.loadActivities}
              style={styles.list}
              contentContainerStyle={[{ flexGrow: 1 }, this.props.activities.length ? null : { justifyContent: 'center' }]}
              ListEmptyComponent={MyProfileComponent.renderEmptyView()}
            />
          </View>
          <CustomModal modalVisible={this.props.nameChangeModalVisible} hideModal={this.props.hideNameChangeModal}>
            <View style={styles.displayNameModalContainer}>
              <Text style={styles.displayNameModalHeader}>Change Display Name</Text>
              <ErrorPanel testId="display name" errorMessage={this.props.displayNameError}>
                <TextInput
                  onChangeText={(text) => { this.setState({ displayName: text }); }}
                  editable={!this.props.changingHeroName}
                  style={styles.displayNameInput}
                  defaultValue={profile.heroName}
                />
              </ErrorPanel>
              <TouchableHighlight
                style={this.props.changingHeroName ? styles.displayNameSubmitButtonDisabled : styles.displayNameSubmitButton}
                disabled={this.props.changingHeroName}
                onPress={() => this.props.changeDisplayName(this.state.displayName)}
              >
                <Text style={styles.displayNameSubmitLabel}>Save</Text>
              </TouchableHighlight>
            </View>
          </CustomModal>
        </SafeAreaView>
      );
    }

    render() {
      const profile = this.props.profile;
      if (!profile || this.props.refreshing) {
        return MyProfileComponent.renderLoadupScreen();
      }

      return this.renderProfilePage(profile);
    }
}

MyProfileComponent.propTypes = {
  profile: PropTypes.object,
  profileId: PropTypes.string.isRequired,
  loadProfile: PropTypes.func.isRequired,
  showBadges: PropTypes.func.isRequired,
  refreshing: PropTypes.bool.isRequired,
  tobeRefreshed: PropTypes.bool.isRequired,
  uploadProfilePic: PropTypes.func.isRequired,
  activities: PropTypes.array.isRequired,
  loadingActivities: PropTypes.bool.isRequired,
  loadActivities: PropTypes.func.isRequired,
  nameChangeModalVisible: PropTypes.bool.isRequired,
  displayNameError: PropTypes.string.isRequired,
  hideNameChangeModal: PropTypes.func.isRequired,
  showDisplayNameModal: PropTypes.func.isRequired,
  changeDisplayName: PropTypes.func.isRequired,
  changingHeroName: PropTypes.bool.isRequired,
  showServices: PropTypes.func.isRequired,
  showWallet: PropTypes.func.isRequired,
};
MyProfileComponent.defaultProps = {
  profile: null,
};
