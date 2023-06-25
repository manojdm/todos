import React from 'react'

const login = () => {
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