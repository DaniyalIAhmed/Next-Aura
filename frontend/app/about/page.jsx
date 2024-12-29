"use client";
import Toast from '@/components/Toast';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const About = () => {
  const user = useSelector((state) => state.user.user);
  const [closeD, setCloseD] = useState(false);

  useEffect(() => {
    if (user && user.user_id) {
      console.log('User ID:', user.user_id);
    }
  }, [user]);

  return (
    <Toast msg="Logged in" closeD={closeD} setCloseD={setCloseD}/>
  )
}

export default About
