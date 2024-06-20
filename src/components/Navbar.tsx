'use client'
import { useSession,signOut } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'
import {User}from 'next-auth'
import { Button } from './ui/button';


function Navbar() {
  const { data:session } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className="p-4 md:p-6 shadow-md ">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="#"  className="text-xl font-bold mb-4 md:mb-0">Annoymous Message</a>
        {
          session ? (
            <>
            <span> Welcome , {user.username}</span>
            <Button className="w-full md:w-auto bg-slate-100 text-black" variant='outline' onClick={(()=>signOut())}>Logout</Button>
            </>
            
          ) : (<>
              <Link href='/sign-in'>
                <Button className="w-full md:w-auto bg-slate-100 text-black" variant={'outline'}>Login</Button>
              </Link>
          </>)
        }
      </div>

    </nav>
  )
}

export default Navbar