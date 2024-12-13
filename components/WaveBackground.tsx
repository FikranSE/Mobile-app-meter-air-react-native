import React from "react";
import Svg, { Path } from "react-native-svg";

const WaveBackground = () => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1440 320"
    style={{
      position: "absolute",
      bottom: -40,
      left: 0,
      width: "115%",
      height: 150,
    }}
  >
    <Path
      fill="#a2d9ff"
      fillOpacity="1"
      d="M0,256L48,229.3C96,203,192,149,288,117.3C384,85,480,75,576,106.7C672,139,768,213,864,240C960,267,1056,245,1152,208C1248,171,1344,117,1392,90.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
    />
  </Svg>
);

export default WaveBackground;
