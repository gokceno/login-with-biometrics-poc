import React, { useEffect } from 'react';
import Uppy from '@uppy/core';
import Webcam from '@uppy/webcam';
import { Dashboard } from '@uppy/react';
import XHR from '@uppy/xhr-upload';
import { Routes, Route, Outlet, Link } from "react-router-dom";

import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';
import '@uppy/webcam/dist/style.min.css';

const uppy = new Uppy({ restrictions: {maxNumberOfFiles: 1}})
  .use(Webcam, {
    modes: ['picture'],
    mirror: false
  })
  .use(XHR, { 
    endpoint: `${process.env.REACT_APP_API_BASEURL}/signin`,
    fieldName: 'user_photo'
  })
  .on('upload-error', (file, error, response) => {
    alert(`Error: ${response.body.error}`);
  })
  .on('complete', (file) => {
    file.successful.map(file => uppy.removeFile(file.id));
  });

export function SignIn() {
  useEffect(() => {
    return () => {
      uppy.close();
    };
  }, []);
  const handleUpload = () => {
    const files = uppy.getFiles();
    if (files.length == 1) {
      uppy
      .upload()
      .then((result) => {
        if(result.failed.length === 0) {
          alert(`Welcome back, ${result.successful[0].response.body.name_surname}`);
        }
      })
    }
    else {
      alert('Please take a picture or add an image file.');
    }
  }
  return (
    <div className="justify-center h-screen">
      <form id="signup" className="bg-white shadow-md rounded px-4 pb-8 mb-2">
        <div className="mb-4">
          <Dashboard uppy={uppy} hideUploadButton={true} width={350} height={350} plugins={['Webcam']} />
        </div>
        <div className="flex items-center justify-center">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={handleUpload}
          >
            Scan your face & Sign in
          </button>
          &nbsp;&nbsp;
          <Link className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" to="/">or Sign up</Link>
        </div>
      </form>
    </div>
  );
}