import React, { useEffect } from 'react';
import Uppy from '@uppy/core';
import Webcam from '@uppy/webcam';
import { Dashboard } from '@uppy/react';
import XHR from '@uppy/xhr-upload';
import Informer from '@uppy/informer';

import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';
import '@uppy/webcam/dist/style.min.css';
import '@uppy/informer/dist/style.min.css';

const uppy = new Uppy({ restrictions: {maxNumberOfFiles: 1}})
  .use(Informer)
  .use(Webcam, {
    modes: ['picture'],
    mirror: false
  })
  .use(XHR, { 
    endpoint: `${process.env.REACT_APP_API_BASEURL}/signin`,
    fieldName: 'user_photo'
  })
  .on('complete', (file, response) => {
    uppy.info(file.successful[0].response.body.name_surname);
});

export function App() {
  return (
    <Dashboard uppy={uppy} plugins={['Webcam']} />
  );
}
