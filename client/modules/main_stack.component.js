import { createStackNavigator } from 'react-navigation';

import SignInPage from './auth/sign_in_page/container';
import SignUpPage from './auth/sign_up_page/container';
import VerifyPage from './auth/verify_page/container';
import HomePage from './home/home_page/container';
import RequestEditor from './requests/request_editor/container';
import ResponseEditor from './responses/response_editor/container';
import ResponsesForRequest from './responses/responses_for_request/container';
import MyProfile from './profiles/my_profile/container';
import OtherProfile from './profiles/other_profile/container';
import RequestPage from './requests/request_page/container';
import ResponsePage from './responses/response_page/container';
import ServicePage from './services/service_page/container';
import Reporter from './reporter/container';
import ThreadView from './messages/thread_view/container';
import MessageView from './messages/chat_view/container';
import CommentView from './comments/container';
import BadgeView from './profiles/badges/container';
import NotificationView from './notifications/container';
import AccountSettings from './settings/account/container';
import ResetPasswordPage from './auth/reset/container';
import LeaderBoard from './leaderboard/container';
import LoadupPage from './auth/loadup_page/component';
import SearchView from './search/container';
import RatingsPage from './ratings/container';
import ImageView from './image_view/container';
import ServiceList from './services/list/container';
import ServiceEditor from './services/editor/container';
import RequestsForService from './requests/requests_for_service/container';
import InterestSetter from './settings/set_interests/container';
import WalletPage from './profiles/wallet/container';
import IntroPage from './intro/container';

const MainStack = createStackNavigator({
  HomePage: {
    screen: HomePage,
    navigationOptions: { header: null },
  },
  IntroPage: {
    screen: IntroPage,
    navigationOptions: { header: null },
  },
  SearchPage: {
    screen: SearchView,
    navigationOptions: { header: null },
  },
  RatingsPage: {
    screen: RatingsPage,
  },
  LoadupPage: {
    screen: LoadupPage,
    navigationOptions: { header: null },
  },
  SignInPage: {
    screen: SignInPage,
    navigationOptions: { header: null },
  },
  SignUpPage: {
    screen: SignUpPage,
    navigationOptions: { header: null },
  },
  VerifyPage: {
    screen: VerifyPage,
    navigationOptions: { header: null },
  },
  PasswordReset: {
    screen: ResetPasswordPage,
    navigationOptions: { header: null },
  },
  RequestEditor: {
    screen: RequestEditor,
  },
  ResponseEditor: {
    screen: ResponseEditor,
  },
  ResponsesForRequest: {
    screen: ResponsesForRequest,
  },
  MyProfile: {
    screen: MyProfile,
  },
  OtherProfile: {
    screen: OtherProfile,
  },
  RequestPage: {
    screen: RequestPage,
  },
  ResponsePage: {
    screen: ResponsePage,
  },
  ServicePage: {
    screen: ServicePage,
  },
  Reporter: {
    screen: Reporter,
  },
  ThreadView: {
    screen: ThreadView,
  },
  MessageView: {
    screen: MessageView,
  },
  CommentView: {
    screen: CommentView,
  },
  BadgeView: {
    screen: BadgeView,
  },
  SettingsView: {
    screen: AccountSettings,
  },
  NotificationView: {
    screen: NotificationView,
  },
  LeaderBoard: {
    screen: LeaderBoard,
  },
  ServiceList: {
    screen: ServiceList,
  },
  ServiceEditor: {
    screen: ServiceEditor,
  },
  ImageView: {
    screen: ImageView,
  },
  WalletPage: {
    screen: WalletPage,
  },
  InterestSetter: {
    screen: InterestSetter,
  },
  RequestsForService: {
    screen: RequestsForService,
  },
}, {
  initialRouteName: 'LoadupPage',
});

export default MainStack;
