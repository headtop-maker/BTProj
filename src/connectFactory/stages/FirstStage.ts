import {deviceSlice} from '../../store/reducers/DeviceSlice';
import {AppDispatch} from '../../store/store';
export class FirstStage {
  params: () => void;
  dispatcher: AppDispatch;

  constructor(params: any, dispatcher: AppDispatch) {
    this.params = params;
    this.dispatcher = dispatcher;
  }

  onEnter() {
    console.log('onEnter 1');
    this.dispatcher(
      deviceSlice.actions.deviceStages('Запрашиваю список устройств'),
    );
  }

  async wait() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          this.onEnter();
          this.params();
          resolve('secondStage');
        } catch (e) {
          reject(undefined);
        }
      }, 2000);
    });
  }
}
