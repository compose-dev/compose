from typing import Literal, TypedDict


class ComponentStyle(TypedDict, total=False):
    # size
    width: str
    height: str
    minWidth: str
    maxWidth: str
    minHeight: str
    maxHeight: str

    # margin
    margin: str
    marginTop: str
    marginBottom: str
    marginLeft: str
    marginRight: str

    # padding
    padding: str
    paddingTop: str
    paddingBottom: str
    paddingLeft: str
    paddingRight: str

    # overflow
    overflow: Literal["visible", "hidden", "scroll", "auto", "clip"]
    overflowX: Literal["visible", "hidden", "scroll", "auto", "clip"]
    overflowY: Literal["visible", "hidden", "scroll", "auto", "clip"]

    # color
    color: str
    backgroundColor: str

    # border radius
    borderRadius: str
    borderTopLeftRadius: str
    borderTopRightRadius: str
    borderBottomLeftRadius: str
    borderBottomRightRadius: str

    # border
    border: str
    borderTop: str
    borderBottom: str
    borderLeft: str
    borderRight: str

    # text align
    textAlign: Literal["left", "right", "center", "justify", "start", "end"]

    # font
    fontSize: str
    fontWeight: str

    # gap
    gap: str

    # display
    display: str

    # position
    position: Literal["static", "relative", "absolute", "fixed", "sticky"]
    top: str
    right: str
    bottom: str
    left: str
    zIndex: int

    # flex
    flex: str
    flexGrow: float
    flexShrink: float
    flexBasis: str
    flexDirection: Literal["row", "row-reverse", "column", "column-reverse"]
    flexWrap: Literal["nowrap", "wrap", "wrap-reverse"]
    justifyContent: Literal[
        "flex-start",
        "flex-end",
        "center",
        "space-between",
        "space-around",
        "space-evenly",
    ]
    alignItems: Literal["stretch", "flex-start", "flex-end", "center", "baseline"]
    alignSelf: Literal[
        "auto", "flex-start", "flex-end", "center", "baseline", "stretch"
    ]
    alignContent: Literal[
        "flex-start", "flex-end", "center", "space-between", "space-around", "stretch"
    ]
    order: int

    # grid
    gridTemplateColumns: str
    gridTemplateRows: str
    gridTemplateAreas: str
    gridAutoColumns: str
    gridAutoRows: str
    gridAutoFlow: Literal["row", "column", "dense", "row dense", "column dense"]
    gridColumn: str
    gridRow: str
    gridArea: str
    columnGap: str
    rowGap: str

    # transform
    transform: str
    transformOrigin: str

    # transition
    transition: str

    # opacity
    opacity: float

    # cursor
    cursor: str

    # box-shadow
    boxShadow: str

    # outline
    outline: str
    outlineOffset: str

    # visibility
    visibility: Literal["visible", "hidden", "collapse"]

    # white-space
    whiteSpace: Literal[
        "normal", "nowrap", "pre", "pre-wrap", "pre-line", "break-spaces"
    ]

    # word-break
    wordBreak: Literal["normal", "break-all", "keep-all", "break-word"]

    # text-overflow
    textOverflow: Literal["clip", "ellipsis"]

    # line-height
    lineHeight: str

    # letter-spacing
    letterSpacing: str

    # text-decoration
    textDecoration: str

    # text-transform
    textTransform: Literal["none", "capitalize", "uppercase", "lowercase"]

    # vertical-align
    verticalAlign: str

    # list-style
    listStyle: str

    # background
    backgroundImage: str
    backgroundSize: str
    backgroundPosition: str
    backgroundRepeat: str
    backgroundAttachment: str

    # filter
    filter: str

    # backdrop-filter
    backdropFilter: str

    # resize
    resize: Literal["none", "both", "horizontal", "vertical"]

    # user-select
    userSelect: Literal["none", "auto", "text", "contain", "all"]

    # pointer-events
    pointerEvents: Literal["auto", "none"]

    # content
    content: str
