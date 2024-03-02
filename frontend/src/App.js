import './css/App.css'
import Nav from './components/Nav';
import Carousal from './pages/Carousal';
import { Route,Routes } from 'react-router-dom';
import Login from './pages/Login'
import Signin from './pages/Signin';
import { Cardprovider } from './components/Contexred';
import Cart from './pages/Cart';
import Footer from '../src/components/Fotter';
import MyOrder from './pages/MyOrder';
import TermsAndConditions from './About/Term';
import PrivacyPolicy from './About/Privacy';
import Forget from './pages/Forget'
import Myacc from './pages/Myacc'
function App() {
  return (
    <Cardprovider>
       
        <Nav/>
        <Routes>
          <Route path='/'element={<Carousal/>}/>
          <Route path='/login'element={<Login/>}/>
          <Route path='/createuser'element={<Signin/>}/>
          <Route path='/allordersmy'element={<MyOrder/>}/>
          <Route path='/asd' element={<Cart/>}/>
          <Route path='/term' element={<TermsAndConditions/>}/>
          <Route path='/policy' element={<PrivacyPolicy/>}/>
          <Route path='/forgetpassword' element={<Forget/>}/>
          <Route path={`/myprofile/${localStorage.getItem('uid')}`} element={<Myacc/>}/>
        </Routes>
        <Footer/>
    </Cardprovider>
      
        
        
    
  );
}

export default App;
