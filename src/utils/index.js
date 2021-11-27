import { put } from '@redux-saga/core/effects';

import * as ActionTypes from '../redux/actionTypes';
import { imageListSeparator, responseError } from '../constants';
import { notification } from 'antd';

export const formatCurrency = (text = '') => {
  return text.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const readFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader);
    reader.onerror = error => reject(error);
  });
}

export const getFormatImageSource = (imageSource) => {
  let customImageSource = imageSource.trim();

  if (!customImageSource.startsWith('http')) {
    customImageSource = `http://127.0.0.1:8000/${customImageSource}`
  }

  return customImageSource;
}

export const getImageListByString = (imageString, separator = imageListSeparator, formatImageSource = true) => {
  let imageList = imageString.split(separator).map((x) => x.trim());

  if (formatImageSource) {
    imageList = imageList.map(getFormatImageSource);
  }

  return imageList;
}

export const getFileNameByUrl = (fileUrl) => {
  const pathArray = fileUrl.split('/');

  if (!pathArray.length) return '';

  return pathArray[pathArray.length - 1];
};

export const apiErrorHandler = function* (errorMessage) {
  if (errorMessage === responseError.UNAUTHENTICATED) {
    yield put({ type: ActionTypes.LOGOUT });

    alert(errorMessage);
    return;
  }

  notification.error({
    message: 'Lỗi!',
    description: errorMessage,
  });
}
