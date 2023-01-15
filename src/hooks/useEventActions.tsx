import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {EventsMessages} from '../containers/main/eventsMessages';
import {getFileDirectory} from '../store/filesStore/action';
import {
  clearCurrentFileParamsState,
  setModalState,
} from '../store/settings/action';

interface useEventActionsProps {}

const useEventActions = () => {
  const dispatch = useDispatch();

  const status = [
    {
      eventMessageName: EventsMessages.loading,
      eventFunction: data => {
        dispatch(
          setModalState({
            message: 'Загружаю',
            showModal: true,
            showIndicator: true,
          }),
        );
        console.log('thisData', data);
      },
    },
    {
      eventMessageName: EventsMessages.receive,
      eventFunction: data => {
        dispatch(
          setModalState({
            message: 'Файл загружен ',
            showModal: true,
            showIndicator: false,
          }),
        );
        dispatch(getFileDirectory());
      },
    },
    {
      eventMessageName: EventsMessages.failure,
      eventFunction: () =>
        dispatch(
          setModalState({
            message: 'Ошибка сервера',
            showModal: true,
            showIndicator: false,
          }),
        ),
    },
  ];

  const client = [
    {
      eventMessageName: EventsMessages.sending,
      eventFunction: () =>
        dispatch(
          setModalState({
            message: 'Отправляю',
            showModal: true,
            showIndicator: true,
          }),
        ),
    },
    {
      eventMessageName: EventsMessages.sent,
      eventFunction: data => {
        dispatch(
          setModalState({
            message: 'Файл отправлен ',
            showModal: true,
            showIndicator: false,
          }),
        );
        dispatch(clearCurrentFileParamsState());
        console.log('thisData', data);
      },
    },
    {
      eventMessageName: EventsMessages.failure,
      eventFunction: () => {
        dispatch(
          setModalState({
            message: 'Ошибка клиента',
            showModal: true,
            showIndicator: false,
          }),
        );
        dispatch(clearCurrentFileParamsState());
      },
    },
  ];

  return {statusActions: status, clientActions: client};
};

export default useEventActions;
