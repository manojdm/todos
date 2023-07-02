import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

const login = () => {

    const router = useRouter();

    const { user, error: userError, isLoading } = useUser();

    useEffect(() => {

        if(!isLoading && !user){
            router.push('/api/auth/login')
        } else {
            router.push('/dashboard')
        }
    }, [isLoading])

  return (
<div className="login-section card">
    <div className="title">Login to your account</div>
    <div className="form-container">
        <form>
            <div className="form-div">
                <label>username</label>
                <input type="text" />
            </div>
            <div className="form-div">
                <label>password</label>
                <input type="password" />
            </div>
            <div className="form-div submit">
                <input type="submit" value="login" />
            </div>
        </form>
    </div>
</div>
  )
}

export default login