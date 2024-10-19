import { FC } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from '../components'

export const DefaultLayout:FC = () => {
  return (
    <div className='border h-screen w-screen'>
      <Header />
      <div>
      <Outlet />
      </div>
      </div>
  )
}
