export default function InputCom({
  label,
  type,
  name,
  placeholder,
  children,
  inputHandler,
  value,
  inputClasses,
  labelClasses = "text-qgray text-[13px] font-normal",
}) {
  return (
    <div className="input-com w-full h-full">
      {label && (
        <label
          className={`input-label capitalize block mb-2 ${labelClasses || ""}`}
          htmlFor={name}
        >
          {label}
        </label>
      )}
      <div className="input-wrapper border border-qgray-border w-full h-full overflow-hidden relative">
        <input
          placeholder={placeholder}
          value={value}
          onChange={(e) => inputHandler(e)} // Truyền sự kiện onChange đúng cách
          className={`input-field placeholder:text-sm text-sm px-6 text-dark-gray w-full font-normal bg-white focus:ring-0 focus:outline-none h-[40px] ${
            inputClasses || ""
          }`}
          type={type}
          id={name}
          name={name} // Thêm name để đảm bảo hàm xử lý input biết input nào đang thay đổi
        />
        {children && children}
      </div>
    </div>
  );
}
