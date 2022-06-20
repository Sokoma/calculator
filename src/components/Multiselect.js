import React from "react";

export const Multiselect = ({state, updateState, options, classSuffix}) => {

    const toggleOption = (event) => {
        const value = event.target.innerHTML;
        let activeOptions = [];
        if (state.includes(value)) {
            activeOptions = state.filter(option => option !== value);
            event.target.style.color = "#ffffff";
        } else {
            activeOptions = [...state, value];
            event.target.style.color = "#d65e31";
        }
        
        updateState(activeOptions);
      };

    return (
        <div className={"multiselect multiselect-"+classSuffix}>
            {options.map((option, index) => (
                <span key={index} className="multiselect-option" id={option} onClick={ (e) => toggleOption(e) }>{option}</span>
            ))}
        </div>
    )
}