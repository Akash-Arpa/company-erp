import React from "react";

const SelectTag = ({ name, onChange, value, options,id,optionName }) => {
//   console.log(options);
  return (
    <select name={name} value={value} onChange={(e)=>onChange(e,id)}>
      <option value="">{`---Select One ${name}`}</option>
      {options?.length &&
        options.map((option, index) => {
          return (
            <option key={index} value={option.id}>
              {option[optionName]}
            </option>
          );
        })}
    </select>
  );
};

export default SelectTag;
