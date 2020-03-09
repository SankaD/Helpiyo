import * as types from './types';

const initialState = {
  badges: [],
  profile: null,
  profileId: null,
  refreshing: false,
  tobeRefreshed: false,
  loadingActivities: false,
  activities: [],
  following: null,
  achievements: [],
  nameChangeModalVisible: false,
  displayNameError: '',
  changingHeroName: false,
  karmaPoints: 0,
  karmaActivity: [],
  karmaRefreshing: false,
};

export default (state = initialState, action) => {
  if (action.type === types.LOAD_PROFILE) {
    return Object.assign({}, state, {
      profile: null,
      profileId: action.profileId,
      following: null,
      refreshing: true,
      tobeRefreshed: false,
      activities: [],
    });
  } else if (action.type === types.PROFILE_LOADED) {
    return Object.assign({}, state, {
      profile: action.profile,
      refreshing: false,
      tobeRefreshed: false,
    });
  } else if (action.type === types.LOAD_PROFILE_FAILED) {
    return Object.assign({}, state, {
      profile: null,
      miscError: action.miscError,
      refreshing: false,
      tobeRefreshed: false,
    });
  } else if (action.type === types.FOLLOWING_CHECKED) {
    return Object.assign({}, state, {
      following: action.following,
    });
  } else if (action.type === types.CHECKING_FOLLOWING_FAILED) {
    return Object.assign({}, state, {
      following: null,
    });
  } else if (action.type === types.CHECKING_FOLLOWING) {
    return Object.assign({}, state, {
      following: null,
    });
  } else if (action.type === types.SHOW_BADGES) {
    return Object.assign({}, state, {
      profileId: action.profileId,
    });
  } else if (action.type === types.LOAD_BADGES_FAILED) {
    return Object.assign({}, state, {
      error: action.error,
    });
  } else if (action.type === types.BADGES_LOADED) {
    return Object.assign({}, state, {
      badges: action.badges,
      achievements: action.achievements,
    });
  } else if (action.type === types.PROFILE_PIC_UPLOADED) {
    return Object.assign({}, state, {
      tobeRefreshed: true,
    });
  } else if (action.type === types.LOAD_ACTIVITIES) {
    return Object.assign({}, state, {
      loadingActivities: true,
    });
  } else if (action.type === types.ACTIVITIES_LOADED) {
    return Object.assign({}, state, {
      activities: action.activities,
      loadingActivities: false,
    });
  } else if (action.type === types.LOAD_ACTIVITIES_FAILED) {
    return Object.assign({}, state, {
      loadingActivities: false,
    });
  } else if (action.type === types.FOLLOW_PROFILE || action.type === types.UNFOLLOW_PROFILE) {
    return Object.assign({}, state, {
      following: null,
    });
  } else if (
    action.type === types.PROFILE_UNFOLLOWED
      || action.type === types.PROFILE_FOLLOWED
      || action.type === types.FOLLOW_PROFILE_FAILED
        || action.type === types.UNFOLLOW_PROFILE_FAILED
  ) {
    return Object.assign({}, state, {
      tobeRefreshed: true,
    });
  } else if (action.type === types.SHOW_DISPLAY_NAME_MODAL) {
    return Object.assign({}, state, {
      nameChangeModalVisible: true,
      displayNameError: '',
      changingHeroName: false,
    });
  } else if (action.type === types.CHANGE_DISPLAY_NAME_FAILED) {
    return Object.assign({}, state, {
      displayNameError: action.displayNameError,
      changingHeroName: false,
    });
  } else if (action.type === types.HIDE_DISPLAY_NAME_MODAL) {
    return Object.assign({}, state, {
      nameChangeModalVisible: false,
    });
  } else if (action.type === types.CHANGE_DISPLAY_NAME) {
    return Object.assign({}, state, {
      displayNameError: '',
      changingHeroName: true,
    });
  } else if (action.type === types.DISPLAY_NAME_CHANGED) {
    return Object.assign({}, state, {
      nameChangeModalVisible: false,
      tobeRefreshed: true,
      changingHeroName: false,
    });
  } else if (action.type === types.LOAD_WALLET_DATA) {
    return Object.assign({}, state, {
      karmaRefreshing: true,
    });
  } else if (action.type === types.LOAD_WALLET_DATA_FAILED) {
    return Object.assign({}, state, {
      karmaActivity: [],
      karmaRefreshing: false,
    });
  } else if (action.type === types.WALLET_DATA_LOADED) {
    return Object.assign({}, state, {
      karmaPoints: action.karmaPoints,
      karmaActivity: action.karmaActivity,
      karmaRefreshing: false,
    });
  }
  return state;
};
