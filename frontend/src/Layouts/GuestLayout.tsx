import { type PropsWithChildren } from 'react'
import Navbar from '../Components/Navbar'

const GuestLayout = ({children}: PropsWithChildren) => {
  return (
    <div className="min-h-screen dark:bg-gray:800">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}

export default GuestLayout
