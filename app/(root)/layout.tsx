"use client";

import React from 'react';
import Image from "next/image";
/* import MobileNav from '@/components/MobileNav'; */
import { Header } from '@/components/Header';
import NavigationTabs from '@/components/NavigationTabs';
import Footer from '@/components/Footer';


const RootLayout = ({ children, }: Readonly<{ children: React.ReactNode; }>) => {
    
  return (
    <div className='relative flex flex-col'>
        <main className='relative'>
          <section>
            <Header />
            {/* <ProcessingIndicator isProcessing={isProcessing} /> */}
          </section>          
            {/* <LeftSidebar /> */}
            <section className="flex flex-1 flex-col px-4 sm:px-36">   
              <NavigationTabs />           
              <div className="mx-auto flex w-full flex-col max-sm:px-4">                   
                <div className="flex h-16 items-center justify-between md:hidden">                  
                  <Image 
                    src="/icons/logo.svg"
                    width={50}
                    height={50}
                    alt="Menu icon"
                  />   
                  {/* <MobileNav/>                   */}
                  
                </div>
                <div className="flex flex-col md:pb-14">
                  {children}
                </div>
              </div>
            </section>
            <section>
              <Footer/>
            </section>
        </main>        
    </div>
  )
}

export default RootLayout