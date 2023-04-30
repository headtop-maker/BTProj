import RNMethods from '../../Methods/RNMethods';
import {firebaseApi} from '../../services/DeviceService';
import {deviceSlice, IConnected} from '../../store/reducers/DeviceSlice';
import {AppDispatch} from '../../store/store';

export class FourthStage {
  params: () => IConnected;
  dispatcher: AppDispatch;

  constructor(params: any, dispatcher: AppDispatch) {
    this.params = params;
    this.dispatcher = dispatcher;
  }

  onEnter() {
    console.log('onEnter 4');
  }

  async wait() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const resultData = this.params();
          const date = new Date();
          if (resultData.connect) {
            RNMethods.sendMessage('A');
            this.dispatcher(
              deviceSlice.actions.deviceStages('Соединение установлено'),
            );
            this.dispatcher(
              firebaseApi.endpoints.patchDev.initiate({
                dev_connect: 'Подключено в ' + date.toString(),
              }),
            );
          } else {
            this.dispatcher(
              deviceSlice.actions.deviceStages('Ошибка подключения'),
            );
          }

          resolve(undefined);
        } catch (e) {
          reject(undefined);
        }
      }, 2000);
    });
  }
}
