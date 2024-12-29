import { useState } from 'react';

const AnimatedInput = ({ name, value, onChange, placeholder, required, type }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full p-3 focus:outline-none focus:ring-0"
      />
      <div
        className={`absolute bottom-0 left-0 h-[2px] bg-[#C5A880] transition-all duration-300 ease-in-out ${
          isFocused ? 'w-full' : 'w-0'
        }`}
      />
    </div>
  );
};

export default AnimatedInput;