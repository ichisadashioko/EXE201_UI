import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

type SuccessProps = {
  redirect: string;
  text?: string;
};

const Success = ({ redirect, text }: SuccessProps) => {
  //   const [count, setCount] = useState(3);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      //   setCount((prev) => prev - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      navigate(redirect);
    }, 3000);

    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
    };
  }, [navigate, redirect]);

  return (
    <section className="flex flex-col gap-5 text-center">
      <img src="/assets/action/success.png" alt="" />
      <p className="font-medium text-neutral-950 text-xl">{text}</p>
    </section>
  );
};

export default Success;
