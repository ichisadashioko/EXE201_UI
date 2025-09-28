import { Container } from "react-bootstrap";
import onBoardingData from "../data/onBoarding.json";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import { getAccessToken } from "../authentication";

const OnBoarding = () => {
  const [index, setIndex] = useState(0);
  const access_token = getAccessToken();
  const nav = useNavigate();
  useEffect(() => {
    if (access_token) {
      nav("/home");
      return;
    }
  }, [access_token, nav]);

  const handleNext = () => {
    console.log("object");
    if (index < onBoardingData.length - 1) {
      setIndex((prev) => prev + 1);
    } else {
      nav("/login");
    }
  };

  return (
    <section className="h-[100vh] text-center bg-home flex flex-col gap-2 items-center justify-center">
      <Container className="p-3 h-[80vh] flex flex-col justify-between ">
        <div className="text-right">
          <Link to={"/login"} className="text-[#454699]">
            <span className="underline">Bỏ qua</span>
            {`>`}
          </Link>
        </div>
        <div>
          <img src={onBoardingData[index].image} alt="" className="mx-auto " />
        </div>
        <div className=" flex flex-col gap-3">
          <h1 className="text-2xl font-semibold text-neutral-950">
            {onBoardingData[index].title}
          </h1>
          <p className="text-neutral-800">
            {onBoardingData[index].description}
          </p>
        </div>
        <div>
          <Button
            label={
              index < onBoardingData.length - 1
                ? "Tiếp tục"
                : "Trải nghiệm ngay"
            }
            onClick={handleNext}
          />
        </div>
      </Container>
    </section>
  );
};

export default OnBoarding;
