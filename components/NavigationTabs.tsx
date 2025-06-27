"use client";
import { navigationtab } from '@/types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavigationTabs = () => {    
  const pathname = usePathname();
    //const { results } = useModeration();
  return (
    <div className="flex flex-wrap gap-1 mb-8 bg-white rounded-lg p-1 shadow-sm">
      {navigationtab.map(({route, label, imgURL }) => {
            const Icon = imgURL;
            const isActive = (route !== "/app2" && pathname.includes(route) && route.length > 1) || pathname === route;
            return <Link href={route} key={label} className={`flex items-center space-x-2 px-4 py-3 rounded-md font-medium transition-all' 
            ${isActive ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
                <Icon size={20} />                
                <p>{label}</p>
            </Link>
        })}          
        </div>
  )
}

export default NavigationTabs