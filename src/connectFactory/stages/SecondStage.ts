import {deviceSlice} from '../../store/reducers/DeviceSlice';
import {AppDispatch} from '../../store/store';
import {GetDevice} from '../../types/types';

export class SecondStage {
  devices: any[];
  params: () => GetDevice[];
  dispatcher: AppDispatch;

  constructor(params: any, dispatcher: AppDispatch) {
    this.params = params;
    this.devices = [];
    this.dispatcher = dispatcher;
  }

  async onEnter() {
    console.log('onEnter 2');
  }

  async wait() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          this.onEnter();
          if (this.params().length === 0) {
            this.dispatcher(
              deviceSlice.actions.deviceStages('Список устройств пустой'),
            );
            resolve(undefined);
          } else {
            this.dispatcher(deviceSlice.actions.deviceStages('Список получен'));
            resolve('thirdStage');
          }
        } catch (e) {
          reject(undefined);
        }
      }, 2000);
    });
  }
}
