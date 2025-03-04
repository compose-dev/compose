export type Style = Partial<{
  // size
  width: string;
  height: string;
  minWidth: string;
  maxWidth: string;
  minHeight: string;
  maxHeight: string;

  // margin
  margin: string;
  marginTop: string;
  marginBottom: string;
  marginLeft: string;
  marginRight: string;

  // padding
  padding: string;
  paddingTop: string;
  paddingBottom: string;
  paddingLeft: string;
  paddingRight: string;

  // overflow
  overflow: "visible" | "hidden" | "scroll" | "auto" | "clip";
  overflowX: "visible" | "hidden" | "scroll" | "auto" | "clip";
  overflowY: "visible" | "hidden" | "scroll" | "auto" | "clip";

  // color
  color: string;
  backgroundColor: string;

  // borderRadius
  borderRadius: string;
  borderTopLeftRadius: string;
  borderTopRightRadius: string;
  borderBottomLeftRadius: string;
  borderBottomRightRadius: string;

  // border
  border: string;
  borderTop: string;
  borderBottom: string;
  borderLeft: string;
  borderRight: string;

  // text align
  textAlign: "left" | "right" | "center" | "justify" | "start" | "end";

  // font
  fontSize: string;
  fontWeight: string;

  // gap
  gap: string;

  // display
  display: string;

  // position
  position: "static" | "relative" | "absolute" | "fixed" | "sticky";
  top: string;
  right: string;
  bottom: string;
  left: string;
  zIndex: number;

  // flex
  flex: string;
  flexGrow: number;
  flexShrink: number;
  flexBasis: string;
  flexDirection: "row" | "row-reverse" | "column" | "column-reverse";
  flexWrap: "nowrap" | "wrap" | "wrap-reverse";
  justifyContent:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly";
  alignItems: "stretch" | "flex-start" | "flex-end" | "center" | "baseline";
  alignSelf:
    | "auto"
    | "flex-start"
    | "flex-end"
    | "center"
    | "baseline"
    | "stretch";
  alignContent:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "stretch";
  order: number;

  // grid
  gridTemplateColumns: string;
  gridTemplateRows: string;
  gridTemplateAreas: string;
  gridAutoColumns: string;
  gridAutoRows: string;
  gridAutoFlow: "row" | "column" | "dense" | "row dense" | "column dense";
  gridColumn: string;
  gridRow: string;
  gridArea: string;
  columnGap: string;
  rowGap: string;

  // transform
  transform: string;
  transformOrigin: string;

  // transition
  transition: string;

  // opacity
  opacity: number;

  // cursor
  cursor: string;

  // box-shadow
  boxShadow: string;

  // outline
  outline: string;
  outlineOffset: string;

  // visibility
  visibility: "visible" | "hidden" | "collapse";

  // white-space
  whiteSpace:
    | "normal"
    | "nowrap"
    | "pre"
    | "pre-wrap"
    | "pre-line"
    | "break-spaces";

  // word-break
  wordBreak: "normal" | "break-all" | "keep-all" | "break-word";

  // text-overflow
  textOverflow: "clip" | "ellipsis";

  // line-height
  lineHeight: string;

  // letter-spacing
  letterSpacing: string;

  // text-decoration
  textDecoration: string;

  // text-transform
  textTransform: "none" | "capitalize" | "uppercase" | "lowercase";

  // vertical-align
  verticalAlign: string;

  // list-style
  listStyle: string;

  // background
  backgroundImage: string;
  backgroundSize: string;
  backgroundPosition: string;
  backgroundRepeat: string;
  backgroundAttachment: string;

  // filter
  filter: string;

  // backdrop-filter
  backdropFilter: string;

  // resize
  resize: "none" | "both" | "horizontal" | "vertical";

  // user-select
  userSelect: "none" | "auto" | "text" | "contain" | "all";

  // pointer-events
  pointerEvents: "auto" | "none";

  // content
  content: string;
}> | null;
