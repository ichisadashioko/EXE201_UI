type ButtonProps = {
  label: string;
  onClick: () => void;
};

const Button = ({ label, onClick }: ButtonProps) => {
  return (
    <button
      className="bg-[#454699] text-white w-full border-0 py-3 rounded-3xl font-medium"
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default Button;
