import { CSSProperties, ReactNode, ElementType } from "react";
import { ColorScheme, ColorWeight, SpacingToken, TextVariant } from "../types";

export interface CommonProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  as?: ElementType;
}

export interface FlexProps {
  inline?: boolean;
  direction?: "row" | "row-reverse" | "column" | "column-reverse";
  tabletDirection?: "row" | "row-reverse" | "column" | "column-reverse";
  mobileDirection?: "row" | "row-reverse" | "column" | "column-reverse";
  wrap?: boolean;
  horizontal?: "start" | "center" | "end" | "space-between" | "space-around" | "space-evenly";
  vertical?: "start" | "center" | "end" | "space-between" | "space-around" | "space-evenly";
  flex?: number | string;
  align?: "start" | "center" | "end" | "stretch";
  center?: boolean;
}

export interface SpacingProps {
  padding?: SpacingToken;
  paddingLeft?: SpacingToken;
  paddingRight?: SpacingToken;
  paddingTop?: SpacingToken;
  paddingBottom?: SpacingToken;
  paddingX?: SpacingToken;
  paddingY?: SpacingToken;
  margin?: SpacingToken;
  marginLeft?: SpacingToken;
  marginRight?: SpacingToken;
  marginTop?: SpacingToken;
  marginBottom?: SpacingToken;
  marginX?: SpacingToken;
  marginY?: SpacingToken;
  gap?: SpacingToken | "-1";
}

export interface SizeProps {
  width?: string | number | SpacingToken;
  height?: string | number | SpacingToken;
  maxWidth?: number | SpacingToken;
  minWidth?: number | SpacingToken;
  minHeight?: number | SpacingToken;
  maxHeight?: number | SpacingToken;
  fit?: boolean;
  fitWidth?: boolean;
  fitHeight?: boolean;
  fill?: boolean;
  fillWidth?: boolean;
  fillHeight?: boolean;
  aspectRatio?: string | number;
}

export interface StyleProps {
  background?: string;
  solid?: string;
  opacity?: number;
  pointerEvents?: "auto" | "none";
  border?: string;
  borderTop?: string;
  borderRight?: string;
  borderBottom?: string;
  borderLeft?: string;
  borderStyle?: string;
  borderWidth?: string | number;
  radius?: string;
  topRadius?: string;
  rightRadius?: string;
  bottomRadius?: string;
  leftRadius?: string;
  topLeftRadius?: string;
  topRightRadius?: string;
  bottomLeftRadius?: string;
  bottomRightRadius?: string;
  overflow?: "visible" | "hidden" | "scroll" | "auto";
  overflowX?: "visible" | "hidden" | "scroll" | "auto";
  overflowY?: "visible" | "hidden" | "scroll" | "auto";
  zIndex?: number;
  shadow?: string;
  cursor?: string;
  top?: string | number;
  right?: string | number;
  bottom?: string | number;
  left?: string | number;
  position?: "static" | "relative" | "absolute" | "fixed" | "sticky";
  transition?: string;
}

export interface DisplayProps {
  hide?: boolean;
  show?: boolean;
}

export interface ConditionalProps {
  textVariant?: TextVariant;
  textSize?: string;
  textWeight?: string;
  textType?: string;
  onBackground?: `${ColorScheme}-${ColorWeight}`;
  onSolid?: `${ColorScheme}-${ColorWeight}`;
}

export interface TextProps<T extends ElementType = "span"> {
  as?: T;
  variant?: TextVariant;
  size?: string;
  weight?: string;
  align?: "left" | "center" | "right" | "justify";
  wrap?: "wrap" | "nowrap" | "balance" | "pretty";
  onBackground?: `${ColorScheme}-${ColorWeight}`;
  onSolid?: `${ColorScheme}-${ColorWeight}`;
}