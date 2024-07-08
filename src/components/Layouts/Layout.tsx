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
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import {
    FormattedMenu,
    linkTo,
    nestedMenu,
    enter,
    leave,
} from "../../app/side-menu";
import Lucide from "../Base/Lucide";

import clsx from "clsx";
import SimpleBar from "simplebar";
import { Menu } from "../Base/Headless";
import QuickSearch from "../QuickSearch";
import SwitchAccount from "../SwitchAccount";
import NotificationsPanel from "../NotificationsPanel";
import ActivitiesPanel from "../ActivitiesPanel";



//Slider
import Sliders from "./slider";

function Layout({ children }) {
    const dispatch = useAppDispatch();
    const compactMenu = useAppSelector(selectCompactMenu);
    const setCompactMenu = (val: boolean) => {
        localStorage.setItem("compactMenu", val.toString());
        dispatch(setCompactMenuStore(val));
    };
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
    const sideMenuStore = useAppSelector(selectSideMenu);
    const sideMenu = () => nestedMenu(sideMenuStore, router.asPath);
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

        setFormattedMenu(sideMenu());
        compactLayout();

        window.onresize = () => {
            compactLayout();
        };
    }, [sideMenuStore, router.asPath]);

    return (
        <div
            className={clsx([
                "hook",
                "before:content-[''] bg-before:z-[-1] before:w-screen before:bg-gradient-to-b before:from-theme-1 before:to-theme-2 before:top-0 before:h-screen before:fixed before:bg-fixed",
            ])}
        >
            <div
                className={clsx([
                    "xl:ml-0 shadow-xl transition-[margin] duration-300 xl:shadow-none fixed top-0 left-0 z-50 side-menu group",
                    "after:content-[''] after:fixed after:inset-0 after:bg-black/80 after:xl:hidden",
                    // { "side-menu--collapsed": compactMenu },
                    { "side-menu--on-hover": compactMenuOnHover },
                    { "ml-0 after:block": activeMobileMenu },
                    { "-ml-[275px] after:hidden": !activeMobileMenu },
                ])}
            >
                <Sliders />
                <div
                    className={clsx([
                        "fixed h-[65px] transition-[margin] duration-100 xl:ml-[275px] group-[.side-menu--collapsed]:xl:ml-[90px] mt-3.5 inset-x-0 top-0",
                        "before:content-[''] before:mx-5 before:absolute before:top-0 before:inset-x-0 before:-mt-[15px] before:h-[20px] before:backdrop-blur",
                    ])}
                >
                    <header className="bg-white">
                        <nav className="mx-auto flex max-w-7xl items-center justify-between p-5 lg:px-8" aria-label="Global">


                        </nav>
                    </header>

                    <nav aria-label="Breadcrumb" className="p-3">
                        <ol className="flex items-center space-x-2">
                            <li className="flex items-center">
                                <a href="#" className="inline-flex items-center text-purple-500 hover:text-purple-700">
                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
                                    <span className="ml-1">Home</span>
                                </a>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <span className="text-gray-500">/</span>
                                    <a href="#" className="ml-1 text-gray-500 hover:text-gray-700">Projects</a>
                                </div>
                            </li>
                            <li aria-current="page">
                                <div className="flex items-center">
                                    <span className="text-gray-500">/</span>
                                    <span className="ml-1 text-gray-700">Marketing</span>
                                </div>
                            </li>
                        </ol>
                    </nav>

                    {children}
                </div>
            </div>
            <div
                className={clsx([
                    "relative transition-[margin,width] duration-100 px-5 pt-[66px] pb-16",
                    "before:content-[''] before:bg-gradient-to-b before:from-theme-1 before:to-theme-2 before:h-screen before:w-full before:fixed before:top-0 before:-ml-5",
                    "after:content-[''] after:bg-gradient-to-b after:from-slate-100 after:to-slate-50 after:h-screen after:w-full after:fixed after:top-0 after:-ml-5 after:xl:rounded-[1.2rem/1.7rem]",
                    { "xl:ml-[275px]": !compactMenu },
                    { "xl:ml-[91px]": compactMenu },
                ])}
            >

            </div>
        </div>
    );
}


export default Layout