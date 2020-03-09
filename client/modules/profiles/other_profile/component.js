import React, { Component } from 'react';
import { Answers } from 'react-native-fabric';
import {
  TouchableHighlight, View, Text, FlatList, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Button } from 'react-native-vector-icons/MaterialCommunityIcons';
import PropTypes from 'prop-types';
import styles from './styles';
import CustomModal from '../../common/custom_modal/component';
import Logger from '../../utils/logger';
import menuStyles from '../../home/requests/menu.styles';
import commonStyles from '../../common/styles';
import ProfileView from '../profile_view/component';
import EmptyView from '../../common/empty_view/component';
import RequestComponent from '../../requests/request_view/container';
import PopupMenu from '../../common/popup_menu/component';

export default class OtherProfileComponent extends Component {
    static navigationOptions={
      title: 'Profile',
      headerStyle: { backgroundColor: commonStyles.colors.color_2 },
      headerTitleStyle: { color: commonStyles.colors.label_color },
      headerTintColor: commonStyles.colors.label_color,
    };

    constructor(props) {
      super(props);
      this.state = {
        menuVisible: false,
      };
      this.loadActivities = this.loadActivities.bind(this);
      this.handleFollowing = this.handleFollowing.bind(this);
      // this.reportProfile = this.reportProfile.bind(this);
      this.showMenu = this.showMenu.bind(this);
    }

    handleFollowing() {
      Logger.info(`handle following : ${this.props.following}`);
      if (this.props.profileId) {
        if (this.props.following === false) {
          this.props.followProfile(this.props.profileId);
        } else if (this.props.following === true) {
          this.props.unfollowProfile(this.props.profileId);
        }
      }
    }

    loadActivities() {
      this.props.loadActivities(this.props.profileId);
    }

    componentDidUpdate() {
      if (this.props.tobeRefreshed) {
        this.props.loadProfile(this.props.profileId);
        this.props.isFollowing(this.props.profileId);
      }
    }

    componentWillMount() {
      this.props.loadProfile(this.props.profileId);
      this.props.isFollowing(this.props.profileId);
      this.loadActivities();
      Answers.logCustom('profile-view', { profileId: this.props.profileId });
    }

    componentDidMount() {
      Answers.logCustom('load-page', { name: 'other-profile-page' });
    }

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

    static renderListItem(item) {
      const element = item.item;
      return (
        <RequestComponent request={element} />
      );
    }

    showMenu(visible) {
      this.setState({ menuVisible: visible });
    }

    // reportProfile() {
    //   this.props.showReporter(this.props.profileId);
    //   this.setState({ menuVisible: false });
    // }

    renderMenu() {
      const { showReporter, profileId } = this.props;
      const menuItems = [{
        label: 'Report Profile',
        onPress: () => showReporter(profileId),
      }];
      return (
        <PopupMenu menuItems={menuItems} visible={this.state.menuVisible} hideMenu={() => this.showMenu(false)} />
      );
      // return (
      //   <CustomModal modalVisible={this.state.menuVisible} hideModal={() => this.showMenu(false)}>
      //     <View style={menuStyles.menu}>
      //       <TouchableHighlight style={menuStyles.menuItem} onPress={this.reportProfile}>
      //         <Text style={menuStyles.menuItemText}>Report profile</Text>
      //       </TouchableHighlight>
      //     </View>
      //   </CustomModal>
      // );
    }

    renderProfilePage() {
      const { profile, following } = this.props;
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.mainPanel}>
            <View style={styles.topPanel}>
              <ProfileView
                profile={profile}
                menuButtonVisible
                picChangeAllowed={false}
                nameChangeAllowed={false}
                onMenuButtonClicked={() => this.showMenu(true)}
                showFollowers={() => {}}
                showImageSelector={() => {}}
              />
            </View>
            <View style={styles.buttonPanel}>
              <Button
                name={following === true ? 'account-minus' : 'account-plus'}
                style={styles.button}
                backgroundColor="#0000"
                color={following === null ? commonStyles.colors.gray : commonStyles.colors.color_6}
                size={24}
                disabled={following === null}
                onPress={this.handleFollowing}
              />
              <Button
                name="trophy"
                style={styles.button}
                backgroundColor="#0000"
                color="#FFF"
                onPress={() => this.props.showBadges(this.props.profileId)}
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
              <Button
                name="message-outline"
                style={styles.button}
                backgroundColor="#0000"
                color="#FFF"
                onPress={() => this.props.openThread(this.props.profileId)}
                size={24}
              />
            </View>
          </View>

          <View style={styles.bottomPanel}>
            <FlatList
              data={this.props.activities}
              renderItem={item => OtherProfileComponent.renderListItem(item)}
              keyExtractor={(item, index) => `${item.target}_${index}`}
              refreshing={this.props.loadingActivities}
              onRefresh={this.loadActivities}
              style={styles.list}
              contentContainerStyle={[{ flexGrow: 1 }, this.props.activities.length ? null : { justifyContent: 'center' }]}
              ListEmptyComponent={OtherProfileComponent.renderEmptyView()}
            />
          </View>
          {this.renderMenu()}
        </SafeAreaView>
      );
    }

    render() {
      const profile = this.props.profile;
      if (!profile || this.props.refreshing) {
        return OtherProfileComponent.renderLoadupScreen();
      }

      return this.renderProfilePage();
    }
}

OtherProfileComponent.propTypes = {
  profile: PropTypes.object,
  followProfile: PropTypes.func.isRequired,
  unfollowProfile: PropTypes.func.isRequired,
  isFollowing: PropTypes.func.isRequired,
  loadProfile: PropTypes.func.isRequired,
  profileId: PropTypes.string.isRequired,
  following: PropTypes.bool,
  openThread: PropTypes.func.isRequired,
  showBadges: PropTypes.func.isRequired,
  activities: PropTypes.array.isRequired,
  loadingActivities: PropTypes.bool.isRequired,
  loadActivities: PropTypes.func.isRequired,
  refreshing: PropTypes.bool.isRequired,
  tobeRefreshed: PropTypes.bool.isRequired,
  showReporter: PropTypes.func.isRequired,
  showServices: PropTypes.func.isRequired,
};

OtherProfileComponent.defaultProps = {
  profile: null,
  following: null,
};
