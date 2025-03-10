"use client";
import "@/assets/css/vendors/simplebar.css";
import "@/assets/css/themes/hook.css";
import { Transition } from "react-transition-group";
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { useState, useEffect, createRef } from "react";
import { selectSideMenu } from "../../stores/sideMenuSlice";
import {
  selectCompactMenu,
  setCompactMenu as setCompactMenuStore,
} from "../../stores/compactMenuSlice";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import {
  FormattedMenu,
  nestedMenu,
  enter,
  leave,
} from "../../app/side-menu";
import Lucide from "../Base/Lucide";

import clsx from "clsx";
import SimpleBar from "simplebar";
import Link from "next/link";


function Slider() {
  const session: any = useSession()
  const dispatch = useAppDispatch();
  const compactMenu = useAppSelector(selectCompactMenu);
  const setCompactMenu = (val: boolean) => {
    localStorage.setItem("compactMenu", val.toString());
    dispatch(setCompactMenuStore(val));
  };
  const [activeMobileMenu, setActiveMobileMenu] = useState(false);

  const router = useRouter();

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleSubMenu = (menuId: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    const newOpenMenus: Record<string, boolean> = {};
    if (!openMenus[menuId]) {
      newOpenMenus[menuId] = true;
    }
    setOpenMenus(newOpenMenus);
  };

  const handleItemClick = (path: any) => (event: any) => {
    event.preventDefault();
    router.push(path);
    router.refresh()
  };


  const [formattedMenu, setFormattedMenu] = useState<
    Array<FormattedMenu | string>
  >([]);
  const pathname = usePathname()


  const { menuSale, menuCs  ,menuSuperadmin , menuFinance} = useAppSelector(selectSideMenu);

  const [sideMenuStore, setSideMenuStore] = useState<any>();

  const sideMenu = () => nestedMenu(sideMenuStore, pathname);
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



  useEffect(() => {
    if (scrollableRef.current) {
      new SimpleBar(scrollableRef.current);
    }
    setFormattedMenu(sideMenu());
    compactLayout();

    window.onresize = () => {
      compactLayout();
    };
  }, [sideMenuStore, pathname]);


  useEffect(() => {
    if (session?.data?.role == "Sales") {
      setSideMenuStore(menuSale)
    }
   
    else if(session?.data?.role == "Cs") {
      setSideMenuStore(menuCs)
    }
    else if(session?.data?.role == "SuperAdmin") {
      setSideMenuStore(menuSuperadmin)
    }
    else if(session?.data?.role == "Finance"){
      setSideMenuStore(menuFinance)
    }
    console.log("session", session?.data?.role)
  }, [session]);

  console.log("formattedMenu", formattedMenu)
  return (
    <>
      <div
        className={clsx([
          // "fixed ml-[275px] w-10 h-10 items-center justify-center xl:hidden z-50",
          { flex: activeMobileMenu },
          { hidden: !activeMobileMenu },
        ])}
      >
        <a
          href=""
          onClick={(event) => {
            event.preventDefault();
            setActiveMobileMenu(false);
          }}
          className="mt-5 ml-5"
        >
          <Lucide icon="X" className="w-8 h-8 text-white" />
        </a>
      </div>
      <div
        className={clsx([
          "z-20 relative w-[275px] border-slate-200/80 duration-300 transition-[width] group-[.side-menu--collapsed]:xl:w-[91px] group-[.side-menu--collapsed.side-menu--on-hover]:xl:shadow-[6px_0_12px_-4px_#0000000f] group-[.side-menu--collapsed.side-menu--on-hover]:xl:w-[275px] h-screen flex flex-col",
          "before:content-[''] before:absolute before:inset-0  before:bg-gradient-to-b before:from-theme-1 before:to-theme-2 before:border-slate-200/80 before:group-[.side-menu--collapsed.side-menu--on-hover]:xl:shadow-[6px_0_12px_-4px_#0000000f]",
          "after:content-[''] after:absolute after:inset-0 after:xl:-mr-4 after:bg-texture-white after:bg-contain after:bg-fixed after:bg-[center_-20rem] after:bg-no-repeat",
        ])}
        onMouseOver={(event) => {
          event.preventDefault();
         // setCompactMenuOnHover(true);
        }}
        onMouseLeave={(event) => {
          event.preventDefault();
         // setCompactMenuOnHover(false);
        }}
      >
        <div
          style={{
            background: "#1D3154"
          }}
          className="flex-none hidden xl:flex items-center z-10 px-5 h-[65px] w-[275px] overflow-hidden relative duration-300 group-[.side-menu--collapsed]:xl:w-[91px] group-[.side-menu--collapsed.side-menu--on-hover]:xl:w-[275px]">
          <a
            href=""
            className="flex items-center  transition-[margin] duration-300 group-[.side-menu--collapsed]:xl:ml-4 group-[.side-menu--collapsed.side-menu--on-hover]:xl:ml-0"
          >
            <div
              style={{ margin: "auto" }}
              className="transition-transform ease-in-out group-[.side-menu--collapsed.side-menu--on-hover]:xl:-rotate-180">

              <Image alt="ttt" src="/logo.png" width="150" height="150"></Image>

            </div>
            <div className="ml-3.5 b group-[.side-menu--collapsed.side-menu--on-hover]:xl:opacity-100 group-[.side-menu--collapsed]:xl:opacity-0 transition-opacity font-medium text-white">

            </div>
          </a>
          <a
            href=""
            onClick={toggleCompactMenu}
            className="group-[.side-menu--collapsed.side-menu--on-hover]:xl:opacity-100 group-[.side-menu--collapsed]:xl:rotate-180 group-[.side-menu--collapsed]:xl:opacity-0 transition-[opacity,transform] hidden 3xl:flex items-center justify-center w-[20px] h-[20px] ml-auto border rounded-full border-white/40 text-white hover:bg-white/5"
          >
            <Lucide icon="ArrowLeft" className="w-3.5 h-3.5 stroke-[1.3]" />
          </a>
        </div>
        <div
          ref={scrollableRef}
          style={{
            background: "linear-gradient(0.44deg, #213269 -15.38%, #4D799D 95.26%),linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2))"
          }}
          className={clsx([
            "w-full h-full  z-20 px-5 overflow-y-auto overflow-x-hidden pb-3 [-webkit-mask-image:-webkit-linear-gradient(top,rgba(0,0,0,0),black_30px)] [&:-webkit-scrollbar]:w-0 [&:-webkit-scrollbar]:bg-transparent",
            "[&_.simplebar-content]:p-0 [&_.simplebar-track.simplebar-vertical]:w-[10px] [&_.simplebar-track.simplebar-vertical]:mr-0.5 [&_.simplebar-track.simplebar-vertical_.simplebar-scrollbar]:before:bg-slate-400/30",
          ])}
        >
          <ul className="scrollable mt-5">
            {/* BEGIN: First Child */}
            {formattedMenu.map((menu: any, menuKey) =>
              <li key={menuKey}>
                <a
                  href="#"
                  className={clsx([
                    // "side-menu__link",
                    // { "side-menu__link--active": menu.active },
                    // { "side-menu__link--active-dropdown": menu.activeDropdown },
                    "bg-white  text-white hover:text-gray-900",

                  ])}
                  onClick={menu?.subMenu?.length > 0 ? toggleSubMenu(menu.title) : handleItemClick(menu.pathname)}

                >
                  <div className={`
                     flex relative text-white  hover:text-gray-200
                     ${pathname === `${menu.pathname}` || pathname.startsWith(`${menu.pathname}/`) ? "bg-[#D2D6E14D] rounded-md pl-5" : 'pl-5'}`}
                  >
                    <Lucide
                      icon={menu.icon}
                      className="side-menu__link__icon mt-3"
                    />
                    <div className="side-menu__link__title p-3 ">{menu.title}</div>
                    {menu.subMenu && (
                      <div className="relative ml-auto">
                        <Lucide
                          icon="ChevronDown"
                          className={`
                            side-menu__link__chevron 
                            mt-3 
                            ${openMenus[menu.title] ? 'transform rotate-180' : ''}
                        `}
                        />

                        {openMenus[menu.title] && (
                          <ul className="submenu absolute right-0 top-full mt-2 w-60 bg-white text-gray-800 rounded-md shadow-lg z-[100]">
                            {menu.subMenu.map((subItem: any, index: number) => (
                              <li key={index} onClick={(e) => {
                                e.stopPropagation();
                                handleItemClick(subItem.pathname || '')(e);
                              }}>
                                <div
                                  className={`
                                            p-3 cursor-pointer hover:bg-gray-100
                                            ${pathname === `${subItem.pathname}` || pathname.startsWith(`${subItem.pathname}/`)
                                      ? "bg-[#D2D6E14D] rounded-md"
                                      : ''
                                    }
                                        `}
                                >
                                  {subItem.title}
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}

                  </div>
                </a>

              </li>

            )}

          </ul>
        </div>
      </div>
    </>
  )
}

export default Slider;
