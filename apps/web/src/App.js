import React, { useEffect } from 'react';
import Uppy from '@uppy/core';
import Webcam from '@uppy/webcam';
import { Dashboard } from '@uppy/react';
import XHR from '@uppy/xhr-upload';
import Form from '@uppy/form';

import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';
import '@uppy/webcam/dist/style.min.css';

const uppy = new Uppy({ restrictions: {maxNumberOfFiles: 1}})
  .use(Webcam, {
    modes: ['picture'],
    mirror: false
  })
  .use(XHR, { 
    endpoint: `${process.env.REACT_APP_API_BASEURL}/register`,
    fieldName: 'user_photo'
  })
  .on('complete', (file, response) => {
    alert(`Welcome aboard ${file.successful[0].response.body.nameSurname}`);
  });

export function App() {
  useEffect(() => {
      uppy.use(Form, {
      target: '#signup',
      addResultToForm: false
    })
  });
  return (
    <div className="max-w-md mx-auto flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 pt-6">Sign up with TMRW ID</h1>
      <div className="justify-center h-screen">
        <form id="signup" className="bg-white shadow-md rounded px-4 pb-8 mb-2">
          <div className="mb-4">
            <Dashboard uppy={uppy} hideUploadButton={true} width={350} height={350} plugins={['Webcam']} />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name_surname">
              Name Surname
            </label>
            <div className="relative">
              <input
                className="appearance-none block w-full border border-gray-400 rounded py-2 px-3 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="name_surname"
                name="name_surname"
                type="text"
                placeholder="Enter your PII"
              />
            </div>
          </div>
          <div className="flex items-center justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={() => uppy.upload()}
            >
              Sign up 
            </button>
            &nbsp;&nbsp;
             <a
                className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                href="#"
              >
              or Sign in
              </a>
          </div>
        </form>
      </div>
    </div>
  );
}
