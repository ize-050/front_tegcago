import React, { useState, useEffect } from 'react';

function SelectAutocomplete({ options, onSelect }:{
  options: any[] ,
  onSelect: (option: any) => void;
}) {
  const [inputValue, setInputValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<any[]>(options);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const newFilteredOptions = options.filter(option =>
      option.cus_fullname.toLowerCase().includes(inputValue?.toLowerCase())
    );
    setFilteredOptions(newFilteredOptions);
  }, [inputValue, options]);


  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsOpen(true);
  };

  const handleOptionClick = (option:Partial<any>):void => {
    setInputValue(option.cus_fullname);
    setIsOpen(false);
    onSelect(option);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onClick={() => setIsOpen(true)}
        placeholder={"ค้นหารายชื่อลูกค้า"}
        className="px-4 py-2 outline-none rounded-md border border-gray-300 text-base w-full"
      />
     {isOpen && filteredOptions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border rounded shadow-md mt-1 max-h-60 overflow-y-auto">
          {filteredOptions.map((option, index) => (
            <li
              key={index}
              onClick={() => handleOptionClick(option)}
              className="px-3 py-2 cursor-pointer hover:bg-gray-100 flex"
            >
              {option.cus_fullname} ({option.cus_phone})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SelectAutocomplete;