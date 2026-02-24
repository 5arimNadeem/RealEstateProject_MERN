import React from 'react'
import { useSelector } from 'react-redux';
import { useRef } from 'react';
import { useState, useEffect } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../';

const Profile = () => {
  /* khubsoorati hai use useRef kii kaa uss mai ham na kisi orr componenet koo liya orr uss koo uss kii functionality dai dii bhai akheer nhi hoo gaiya  */
  const fileInputRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined)
  const [filePercentage, setFilePercentage] = useState(0)
  const [fileUploadError, setFileUploadError] = useState(false)
  const [formData, setFormData] = useState({});
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
        console.error('Upload failed:', error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          // console.log('File available at', downloadURL);
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    )
  };
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>

      <form className='flex flex-col gap-4' >

        <input

          /* khubsoorati hai use useRef kii kaa uss mai ham na kisi orr componenet koo liya orr uss koo uss kii functionality dai dii bhai akheer nhi hoo gaiya  */

          // accept = "image/*" is used to specify that only image files can be selected when the file input is triggered. This helps to ensure that users can only upload valid image files for their profile picture.
          onChange={(e) => setFile(e.target.files[0])}
          type="file" ref={fileInputRef} hidden accept='image/*' />

        <img
          /* khubsoorati hai use useRef kii kaa uss mai ham na kisi orr componenet koo liya orr uss koo uss kii functionality dai dii bhai akheer nhi hoo gaiya  */
          onClick={() => fileInputRef.current.click()}
          src={formData.avatar || currentUser.avatar} alt="Profile" className="w-24 h-24 rounded-full object-cover cursor-pointer self-center mt-2" />

          <p>
            {fileUploadError ? <span className='text-red-500'>File upload failed. Please try again.</span> : filePercentage > 0 ? <span>Uploading: {filePercentage}%</span> : null}
          </p>

        <input type="text" placeholder='username' className='border p-3 rounded-lg' id='username' />
        <input type="text" placeholder='email' className='border p-3 rounded-lg' id='email' />
        <input type="text" placeholder='password' className='border p-3 rounded-lg' id='password' />

        <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-0-80'>Update</button>
      </form>

      <div className="mt-5 flex justify-between">
        <span className="text-red-500 cursor-pointer hover:underline">Delete Account</span>
        <span className="text-green-700 cursor-pointer hover:underline">Sign Out</span>
      </div>
    </div>
  )
}

export default Profile