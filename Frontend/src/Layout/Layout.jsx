import React from 'react'
import Route from '../Route/Route.jsx'
import Header from '../Components/Pages/Header/Header.jsx'
import Footer from '../Components/Pages/Footer/Footer.jsx'

const Layout = () => {
  return (
    <div>
      <Header/>
        <main>
        <Route/>
        </main>
        <Footer/>
    </div>
  )
}

export default Layout
