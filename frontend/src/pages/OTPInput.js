import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import Context from '../context';
import { useNavigate } from "react-router-dom";

export default function OTPInput() {
  const { email, otp, setPage } = useContext(Context);
  const [timerCount, setTimer] = useState(60);
  const [OTPinput, setOTPinput] = useState(["", "", "", ""]);
  const [disable, setDisable] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!email || otp === undefined) {
      console.error("Email or OTP is undefined!");
    }

    let interval = setInterval(() => {
      setTimer((lastTimerCount) => {
        if (lastTimerCount <= 1) {
          clearInterval(interval);
          setDisable(false);
        }
        return lastTimerCount <= 0 ? lastTimerCount : lastTimerCount - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [disable, email, otp]);

  const resendOTP = () => {
    if (disable) return;
    axios
      .post("http://localhost:8080/api/password-reset/send_recovery_email", {
        OTP: otp,
        recipient_email: email,
      })
      .then(() => {
        setDisable(true);
        alert("A new OTP has successfully been sent to your email.");
        setTimer(60);
      })
      .catch(console.error);
  };

  const verifyOTP = () => {
    if (parseInt(OTPinput.join("")) === otp) {
      navigate('/reset');
    } else {
      alert(
        "The code you have entered is not correct. Please try again or resend the OTP."
      );
    }
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen bg-gray-50 ">
      <div className="bg-white px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl border-2 border-pink-500 ">
        <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <div className="font-semibold text-3xl">
              <p>Email Verification</p>
            </div>
            <div className="flex flex-row text-sm font-medium text-gray-400">
              <p>We have sent a code to your email {email}</p>
            </div>
          </div>

          <div>
            <form>
              <div className="flex flex-col space-y-16">
                <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs ">
                  {OTPinput.map((value, index) => (
                    <div className="w-16 h-16" key={index}>
                      <input
                        maxLength="1"
                        className=" border-2 border-pink-500 w-full h-full text-center px-5 outline-none rounded-xl border border-pink-200 text-lg bg-white focus:bg-pink-50 focus:ring-1 ring-pink-700"
                        type="text"
                        value={value}
                        onChange={(e) => {
                          const newOTPinput = [...OTPinput];
                          newOTPinput[index] = e.target.value;
                          setOTPinput(newOTPinput);
                        }}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex flex-col space-y-5">
                  <div>
                    <button
                      type="button"
                      onClick={verifyOTP}
                      className="flex items-center justify-center w-full py-5 bg-pink-500 text-white text-sm rounded-xl shadow-sm"
                    >
                      Verify Account
                    </button>
                  </div>

                  <div className="flex items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
                    <p>Didn't receive the code?</p>
                    <button
                      type="button"
                      disabled={disable}
                      onClick={resendOTP}
                      className={`${
                        disable ? "text-gray-500" : "text-pink-500"
                      } underline`}
                    >
                      {disable ? `Resend OTP in ${timerCount}s` : "Resend OTP"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
