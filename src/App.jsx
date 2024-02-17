import * as Cesium from 'cesium';
import './App.css'
import { Viewer } from 'resium'

Cesium.Ion.defaultAccessToken = import.meta.env.VITE_ION_TOKEN;

function App() {
  return (
    <Viewer full />
  )
}

export default App
