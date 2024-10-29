

export interface TabStatus {
    id: string;
    tabName: string;
    tabKey: string;
    active: boolean;
    type: string;
}

export const tab : TabStatus[] = [
        {
            id: "1",
            tabName: "จองตู้",
            tabKey: "Bookcabinet",
            active :false,
            type:"create"
        },
        {
            id: "2",
            tabName: "รับตู้",
            tabKey: "Receive",
            active :false,
            type:"create"
        },
        {
            id: "3",
            tabName: "บรรจุตู้",
            tabKey: "Contain",
            active :false,
            type:"view"
        },
        {
            id: "4",
            tabName: "จัดทำเอกสาร",
            tabKey: "Document",
            active :false,
            type:"view"
        },
        {
            id: "5",
            tabName: "ยืนยันวันออกเดินทาง",
            tabKey: "proveDeparture",
            active :false,
            type:"view"
        },
        {
            id: "6",
            tabName: "ออกเดินทาง",
            tabKey: "Departure",
            active :false,
            type:"view"
        },
        {
            id: "7",
            tabName: "รอตรวจปล่อย",
            tabKey: "Release",
            active :false,
            type:"view"
        },
        {
            id: "8",
            tabName: "ตรวจปล่อยเรียบร้อย",
            tabKey: "SuccessRelease",
            active :false,
            type:"view"
        },
        {
            id: "9",
            tabName: "จัดส่งปลายทาง",
            tabKey: "Destination",
            active :false,
            type:"view"
        },
        {
            id: "10",
            tabName: "ส่งเรียบร้อย",
            tabKey: "sentAlready",
            active :false,
            type:"view"
            
        },
        {
            id: "11",
            tabName: "คืนตู้",
            tabKey: "Return",
            active :false,
            type:"view"
        },
    ];