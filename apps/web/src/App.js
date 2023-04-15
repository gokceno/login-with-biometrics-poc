import React, { useEffect } from 'react';
import Uppy from '@uppy/core';
import Webcam from '@uppy/webcam';
import { Dashboard } from '@uppy/react';
import XHR from '@uppy/xhr-upload';
import * as path from 'path'

import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';
import '@uppy/webcam/dist/style.min.css';

const uppy = new Uppy()
  .use(Webcam)
  .use(XHR, { 
    endpoint: `${process.env.REACT_APP_API_BASEURL}/signin`,
    fieldName: 'user_photo'
  })
  .on('complete', (file, response) => {
    console.log(file.successful[0].response.body);
});

export function App() {
  return (
    <Dashboard uppy={uppy} plugins={['Webcam']} />
  );
}
