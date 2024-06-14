import './App.css'
import { Icon } from '@iconify/react'
function App() {

  return (
    <>
      <svg>
        <use xlinkHref='#icon-icon1'></use>
      </svg>
      <svg>
        <use xlinkHref='#icon-icon2'></use>
      </svg>
      <svg>
        <use xlinkHref='#icon-icon3'></use>
      </svg>
      <svg>
        <use xlinkHref='#icon-icon4'></use>
      </svg>
      <svg>
        <use xlinkHref='#icon-icon5'></use>
      </svg>
      <svg>
        <use xlinkHref='#icon-icon6'></use>
      </svg>
      <Icon icon="fa:check" />
      <Icon icon="fa:reddit" />
      <Icon icon="ant-design:check-circle-outlined" />
      <svg>
        <use xlinkHref='#fa6-regular-circle-check'></use>
      </svg>
      <svg>
        <use xlinkHref='#fa6-regular-chess-bishop'></use>
      </svg>
      <svg>
        <use xlinkHref='#fa6-regular-file-video'></use>
      </svg>
    </>
  )
}

export default App
