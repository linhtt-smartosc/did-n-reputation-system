import { useForm } from 'react-hook-form';

const Home = () => {
  const {
    login,
    handleSubmit,
    watch,
    formState: { error },
  } = useForm();

  const onSubmit = async (data) => {

  }

  return (
    <>
      <div className="hero bg-base-200 min-h-screen bg-gradient-to-r from-purple-100 via-blue-200 to-purple-200">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div>
            <h1 className="text-5xl font-bold">From physical realm to digital persona!</h1>
            <p className="text-xl py-5">
              Create your DID, verifiable credentials and manage your own reputation.
            </p>
            <a href='#login-section' className="btn btn-primary">Get Started</a>
          </div>
        </div>
      </div>
      <div id='login-section' className="h-screen text-center content-center">
        <h1 className='m-10 text-5xl font-bold'>Get started!</h1>
        <div class=" card m-auto bg-base-100 w-96 shadow-xl">
          <form className="card-body">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold">Password</span>
              </label>
              <input type="password" placeholder="password" className="input input-bordered" required />
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-primary">Login</button>
            </div>
            <div className="divider">Or</div>
            <div className="form-control">
              <button className="btn btn-primary">Connect a wallet</button>
            </div>
          </form>
        </div>
      </div>
    </>

  )
}

export default Home