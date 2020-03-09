import Toast from 'react-native-root-toast';
import Logger from '../utils/logger';

export default class Toasts {
    static durations = { SHORT: Toast.durations.SHORT, LONG: Toast.durations.LONG };
    static colors = {
      RED: '#F66',
      GREEN: '#295',
      BLUE: '#29d',
      ORANGE: '#DDAB20',
      BLACK: '#555',
    };
    static show(text, duration = Toasts.durations.SHORT, color = Toasts.colors.BLACK) {
      Logger.info(`Toast: ${text}`);
      Toast.show(text, { duration, backgroundColor: color, position: 0 });
    }
    static error(text) {
      Toasts.show(text, Toasts.durations.LONG, Toasts.colors.RED);
    }
    static warn(text) {
      Toasts.show(text, Toasts.durations.LONG, Toasts.colors.ORANGE);
    }
    static success(text) {
      Toasts.show(text, Toasts.durations.SHORT, Toasts.colors.GREEN);
    }
    static info(text) {
      Toasts.show(text, Toasts.durations.SHORT, Toasts.colors.BLUE);
    }
}
