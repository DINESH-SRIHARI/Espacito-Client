import './css/App.css'
import Nav from './components/Nav';
import Carousal from './pages/Carousal';
import { Route,Routes } from 'react-router-dom';
import Login from './pages/Login'
import Signin from './pages/Signin';
import { Cardprovider } from './components/Contexred';
import Cart from './pages/Cart';
import MyOrder from './pages/MyOrder';
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
        </Routes>

    </Cardprovider>
      
        
        
    
  );
}

export default App;
