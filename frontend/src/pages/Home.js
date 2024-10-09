import { set, useForm } from 'react-hook-form';
import connectWallet from '../utils/connectWallet.util';
import { useSelector, useDispatch } from 'react-redux';
import { setUser, unsetUser } from '../redux/slices/users.slice';
import { useNavigate } from 'react-router-dom';
import useAlert from '../hooks/useAlert';

const Home = () => {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setAlert } = useAlert();

  const connect = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'CONNECT_WALLET' });
      setAlert('Connected to wallet!', 'success');
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      setAlert('error', 'Error connecting wallet');
    }
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
            {
              !user.account ?
                <a href='#login-section' className="btn btn-primary">Get Started</a>
                : <a href='/dashboard' className="btn btn-primary">Get Started</a>
            }
          </div>
        </div>
      </div>
      {/* { */}
        {/* !user.account ?  */}
          <div id='login-section' className="h-screen flex">
            <div className="w-1/2 content-center bg-gradient-to-r from-blue-100 via-purple-200 to-blue-200">
              <h1 className='text-5xl font-bold mx-10'>Take Control of Your Digital Life</h1>
              <h4 className='text-xl italic mt-3 mx-10'>Own Your Identity, Build Your Reputation. Connect to continue!</h4>
            </div>
            <div className='w-1/2 text-center content-center'>
              <h1 className='m-10 text-5xl font-bold'>Get started!</h1>
              <div class=" card m-auto bg-base-100 w-96 shadow-xl">
                <form className="card-body">
                  <button className="btn btn-primary" onClick={(e) => connect(e)}>
                    Connect to Metamask
                  </button>
                </form>
              </div>
            </div>
          </div> 
          {/* : <></> */}
      {/* } */}
    </>

  )
}

export default Home