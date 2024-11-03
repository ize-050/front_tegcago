import { get } from "lodash";
import axios from "../../axios";
import App from "next/app";

export const getCspurchase = async (id: any) => {
  return new Promise(async (resolve, reject) => {
    const url = `${process.env.NEXT_PUBLIC_URL_API}/cs_status/getDataCsStatus/${id}`;
    await axios
      .get(url)
      .then((res) => {
        if (res.status === 200) {
          resolve(res.data);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getEtc = async (id: any) => {
  return new Promise(async (resolve, reject) => {
    const url = `${process.env.NEXT_PUBLIC_URL_API}/cs_status/getEtc/${id}`;
    await axios
      .get(url)
      .then((res) => {
        if (res.status === 200) {
          resolve(res.data.data);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getReturn = async (id: any) => {
  return new Promise(async (resolve, reject) => {
    const url = `${process.env.NEXT_PUBLIC_URL_API}/cs_status/getReturn/${id}`;
    await axios
      .get(url)
      .then((res) => {
        if (res.status === 200) {
          resolve(res.data.data);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getBookcabinet = async (id: any) => {
  return new Promise(async (resolve, reject) => {
    const url = `${process.env.NEXT_PUBLIC_URL_API}/cs_status/getDataBookcabinet/${id}`;
    await axios
      .get(url)
      .then((res) => {
        if (res.status === 200) {
          resolve(res.data.data);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getContain = async (id: any) => {
  return new Promise(async (resolve, reject) => {
    const url = `${process.env.NEXT_PUBLIC_URL_API}/cs_status/getContain/${id}`;
    await axios
      .get(url)
      .then((res) => {
        if (res.status === 200) {
          resolve(res.data.data);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const serviceCreateBookcabinet = async (data: any) => {
  return new Promise(async (resolve, reject) => {
    const d_purchase_id = data.d_purchase_id;
    const url = `${process.env.NEXT_PUBLIC_URL_API}/cs_status/createBookcabinet/${d_purchase_id}`;
    const formData = new FormData();
    if (data.files.length > 0) {
      for (let i = 0; i < data.files.length; i++) {
        formData.append("book_picture", data.files[i]);
      }
    }
    delete data.files;
    for (const key in data) {
      if (data[key] !== undefined) {  // ตรวจสอบ undefined ก่อนเพิ่ม
        formData.append(key, data[key]);
      }
    }
    await axios
      .post(url, formData, {
        headers: {
          Accept: "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.status === 200) {
          resolve(res);
        }
      })
      .catch((err) => {
        console.log("errrr", err);
        reject(err);
      });
  });
};

export const serviceCreateReceive = async (data: any) => {
  return new Promise(async (resolve, reject) => {
    const d_purchase_id = data.d_purchase_id;
    const url = `${process.env.NEXT_PUBLIC_URL_API}/cs_status/createReceive/${d_purchase_id}`;
    const formData = new FormData();
    if (data.files.length > 0) {
      for (let i = 0; i < data.files.length; i++) {
        formData.append("receive_picture", data.files[i]);
      }
    }
    delete data.files;
    for (const key in data) {
      if (data[key] !== undefined) {  // ตรวจสอบ undefined ก่อนเพิ่ม
        formData.append(key, data[key]);
      }
    }
    await axios
      .post(url, formData, {
        headers: {
          Accept: "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.status === 200) {
          resolve(res);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const serviceReturncabinet = async (data: any) => {
  return new Promise(async (resolve, reject) => {
    const id = data.d_purchase_id;

    const url = `${process.env.NEXT_PUBLIC_URL_API}/cs_status/createReturn/${id}`;

    const formData = new FormData();

    console.log("dataReturn", data);

    if (data?.file_repair_cabinet.length > 0) {
      for (let i = 0; i < data?.file_repair_cabinet.length; i++) {
        formData.append("file_repair_cabinet", data.file_repair_cabinet[i]);
      }
      delete data.file_repair_cabinet;
    }

    if (data?.file_request_document_cabinet.length > 0) {
      for (let i = 0; i < data.file_request_document_cabinet.length; i++) {
        formData.append(
          "file_request_document_cabinet",
          data.file_request_document_cabinet[i]
        );
      }
      delete data.file_request_document_cabinet;
    }

    if (data?.file_document_cabinet.length > 0) {
      for (let i = 0; i < data.file_document_cabinet.length; i++) {
        formData.append("file_document_cabinet", data.file_document_cabinet[i]);
      }
      delete data.file_document_cabinet;
    }

    if (data?.file_request_deposit_cabinet.length > 0) {
      for (let i = 0; i < data.file_request_deposit_cabinet.length; i++) {
        formData.append(
          "file_request_deposit_cabinet",
          data.file_request_deposit_cabinet[i]
        );
      }
      delete data.file_request_deposit_cabinet;
    }

    if (data?.file_price_deposit.length > 0) {
      for (let i = 0; i < data.file_price_deposit.length; i++) {
        formData.append("file_price_deposit", data.file_price_deposit[i]);
      }
      delete data.file_price_deposit;
    }

    if (data?.file_return_deposit_cabinet.length > 0) {
      for (let i = 0; i < data.file_return_deposit_cabinet.length; i++) {
        formData.append(
          "file_return_deposit_cabinet",
          data.file_return_deposit_cabinet[i]
        );
      }
      delete data.file_return_deposit_cabinet;
    }

    for (const key in data) {
      if (data[key] !== undefined) {  // ตรวจสอบ undefined ก่อนเพิ่ม
        formData.append(key, data[key]);
      }
    }
    await axios
      .post(url, formData, {
        headers: {
          Accept: "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.status === 200) {
          resolve(res);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const serviceCreateContain = async (data: any) => {
  return new Promise(async (resolve, reject) => {
    const d_purchase_id = data.d_purchase_id;
    const url = `${process.env.NEXT_PUBLIC_URL_API}/cs_status/createContain/${d_purchase_id}`;
    const formData = new FormData();

    console.log("data", data);

    if (data?.cabinet?.length > 0) {
      for (let i = 0; i < data.cabinet.length; i++) {
        formData.append("cabinet", data.cabinet[i]);
      }
      delete data.cabinet;
    }

    if (data?.purchase_file?.length > 0) {
      for (let i = 0; i < data.purchase_file.length; i++) {
        formData.append("purchase_file", data.purchase_file[i]);
      }
      delete data.purchase_file;
    }

    if (data?.close_cabinet?.length > 0) {
      for (let i = 0; i < data.close_cabinet.length; i++) {
        formData.append("close_cabinet", data.close_cabinet[i]);
      }
      delete data.close_cabinet;
    }

    if (data?.etc?.length > 0) {
      for (let i = 0; i < data.etc.length; i++) {
        formData.append("etc", data.etc[i]);
      }
      delete data.etc;
    }

    if (data?.items?.length > 0) {
      formData.append("items", JSON.stringify(data.items));
      delete data.items;
    }

    for (const key in data) {
      if (data[key] !== undefined) {  // ตรวจสอบ undefined ก่อนเพิ่ม
        formData.append(key, data[key]);
      }
    }
    await axios
      .post(url, formData, {
        headers: {
          Accept: "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.status === 200) {
          resolve(res);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const serviceeditReturncabinet = async (data: any) => {
  return new Promise(async (resolve, reject) => {
    console.log("id",data)
    const id = data.id;

    delete data.id;

    const url = `${process.env.NEXT_PUBLIC_URL_API}/cs_status/editreturn/${id}`;

    const formData = new FormData();

    if (data?.file_repair_cabinet.length > 0) {
      data.file_repair_cabinet.forEach((image: any) => {
        if (image.status === "added" || image.status === "edited") {
          formData.append(
            "file_repair_cabinet",
            image.originalFile,
            image.name
          );
        } else if (image.status === "unchanged" && image.id) {
          formData.append("existingImageIds[]", image.id.toString());
        }
      });
      delete data.file_repair_cabinet;
    }

    if (data?.file_request_document_cabinet.length > 0) {
      data.file_request_document_cabinet.forEach((image: any) => {
        if (image.status === "added" || image.status === "edited") {
          formData.append(
            "file_request_document_cabinet",
            image.originalFile,
            image.name
          );
        } else if (image.status === "unchanged" && image.id) {
          formData.append("existingImageIds[]", image.id.toString());
        }
      });
      delete data.file_request_document_cabinet;
    }

    if (data?.file_document_cabinet.length > 0) {
      data.file_document_cabinet.forEach((image: any) => {
        if (image.status === "added" || image.status === "edited") {
          formData.append(
            "file_document_cabinet",
            image.originalFile,
            image.name
          );
        } else if (image.status === "unchanged" && image.id) {
          formData.append("existingImageIds[]", image.id.toString());
        }
      });
      delete data.file_document_cabinet;
    }

    if (data?.file_request_deposit_cabinet.length > 0) {
      data.file_request_deposit_cabinet.forEach((image: any) => {
        if (image.status === "added" || image.status === "edited") {
          formData.append(
            "file_request_deposit_cabinet",
            image.originalFile,
            image.name
          );
        } else if (image.status === "unchanged" && image.id) {
          formData.append("existingImageIds[]", image.id.toString());
        }
      });
      delete data.file_request_deposit_cabinet;
    }

    if (data?.file_price_deposit.length > 0) {
      data.file_price_deposit.forEach((image: any) => {
        if (image.status === "added" || image.status === "edited") {
          formData.append(
            "file_price_deposit",
            image.originalFile,
            image.name
          );
        } else if (image.status === "unchanged" && image.id) {
          formData.append("existingImageIds[]", image.id.toString());
        }
      });
      delete data.file_price_deposit;
    }

    if (data?.file_return_deposit_cabinet.length > 0) {
      data.file_return_deposit_cabinet.forEach((image: any) => {
        if (image.status === "added" || image.status === "edited") {
          formData.append(
            "file_return_deposit_cabinet",
            image.originalFile,
            image.name
          );
        } else if (image.status === "unchanged" && image.id) {
          formData.append("existingImageIds[]", image.id.toString());
        }
      });
    }

    for (const key in data) {
      if (data[key] !== undefined) {  // ตรวจสอบ undefined ก่อนเพิ่ม
        formData.append(key, data[key]);
      }
    }
    await axios
      .put(url, formData, {
        headers: {
          Accept: "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.status === 200) {
          resolve(res);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const serviceEditContain = async (data: any) => {
  return new Promise(async (resolve, reject) => {
    const id = data.id;

    delete data.id;

    const url = `${process.env.NEXT_PUBLIC_URL_API}/cs_status/editContain/${id}`;

    const formData = new FormData();

    console.log("dataedit", data.cabinet);

    if (data?.cabinet?.length > 0) {
      data.cabinet.forEach((image: any) => {
        if (image.status === "added" || image.status === "edited") {
          formData.append("cabinet", image.originalFile, image.name);
        } else if (image.status === "unchanged" && image.id) {
          formData.append("existingImageIds[]", image.id.toString());
        }
      });
      delete data.cabinet;
    }

    if (data?.purchase_file?.length > 0) {
      data.purchase_file.forEach((image: any) => {
        if (image.status === "added" || image.status === "edited") {
          formData.append("purchase_file", image.originalFile, image.name);
        } else if (image.status === "unchanged" && image.id) {
          formData.append("existingImageIds[]", image.id.toString());
        }
      });
      delete data.purchase_file;
    }

    if (data?.close_cabinet?.length > 0) {
      data.close_cabinet.forEach((image: any) => {
        if (image.status === "added" || image.status === "edited") {
          formData.append("close_cabinet", image.originalFile, image.name);
        } else if (image.status === "unchanged" && image.id) {
          formData.append("existingImageIds[]", image.id.toString());
        }
      });
      delete data.close_cabinet;
    }

    if (data?.etc?.length > 0) {
      data.etc.forEach((image: any) => {
        if (image.status === "added" || image.status === "edited") {
          formData.append("etc", image.originalFile, image.name);
        } else if (image.status === "unchanged" && image.id) {
          formData.append("existingImageIds[]", image.id.toString());
        }
      });
      delete data.etc;
    }

    if (data?.items?.length > 0) {
      formData.append("items", JSON.stringify(data.items));
      delete data.items;
    }

    for (const key in data) {
      if (data[key] !== undefined) {  // ตรวจสอบ undefined ก่อนเพิ่ม
        formData.append(key, data[key]);
      }
    }
    await axios
      .put(url, formData, {
        headers: {
          Accept: "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.status === 200) {
          resolve(res);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getReceive = async (id: any) => {
  return new Promise(async (resolve, reject) => {
    const url = `${process.env.NEXT_PUBLIC_URL_API}/cs_status/getDataReceive/${id}`;
    await axios
      .get(url)
      .then((res) => {
        if (res.status === 200) {
          resolve(res.data.data);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const createDocumentStatus = async (data: any) => {
  return new Promise(async (resolve, reject) => {
    const url = `${process.env.NEXT_PUBLIC_URL_API}/cs_status/createDocumentStatus/${data.d_purchase_id}`;
    const formData = new FormData();

    const dataRequest :any = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    );
  
  
    const files: any = {
      document_file_invoice: data?.document_file_invoice,
      document_packinglist: data?.document_packinglist,
      document_file_packing: data?.document_file_packing,
      document_FE: data?.document_FE,
      document_file_etc: data?.document_file_etc,
      document_approve: data?.document_approve,
      file_draft_invoice: data?.file_draft_invoice,
      document_BL: data?.document_BL,
      document_file_master_BL: data?.document_file_master_BL,
    };
    [
      "document_file_invoice",
      "document_packinglist",
      "document_file_packing",
      "document_FE",
      "document_file_etc",
      "document_approve",
      "file_draft_invoice",
      "document_BL",
    ].forEach((key) => delete data[key]);

    Object.keys(files).forEach((key: string) => {
      // ตรวจสอบว่า value ของคีย์นั้นเป็น array หรือไม่
      if (Array.isArray(files[key]) && files[key].length > 0) {
        appendFilesToFormData(formData, key, files[key]);
      }
    });
    Object.keys(dataRequest).forEach((key: string) => {
      formData.append(key, dataRequest[key]);
    });

    await axios
      .post(url, formData, {
        headers: {
          Accept: "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.status === 200) {
          resolve(res.data);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const editDocumentStatus = async (data:any)=>{
  return new Promise(async (resolve, reject) => {
  const dataRequest :any = Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined)
  );

  const files: any = {
    document_file_invoice: dataRequest?.document_file_invoice,
    document_packinglist: dataRequest?.document_packinglist,
    document_file_packing: dataRequest?.document_file_packing,
    document_FE: dataRequest?.document_FE,
    document_file_etc: dataRequest?.document_file_etc,
    document_approve: dataRequest?.document_approve,
    file_draft_invoice: dataRequest?.file_draft_invoice,
    document_BL: dataRequest?.document_BL,
    document_file_master_BL: dataRequest?.document_file_master_BL,
  };
  
  const keysToCheck = [
    "document_file_invoice",
    "document_packinglist",
    "document_file_packing",
    "document_file_master_BL",
    "document_FE",
    "document_file_etc",
    "document_approve",
    "file_draft_invoice",
    "document_BL",
  ];
  
  const formData = new FormData();

  Object.keys(dataRequest).forEach((key: string) => {
    formData.append(key, dataRequest[key]);
  });
  
  keysToCheck.forEach((key: string) => {
    if (Array.isArray(files[key]) && files[key].length > 0) {
      files[key].forEach((image: any) => {
        if (image.status === "added" || image.status === "edited") {
          formData.append(key, image.originalFile, image.name);
        } else if (image.status === "unchanged" && image.id) {
          formData.append("existingImageIds[]", image.id.toString());
        }
      });
    }
  });


  const url = `${process.env.NEXT_PUBLIC_URL_API}/cs_status/editDocumentStatus/${dataRequest.id}`;



  await axios
    .put(url, formData, {
      headers: {
        Accept: "multipart/form-data",
      },
    })
    .then((res) => {
      if (res.status === 200) {
        resolve(res.data);
      }
    })
    .catch((err) => {
      reject(err);
    });
});
  

}

export const getDocumentStatus = async (id: any) => {
  return new Promise(async (resolve, reject) => {
    const url = `${process.env.NEXT_PUBLIC_URL_API}/cs_status/getDocumentStatus/${id}`;
    await axios
      .get(url)
      .then((res) => {
        if (res.status === 200) {
          resolve(res.data.data);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const CreateDeparture = async (data: any) => {
  return new Promise(async (resolve, reject) => {
    const id = data.d_purchase_id;
    const url = `${process.env.NEXT_PUBLIC_URL_API}/cs_status/createDeparture/${id}`;
    await axios
      .post(url, data, {
        headers: {
          Application: "application/json",
        },
      })
      .then((res) => {
        if (res.status === 200) {
          resolve(res.data);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const UpdateDeparture = async (data: any) => {
  return new Promise(async (resolve, reject) => {
    const url = `${process.env.NEXT_PUBLIC_URL_API}/cs_status/updateDeparture/${data.id}`;
    await axios
      .put(url, data, {
        headers: {
          Application: "application/json",
        },
      })
      .then((res) => {
        if (res.status === 200) {
          resolve(res.data);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getDeparture = async (id: any) => {
  return new Promise(async (resolve, reject) => {
    const url = `${process.env.NEXT_PUBLIC_URL_API}/cs_status/getDeparture/${id}`;
    await axios
      .get(url)
      .then((res) => {
        if (res.status === 200) {
          resolve(res.data.data);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const CreateWaitrelease = async (data: any) => {
  return new Promise(async (resolve, reject) => {
    const id = data.d_purchase_id;
    const url = `${process.env.NEXT_PUBLIC_URL_API}/cs_status/createWaitrelease/${id}`;
    const formData = new FormData();

    if (data.files.length > 0) {
      for (let i = 0; i < data.files.length; i++) {
        formData.append("files", data.files[i]);
      }
    }
    delete data.files;
    for (const key in data) {
      formData.append(key, data[key]);
    }
    await axios
      .post(url, formData, {
        headers: {
          Accept: "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.status === 200) {
          resolve(res.data);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const EditWaitrelease = async (data: any) => {
  return new Promise(async(resolve, reject) => {
    const url =  `${process.env.NEXT_PUBLIC_URL_API}/cs_status/editWaitRelease/${data.id}`;
    const formData = new FormData();

    if (data.files.length > 0) {
    
          data.files.forEach((image: any) => {
            if (image.status === "added" || image.status === "edited") {
              formData.append('files', image.originalFile, image.name);
            } else if (image.status === "unchanged" && image.id) {
              formData.append("existingImageIds[]", image.id.toString());
            }
          });

    }

    delete data.files;



    for (const key in data) {
      if (data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    }
    await axios
      .put(url,formData,{
        headers: {
          Accept: "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.status === 200) {
          resolve(res.data);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getWaitrelease = async (id: any) => {
  return new Promise(async (resolve, reject) => {
    const url = `${process.env.NEXT_PUBLIC_URL_API}/cs_status/getWaitrelease/${id}`;
    await axios
      .get(url)
      .then((res) => {
        if (res.status === 200) {
          resolve(res.data.data);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const createSuccessRelease = async (data: any) => {
  return new Promise(async (resolve, reject) => {
    const url = `${process.env.NEXT_PUBLIC_URL_API}/cs_status/createSuccessRelease/${data.d_purchase_id}`;
    const formData = new FormData();
    const files: any = {
      file_do: data?.file_do,
      file_card: data?.file_card,
      file_return_document: data?.file_return_document,
    };
    ["file_do", "file_card", "file_return_document"].forEach(
      (key) => delete data[key]
    );

    Object.keys(files).forEach((key: string) => {
      // ตรวจสอบว่า value ของคีย์นั้นเป็น array หรือไม่
      if (Array.isArray(files[key]) && files[key].length > 0) {
        appendFilesToFormData(formData, key, files[key]);
      }
    });
    Object.keys(data).forEach((key: string) => {
      if (data[key] !== undefined) {  // ตรวจสอบ undefined ก่อนเพิ่ม
        formData.append(key, data[key]);
      }
    });

    await axios
      .post(url, formData, {
        headers: {
          Accept: "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.status === 200) {
          resolve(res.data);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};


export const updateSuccessRelease = async (data: any) => {

  return new Promise(async (resolve, reject) => {
    const formData = new FormData();
    const files: any = {
      file_do: data?.file_do,
      file_card: data?.file_card,
      file_return_document: data?.file_return_document,
    };
    ["file_do", "file_card", "file_return_document"].forEach(
      (key) => delete data[key]
    );

    const keysToCheck = [
      "file_do",
      "file_card",
      "file_return_document",
    ];

    keysToCheck.forEach((key: string) => {
      if (Array.isArray(files[key]) && files[key].length > 0) {
        files[key].forEach((image: any) => {
          if (image.status === "added" || image.status === "edited") {
            formData.append(key, image.originalFile, image.name);
          } else if (image.status === "unchanged" && image.id) {
            formData.append("existingImageIds[]", image.id.toString());
          }
        });
      }
    });
    Object.keys(files).forEach((key: string) => {
      if (Array.isArray(files[key]) && files[key].length > 0) {
        appendFilesToFormData(formData, key, files[key]);
      }
    });

    delete data.files;

    for (const key in data) {
      if (data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    }
    const url = `${process.env.NEXT_PUBLIC_URL_API}/cs_status/updateSuccessRelease/${data.id}`;
    await axios 
      .put(url,formData,{
        headers: {
          Accept: "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.status === 200) {
          resolve(res.data);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getSuccessRelease = async (id: any) => {
  return new Promise(async (resolve, reject) => {
    const url = `${process.env.NEXT_PUBLIC_URL_API}/cs_status/getSuccessRelease/${id}`;
    await axios
      .get(url)
      .then((res) => {
        if (res.status === 200) {
          resolve(res.data.data);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const createDestination = async (data: Partial<any>): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    const id = data.d_purchase_id;
    const url = `${process.env.NEXT_PUBLIC_URL_API}/cs_status/createDestination/${id}`;
    const formData = new FormData();

    if (data.files.length > 0) {
      for (let i = 0; i < data.files.length; i++) {
        formData.append("files", data.files[i]);
      }
    }
    delete data.files;
    for (const key in data) {
      formData.append(key, data[key]);
    }
    await axios
      .post(url, formData, {
        headers: {
          Accept: "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.status === 200) {
          resolve(res.data);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getDestination = async (id: any) => {
  return new Promise(async (resolve, reject) => {
    const url = `${process.env.NEXT_PUBLIC_URL_API}/cs_status/getDestination/${id}`;
    await axios
      .get(url)
      .then((res) => {
        if (res.status === 200) {
          resolve(res.data.data);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const createSendSuccess = async (data: Partial<any>): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    const id = data.d_purchase_id;
    const url = `${process.env.NEXT_PUBLIC_URL_API}/cs_status/createSendSuccess/${id}`;
    const formData = new FormData();

    if (data.files.length > 0) {
      for (let i = 0; i < data.files.length; i++) {
        formData.append("files", data.files[i]);
      }
    }
    delete data.files;
    for (const key in data) {
      formData.append(key, data[key]);
    }
    await axios
      .post(url, formData, {
        headers: {
          Accept: "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.status === 200) {
          resolve(res.data);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getSendsuccess = async (id: any) => {
  return new Promise(async (resolve, reject) => {
    const url = `${process.env.NEXT_PUBLIC_URL_API}/cs_status/getSendSuccess/${id}`;
    await axios
      .get(url)
      .then((res) => {
        if (res.status === 200) {
          resolve(res.data.data);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};


export const createLeave = async (data: any):Promise<any> => {
  return new Promise(async (resolve, reject) => {
    const url = `${process.env.NEXT_PUBLIC_URL_API}/cs_status/createLeave/${data.d_purchase_id}`;
    const formData = new FormData();
    const files: any = {
      file_hbl: data?.file_hbl,
      file_original_fe: data?.file_original_fe,
      file_surrender: data?.file_surrender,
      file_enter_doc: data?.file_enter_doc,
      file_payment_do: data?.file_payment_do,
      file_amount_payment_do: data?.file_amount_payment_do,
    };
    [
      "file_hbl",
      "file_original_fe",
      "file_surrender",
      "file_enter_doc",
      "file_payment_do",
      "file_amount_payment_do",
    ].forEach((key) => delete data[key]);

    Object.keys(files).forEach((key: string) => {
      // ตรวจสอบว่า value ของคีย์นั้นเป็น array หรือไม่
      if (Array.isArray(files[key]) && files[key].length > 0) {
        appendFilesToFormData(formData, key, files[key]);
      }
    });
    Object.keys(data).forEach((key: string) => {
      if (data[key] !== undefined) {  
        formData.append(key, data[key]);
      }
    });

    await axios
      .post(url, formData, {
        headers: {
          Accept: "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.status === 200) {
          resolve(res.data);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};


export const editLeave = async (data: any):Promise<any> => {
  return new Promise(async (resolve, reject) => {
    const url = `${process.env.NEXT_PUBLIC_URL_API}/cs_status/editLeave/${data.id}`;
    const formData = new FormData();

    const dataRequest :any = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    );
  
    const files: any = {
      file_hbl: dataRequest?.file_hbl,
      file_original_fe: dataRequest?.file_original_fe,
      file_surrender: dataRequest?.file_surrender,
      file_enter_doc: dataRequest?.file_enter_doc,
      file_payment_do: dataRequest?.file_payment_do,
      file_amount_payment_do: dataRequest?.file_amount_payment_do,
    };

  
    const keysToCheck = [
      "file_hbl",
      "file_original_fe",
      "file_surrender",
      "file_enter_doc",
      "file_payment_do",
      "file_amount_payment_do",
    ];

  
    Object.keys(dataRequest).forEach((key: string) => {
      if (data[key] !== undefined) {  
        formData.append(key, data[key]);
      }
    });
    
    keysToCheck.forEach((key: string) => {
      if (Array.isArray(files[key]) && files[key].length > 0) {
        files[key].forEach((image: any) => {
          if (image.status === "added" || image.status === "edited") {
            formData.append(key, image.originalFile, image.name);
          } else if (image.status === "unchanged" && image.id) {
            formData.append("existingImageIds[]", image.id.toString());
          }
        });
      }
    });

    await axios
    .put(url, formData, {
      headers: {
        Accept: "multipart/form-data",
      },
    })
    .then((res) => {
      if (res.status === 200) {
        resolve(res.data);
      }
    })
    .catch((err) => {
      reject(err);
    });


  });
};

export const getLeave = async (id: any) => {
  return new Promise(async (resolve, reject) => {
    const url = `${process.env.NEXT_PUBLIC_URL_API}/cs_status/getLeave/${id}`;
    await axios
      .get(url)
      .then((res) => {
        if (res.status === 200) {
          resolve(res.data.data);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const createEtc = async (data: any):Promise<any> => {
  return new Promise(async (resolve, reject) => {
    const url = `${process.env.NEXT_PUBLIC_URL_API}/cs_status/createEtc/${data.d_purchase_id}`;
    await axios
      .post(url, data, {
        headers: {
          Application: "application/json",
        },
      })
      .then((res) => {
        if (res.status === 200) {
          resolve(res.data);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
} 

const appendFilesToFormData = (
  formData: FormData,
  key: string,
  files: string[]
): void => {
  files.forEach((filePath: string) => {
    formData.append(`${key}`, filePath);
  });
};
