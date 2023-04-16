import React, { useEffect, useState } from 'react';
import Uppy from '@uppy/core';
import Webcam from '@uppy/webcam';
import { Dashboard } from '@uppy/react';
import XHR from '@uppy/xhr-upload';
import Form from '@uppy/form';
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
    endpoint: `${process.env.REACT_APP_API_BASEURL}/register`,
    fieldName: 'user_photo'
  })
  .on('upload-error', (file, error, response) => {
    alert(`Error: ${response.body.error}`);
  })
  .on('complete', (file) => {
    file.successful.map(file => uppy.removeFile(file.id));
  });

function SignUp() {
  useEffect(() => {
      uppy.use(Form, {
      id: 'signup-form',
      target: '#signup',
      addResultToForm: false
    })
  }, []);
  const [inputValue, setInputValue] = useState('');
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  }
  const handleUpload = () => {
    const files = uppy.getFiles();
    if (files.length == 1 && inputValue.trim() !== '') {
      uppy
      .upload()
      .then((result) => {
        if(result.failed.length === 0) {
          setInputValue('');
          alert(`Welcome aboard ${result.successful[0].response.body.nameSurname}`);
        }
      })
    }
    else {
      alert('Please take a picture or add an image file and enter your PII.');
    }
  }
  return (
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
              value={inputValue}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="flex items-center justify-center">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={handleUpload}
          >
            Sign up 
          </button>
          &nbsp;&nbsp;
          <Link className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" to="/sign-in">or Sign in</Link>
        </div>
      </form>
    </div>
  );
}

function SignIn() {
  return (
    <div>
      <h2>Sign In</h2>
    </div>
  );
}

function Layout() {
  return (
    <div className="max-w-md mx-auto flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 pt-6">Proceed with TMRW ID</h1>
      <Outlet />
    </div>
  );
}

export function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<SignUp />} />
          <Route path="sign-in" element={<SignIn />} />
        </Route>
      </Routes>
    </div>
  );
}