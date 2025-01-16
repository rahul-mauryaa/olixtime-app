// declare module "*.svg" {
//   import React from "react";
//   import { SvgProps } from "react-native-svg";
//   const content: React.FC<SvgProps>;
//   export default content;
// }


declare module '*.png' {
  const value: import('react-native').ImageSourcePropType;
  export default value;
}

declare module '*.gif' {
  const value: import('react-native').ImageSourcePropType;
  export default value;
}


declare module '*.jpg' {
  const value: import('react-native').ImageSourcePropType;
  export default value;
}

declare module '*.jpeg' {
  const value: import('react-native').ImageSourcePropType;
  export default value;
}

declare module '*.svg' {
  import { ReactComponent } from 'react-native-svg';
  const value: ReactComponent;
  export default value;
}


declare module '@env' {
  export const DEVELOPMENT_URL: string;
  export const PRODUCTION_URL: string;
}