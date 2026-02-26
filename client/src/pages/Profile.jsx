import React from 'react'
import { useSelector } from 'react-redux';
import { useRef } from 'react';
import { useState, useEffect } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase.js';
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, updateUserFailure, updateUserStart, updateUserSuccess } from '../redux/user/userSlice.js';
import { useDispatch } from 'react-redux';

const Profile = () => {
  /* this is the beauty of useRef kii kaa uss mai ham na kisi orr componenet koo liya orr uss koo uss kii functionality dai dii bhai akheer nhi hoo gaiya  */
  const fileInputRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined)
  const [filePercentage, setFilePercentage] = useState(0)
  const [fileUploadError, setFileUploadError] = useState(false)
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const dispatch = useDispatch()
  // const [interval, setInterval] = useState(null);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const file_name = new Date().getTime() + '-' + file.name;
    const storageRef = ref(storage, file_name);
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log('Upload is ' + progress + '% done');
        setFilePercentage(Math.round(progress));
      },
      (error) => {
        // console.error('Upload failed:', error);
        setFileUploadError(true)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            // console.log('File available at', downloadURL);
            setFormData({ ...formData, avatar: downloadURL });
          });
      }
    )
  };

  const handleChange = (e) => {
    // we get the previous form data and then we get the value of the id 
    // but i am confused in this [] thing what is it actually doing in it

    // check the teadme fiels for the explantion of the this line of the code 
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await res.json()
      if (data.success === false) {
        dispatch(updateUserFailure(data.message))
        return;
      }
      dispatch(updateUserSuccess(data))
      setUpdateSuccess(true)
    } catch (error) {
      dispatch(updateUserFailure(error.message))
    }
  }

  const handleDeleteUser = async (params) => {
    try {
      dispatch(deleteUserStart())
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',

      })
      const data = await res.json()
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message))
        return
      }
      dispatch(deleteUserSuccess(data))
    } catch (error) {
      // we want to dispatch the error and so we are going to redux
      dispatch(deleteUserFailure(error.message))
    }
  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>

      <form
        onSubmit={handleSubmit}
        className='flex flex-col gap-4' >

        <input

          /* this is the beauty of useRef kii kaa uss mai ham na kisi orr componenet koo liya orr uss koo uss kii functionality dai dii bhai akheer nhi hoo gaiya  */

          // accept = "image/*" is used to specify that only image files can be selected when the file input is triggered. This helps to ensure that users can only upload valid image files for their profile picture.
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileInputRef}
          hidden
          accept='image/*' />

        <img
          /* this is the beauty of useRef hai use useRef kii kaa uss mai ham na kisi orr componenet koo liya orr uss koo uss kii functionality dai dii bhai akheer nhi hoo gaiya  */
          onClick={() => fileInputRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover cursor-pointer self-center mt-2" />

        <p>
          {
            fileUploadError ?
              <span className='text-red-500'>
                File upload failed. Please try again.
              </span> : filePercentage > 0 ?
                <span>Uploading: {filePercentage}%</span> : null
          }
        </p>


        <input
          type="text"
          placeholder='username'
          className='border p-3 rounded-lg'
          id='username'
          defaultValue={currentUser.username}
          onChange={handleChange} />

        <input
          type="text"
          placeholder='email'
          className='border p-3 rounded-lg'
          id='email'
          defaultValue={currentUser.email}
          onChange={handleChange} />

        <input
          type="password"
          placeholder='password'
          className='border p-3 rounded-lg'
          id='password'
          onChange={handleChange} />


        <button
          disabled={loading}
          className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-0-80'>
          {/* what is the function of the useSelector and what is this line of code doing. what is the purpose of it and how it related with the useSelector  : chekc the note for it as well  */}
          {loading ? 'loading' : 'update'}
        </button>
      </form>

      <div className="mt-5 flex justify-between">
        <span
          onClick={handleDeleteUser}
          className="text-red-500 cursor-pointer hover:underline">Delete Account</span>
        <span className="text-green-700 cursor-pointer hover:underline">Sign Out</span>
      </div>

      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='green-red-700 mt-5'>{updateSuccess ? "User is updated successfully" : ''}</p>

    </div>
  )
}

export default Profile