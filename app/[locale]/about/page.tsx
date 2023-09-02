'use client'
import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { setUser } from '../../../store/user/reducer';
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";

function HomePage() {
  const userNameRef = useRef<HTMLInputElement>(null);
  const userEmailRef = useRef<HTMLInputElement>(null);
  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();

  const handleSetUser = () => {
    const name = userNameRef.current?.value;
    const email = userEmailRef.current?.value
    dispatch(setUser({ name, email }));
  };

  return (
    <div>
      <Input type="name" label="Name" placeholder="Enter your name" ref={userNameRef} defaultValue={user.name} />
      <Input type="email" label="Email" placeholder="Enter your email" ref={userEmailRef} defaultValue={user.email} />
      <Button onClick={handleSetUser}>Set User</Button>
    </div>
  );

}
export default HomePage;
