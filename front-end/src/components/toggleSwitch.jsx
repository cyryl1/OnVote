// import React from 'react'

export default function ToggleSwitch({ enabled, onChange }) {
    // const handleChange = () => {
    //     if (enabled) {
    //         onChange(false);
    //     } else {
    //         onChange(true);
    //     }
    // }
  return (
    <div className="flex items-center gap-3">
        <button
            type="button"
            onClick={onChange}
            className={`relative inline-flex h-7 w-16 items-center rounded ${enabled ? 'bg-[#2ecd10]' : 'bg-gray-200'} transition-colors duration-200 ease-in-out`}
        >
            <span className={`inline-block h-9 w-7 rounded bg-white shadow transform transition-transform duration-200 ease-in-out ${enabled ? 'translate-x-9 border border-[#2ecd10]' : 'translate-x-0'}`} />
            
        </button>
    </div>
  )
}
