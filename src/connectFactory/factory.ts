import {IConnected} from '../store/reducers/DeviceSlice';
import {AppDispatch} from '../store/store';
import {GetDevice} from '../types/types';
import {FirstStage} from './stages/FirstStage';
import {FourthStage} from './stages/FourthStage';
import {SecondStage} from './stages/SecondStage';
import {ThirdStage} from './stages/ThirdStage';

export class Factory {
  create(
    type:
      | 'firstStage'
      | 'secondStage'
      | 'thirdStage'
      | 'fourthStage'
      | undefined,
    params?: () => void | GetDevice[] | IConnected,
    dispatch?: AppDispatch | any,
  ) {
    let deviceFactoryStage;
    if (type === 'firstStage') {
      deviceFactoryStage = new FirstStage(params, dispatch);
    }
    if (type === 'secondStage') {
      deviceFactoryStage = new SecondStage(params, dispatch);
    }
    if (type === 'thirdStage') {
      deviceFactoryStage = new ThirdStage(params, dispatch);
    }

    if (type === 'fourthStage') {
      deviceFactoryStage = new FourthStage(params, dispatch);
    }
    deviceFactoryStage.type = type;
    if (deviceFactoryStage.type !== undefined) {
      deviceFactoryStage.say = function () {
        console.log(`run stages ${this.type}`);
      };
    }

    return deviceFactoryStage;
  }
}

interface ICallBackStages {
  firstStage: () => void;
  secondStage: () => void | GetDevice[];
  thirdStage: () => void;
  fourthStage: () => void | IConnected;
}

export class stagesRunFactory {
  callback: ICallBackStages;
  dispatch: AppDispatch;

  constructor(callback: ICallBackStages, dispatch: AppDispatch) {
    this.callback = callback;
    this.dispatch = dispatch;
  }
  onEnter() {
    this.callback.firstStage();
  }

  async run() {
    const stage: any[] = [];
    const deviceFactory = new Factory();
    stage.push(
      deviceFactory.create(
        'firstStage',
        () => this.callback.firstStage(),
        this.dispatch,
      ),
    );

    for (let i = 0; i < stage.length; i++) {
      await stage[i].say();

      let result = await stage[i].wait();

      if (result !== undefined) {
        stage.push(
          deviceFactory.create(
            result,
            () => this.callback[`${result}`](),
            this.dispatch,
          ),
        );
      }
    }
  }
}

// this.dispatch(deviceSlice.actions.deviceFetchingError('+++'));
