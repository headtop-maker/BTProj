import {deviceSlice} from '../../store/reducers/DeviceSlice';
import {AppDispatch} from '../../store/store';

export class ThirdStage {
  params: () => void;
  dispatcher: AppDispatch;

  constructor(params: any, dispatcher: AppDispatch) {
    this.params = params;
    this.dispatcher = dispatcher;
  }

  onEnter() {
    console.log('onEnter 3');
  }

  async wait() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          this.onEnter();
          this.params();
          this.dispatcher(
            deviceSlice.actions.deviceStages('Подключаюсь к ESP32test'),
          );
          resolve('fourthStage');
        } catch (e) {
          reject(undefined);
        }
      }, 2000);
    });
  }
}
