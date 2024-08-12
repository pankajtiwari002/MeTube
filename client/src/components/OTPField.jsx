import { useRef } from 'react';
import styled from 'styled-components';

const OtpContainer = styled.div`
  display: ${(props) => props.visible ? "flex" : "none"};
  justify-content: space-between;
  align-items: center;
  width: 200px;
  margin: 20px auto;
`;

const OtpInput = styled.input`
  width: 40px;
  height: 50px;
  font-size: 24px;
  text-align: center;
  border: 2px solid #ddd;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.3s;

  &:focus {
    border-color: #007bff;
  }
`;

const OTPField = ({setOtp,visible}) => {
  const inputsRef = useRef([]);

  const handleInputChange = (e, index) => {
    const value = e.target.value;
    if (value.length === 1) {
      const otpArray = inputsRef.current.map(input => input.value);
      otpArray[index] = value;
      setOtp(otpArray.join(''));

      if (index < 3) {
        inputsRef.current[index + 1].focus();
      }
    } else if (value.length > 1) {
      // Handle case where user pastes the entire OTP
      const otpArray = value.split('');
      otpArray.forEach((digit, idx) => {
        if (idx < 4) {
          inputsRef.current[idx].value = digit;
        }
      });
      setOtp(otpArray.join(''));

      if (otpArray.length < 4) {
        inputsRef.current[otpArray.length].focus();
      }
    }
};


  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value) {
      if (index > 0) {
        inputsRef.current[index - 1].focus();
      }
    }
  };

  return (
    <OtpContainer visible={visible}>
      {[0, 1, 2, 3].map((_, index) => (
        <OtpInput
          key={index}
          maxLength={1}
          ref={(el) => (inputsRef.current[index] = el)}
          onChange={(e) => handleInputChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          autoFocus={index === 0}
        />
      ))}
    </OtpContainer>
  );
};

export default OTPField;
