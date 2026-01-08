import { useState } from 'react';
import { Center, createTheme, Loader, MantineThemeProvider, Progress, Stack } from '@mantine/core';
import logoImage from '../assets/logoImage.png';
import { RingLoader } from './RIngLoader';


const styles = `
  @keyframes rotateForward {
    from { transform: rotateY(0deg); }
    to { transform: rotateY(360deg); }
  }
  
  @keyframes rotateBackward {
    from { transform: rotateY(360deg); }
    to { transform: rotateY(0deg); }
  }
  
  .plate-container {
    perspective: 1000px;
    width: 100px;
    height: 100px;
    cursor: pointer;
  }
  
  .plate {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    animation-duration: 2s;  /* <-- Change this value to adjust rotation speed (lower = faster) */
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }
  
  .plate.forward {
    animation-name: rotateForward;
  }
  
  .plate.backward {
    animation-name: rotateBackward;
  }
  
  .plate-side {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(145deg, #f0f0f0, #ffffff);
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    padding: 20px;
  }
  
  .plate-front {
    transform: translateZ(7px);
  }
  
  .plate-back {
    transform: rotateY(180deg) translateZ(7px);
  }
  
  .plate-side img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;
const theme = createTheme({
  components: {
    Loader: Loader.extend({
      defaultProps: {
        loaders: { ...Loader.defaultLoaders, ring: RingLoader },
        type: 'ring',
      },
    }),
  },
});
export function LoadingScreen() {
  const [isForward, setIsForward] = useState(true);

  const handleClick = () => {
    setIsForward((prev) => !prev);
  };

  return (
    <Center h="100%" >
      <Stack align="center" >
      <style>{styles}</style>
      
      <div className="plate-container" onClick={handleClick}>
        <div className={`plate ${isForward ? 'forward' : 'backward'}`}>
          <div className="plate-side plate-front">
            <img src={logoImage} alt="Logo" />
          </div>
          <div className="plate-side plate-back">
            <img src={logoImage} alt="Logo" />
          </div>
        </div>
      </div>

      <MantineThemeProvider theme={theme}>
      <Loader />
    </MantineThemeProvider>
      </Stack>
    </Center>
  );
}
