"use client";
import { Slideover } from "@/components/Base/Headless";
import Button from "@/components/Base/Button";
import Lucide from "@/components/Base/Lucide";

import users from "@/fakers/users";
import _ from "lodash";

interface MainProps {
  notificationsPanel: boolean;
  setNotificationsPanel: (val: boolean) => void;
}

function Main(props: MainProps) {
  return (
    <div>
      <Slideover
        open={props.notificationsPanel}
        onClose={() => {
          props.setNotificationsPanel(false);
        }}
      >
        <Slideover.Panel className="w-72 rounded-[0.75rem_0_0_0.75rem/1.1rem_0_0_1.1rem]">
          <a
            href=""
            className="focus:outline-none hover:bg-white/10 bg-white/5 transition-all hover:rotate-180 absolute inset-y-0 left-0 right-auto flex items-center justify-center my-auto -ml-[60px] sm:-ml-[105px] border rounded-full text-white/90 w-8 h-8 sm:w-14 sm:h-14 border-white/90 hover:scale-105"
            onClick={(e) => {
              e.preventDefault();
              props.setNotificationsPanel(false);
            }}
          >
            <Lucide className="w-8 h-8 stroke-[1]" icon="X" />
          </a>
          <Slideover.Title className="px-6 py-5">
            <h2 className="mr-auto text-base font-medium">Notifications</h2>
            <Button variant="outline-secondary" className="hidden sm:flex">
              <Lucide icon="ShieldCheck" className="w-4 h-4 mr-2" /> Mark all as
              read
            </Button>
          </Slideover.Title>
          <Slideover.Description className="p-0">
            <div className="flex flex-col p-3 gap-0.5">
             
            </div>
          </Slideover.Description>
        </Slideover.Panel>
      </Slideover>
    </div>
  );
}

export default Main;
