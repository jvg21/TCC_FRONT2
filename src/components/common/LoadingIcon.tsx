import { FiLoader } from "react-icons/fi";
import styled, { keyframes } from "styled-components";

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const LoadingIcon = styled(FiLoader)`
  animation: ${spin} 1s linear infinite;
`;
