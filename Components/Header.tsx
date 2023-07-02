import Link from 'next/link'
import React from 'react'
import { useUser } from '@auth0/nextjs-auth0/client';

const Header = () => {
    const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  
  return (
    <div className="home-nav-bar">
        <nav>
            <div className="title">
                <Link href='/'>TODO APP</Link>
            </div>
            <div className="nav-items">
                <ul>
                    {!user || !user.email ?
                    <>
                        <li className="item current"><Link href='/api/auth/login'>Login</Link></li>
                        <li className="item"><Link href="/api/auth/login">Sign up</Link></li>
                    </> :
                    <>
                        <li className="item current"><Link href='/dashboard'>Dashboard</Link></li>
                        <li className="item"><Link href="/new">Create Todo</Link></li>
                    </>    
                    }

                </ul>
            </div>
        </nav>
    </div>
  )
}

export default Header