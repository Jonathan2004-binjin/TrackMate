/**
 * Type declarations for modules without type definitions
 */

declare module '@expo/vector-icons' {
  import React from 'react';
  import { TextStyle } from 'react-native';

  // Common properties for all icon sets
  interface IconProps {
    size?: number;
    color?: string;
    style?: TextStyle;
  }

  // MaterialIcons component
  export class MaterialIcons extends React.Component<IconProps & { name: string }> {}
  
  // You can add other icon sets from @expo/vector-icons as needed
  export class Ionicons extends React.Component<IconProps & { name: string }> {}
  export class FontAwesome extends React.Component<IconProps & { name: string }> {}
  export class FontAwesome5 extends React.Component<IconProps & { name: string }> {}
  export class AntDesign extends React.Component<IconProps & { name: string }> {}
  export class Entypo extends React.Component<IconProps & { name: string }> {}
  export class EvilIcons extends React.Component<IconProps & { name: string }> {}
  export class Feather extends React.Component<IconProps & { name: string }> {}
  export class Foundation extends React.Component<IconProps & { name: string }> {}
  export class MaterialCommunityIcons extends React.Component<IconProps & { name: string }> {}
  export class Octicons extends React.Component<IconProps & { name: string }> {}
  export class SimpleLineIcons extends React.Component<IconProps & { name: string }> {}
  export class Zocial extends React.Component<IconProps & { name: string }> {}
} 