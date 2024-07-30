"use client";
import "@/assets/css/vendors/simplebar.css";
import "@/assets/css/themes/hook.css";
//lib
import Link from 'next/link'

import { useRouter } from 'next/navigation';
//

//component
import GroupPurchase from '@/components/CS/Content/GroupPurchase'


function PurchaseDetail({ params }: { params: { id: string } }) {

  const id = params.id;


  // const { id }: {
  //   id: string
  // } = useParams();


  return (
    <>
      <nav aria-label="Breadcrumb" className="p-5">
        <ol className="flex items-center space-x-2">
          <li className="flex items-center">
            <a href="#" className="inline-flex items-center text-gray-500 hover:text-gray-700">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
              <span className="ml-1">Dashboard</span>
            </a>
          </li>
          <li>
            <div className="flex items-center">
              <span className="text-gray-500">/</span>
              <Link
                  href="/cs/purchase"
                 className="ml-1 text-gray-500 hover:text-gray-700">รายการจาก Sale</Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <span className="text-gray-500">/</span>
              <span className="ml-1 text-gray-700">รายละเอียด</span>
            </div>
          </li>
        </ol>
      </nav>

      <GroupPurchase id={id}></GroupPurchase>
    </>
  );
}

export default PurchaseDetail;
