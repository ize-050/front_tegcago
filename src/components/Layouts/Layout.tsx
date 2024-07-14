"use client";
import "@/assets/css/vendors/simplebar.css";
import "@/assets/css/themes/hook.css";
import { Transition } from "react-transition-group";
import Breadcrumb from "..//Base/Breadcrumb";
import { useState, useEffect, createRef } from "react";
import { selectSideMenu } from "../../stores/sideMenuSlice";
import {
    selectCompactMenu,
    setCompactMenu as setCompactMenuStore,

} from "../../stores/compactMenuSlice";
import classNames from 'classnames';

import { useRouter, usePathname, redirect } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import {
    FormattedMenu,

} from "../../app/side-menu";

import clsx from "clsx";
import SimpleBar from "simplebar";
import { getSession, signIn, signOut } from "next-auth/react";


//Slider 
import Sliders from "./slider";

//ToastComponent

import ToastComponent from "./toastComponents";

function Layout({ children }:any) {
    const dispatch = useAppDispatch();
    const pathname = usePathname();
    const compactMenu = useAppSelector(selectCompactMenu);
    const setCompactMenu = (val: boolean) => {
        localStorage.setItem("compactMenu", val.toString());
        dispatch(setCompactMenuStore(val));
    };
    const [opened, setOpened] = useState(false);
    const [quickSearch, setQuickSearch] = useState(false);
    const [switchAccount, setSwitchAccount] = useState(false);
    const [notificationsPanel, setNotificationsPanel] = useState(false);
    const [activitiesPanel, setActivitiesPanel] = useState(false);
    const [compactMenuOnHover, setCompactMenuOnHover] = useState(false);
    const [activeMobileMenu, setActiveMobileMenu] = useState(false);


    const router = useRouter();
    const [formattedMenu, setFormattedMenu] = useState<
        Array<FormattedMenu | string>
    >([]);
    const sideMenu = useAppSelector(selectSideMenu);
    // const sideMenu = () => nestedMenu(sideMenuStore, pathname);
    const scrollableRef = createRef<HTMLDivElement>();

    const toggleCompactMenu = (event: React.MouseEvent) => {
        event.preventDefault();
        setCompactMenu(!compactMenu);
    };

    const compactLayout = () => {
        if (window.innerWidth <= 1600) {
            setCompactMenu(true);
        }
    };

    const requestFullscreen = () => {
        const el = document.documentElement;
        if (el.requestFullscreen) {
            el.requestFullscreen();
        }
    };

    useEffect(() => {
        if (scrollableRef.current) {
            new SimpleBar(scrollableRef.current);
        }

        // setFormattedMenu(sideMenu());
        compactLayout();

        window.onresize = () => {
            compactLayout();
        };
    }, [pathname]);

    useEffect(()=>{

    const sessions =async()=>{
        const session = await getSession()
        console.log('session',session)
        if(session === null) {
           router.push('/login')
        }
    }
     sessions()
     },[])

    return (
//xl:ml-0 shadow-xl transition-[margin] duration-300 xl:shadow-none  top-0 left-0 z-50 side-menu group


        <div
            className={clsx([
                "flex h-screen after:bg-white-200",
                // "after:fixed after:inset-0 after:bg-black/80 after:xl:hidden",
                // { "side-menu--collapsed": compactMenu },
                { "side-menu--on-hover": compactMenuOnHover },
                { "ml-0 after:block": activeMobileMenu },
                // { "-ml-[275px] after:hidden": !activeMobileMenu },
            ])}
        >
            
            <div className={`transition-transform duration-500 ease-in-out  ${!opened ? "translate-x-0 w-275 " : "-translate-x-full   hidden"
                }`}>
                <Sliders />
            </div>
            
            <div className={`flex-grow overflow-y-auto transition-all duration-300 ease-in-out ${!opened ? "" : "w-full"
                }`}
                style={{
                    background:"#FAFAFA"
                }}
                >
               
                <header className="bg-white">
                    <nav className="mx-auto   items-center  p-5 lg:px-8" aria-label="Global">
                        <ul className="flex items-end  text-blue-200"> {/* Add justify-between to the parent ul */}
                            <li className="flex-col">
                                <div className={classNames(`tham tham-e-squeeze tham-w-6`, { 'tham-active': opened })}>
                                    <div className="tham-box">
                                        <div className="tham-inner" onClick={() => {
                                            setOpened(!opened)
                                        }} />
                                    </div>
                                </div>
                            </li>
                            <li className="ml-auto flex-col-reverse text-blue-400"> {/* No need for flex-1 */}
                                Test2
                            </li>
                        </ul>
                    </nav>
                </header>

                <hr></hr>

                
                                            
                {children}
            </div>
        </div>

    );
}


export default Layout