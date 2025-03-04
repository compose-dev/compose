/**
 * Lookup table to get the midpoint of a list with n items. Fast and
 * performant, but needs to be manually maintained. The list currently
 * extends up to 250 items.
 */
export type HalfMap = {
  0: 0;
  1: 0;
  2: 1;
  3: 1;
  4: 2;
  5: 2;
  6: 3;
  7: 3;
  8: 4;
  9: 4;
  10: 5;
  11: 5;
  12: 6;
  13: 6;
  14: 7;
  15: 7;
  16: 8;
  17: 8;
  18: 9;
  19: 9;
  20: 10;
  21: 11;
  22: 11;
  23: 12;
  24: 12;
  25: 13;
  26: 13;
  27: 13;
  28: 14;
  29: 14;
  30: 15;
  31: 15;
  32: 16;
  33: 16;
  34: 17;
  35: 17;
  36: 18;
  37: 18;
  38: 19;
  39: 19;
  40: 20;
  41: 20;
  42: 21;
  43: 21;
  44: 22;
  45: 22;
  46: 23;
  47: 23;
  48: 24;
  49: 24;
  50: 25;
  51: 25;
  52: 26;
  53: 26;
  54: 27;
  55: 27;
  56: 28;
  57: 28;
  58: 29;
  59: 29;
  60: 30;
  61: 30;
  62: 31;
  63: 31;
  64: 32;
  65: 32;
  66: 33;
  67: 33;
  68: 34;
  69: 34;
  70: 35;
  71: 35;
  72: 36;
  73: 36;
  74: 37;
  75: 37;
  76: 38;
  77: 38;
  78: 39;
  79: 39;
  80: 40;
  81: 40;
  82: 41;
  83: 41;
  84: 42;
  85: 42;
  86: 43;
  87: 43;
  88: 44;
  89: 44;
  90: 45;
  91: 45;
  92: 46;
  93: 46;
  94: 47;
  95: 47;
  96: 48;
  97: 48;
  98: 49;
  99: 49;
  100: 50;
  101: 50;
  102: 51;
  103: 51;
  104: 52;
  105: 52;
  106: 53;
  107: 53;
  108: 54;
  109: 54;
  110: 55;
  111: 55;
  112: 56;
  113: 56;
  114: 57;
  115: 57;
  116: 58;
  117: 58;
  118: 59;
  119: 59;
  120: 60;
  121: 60;
  122: 61;
  123: 61;
  124: 62;
  125: 62;
  126: 63;
  127: 63;
  128: 64;
  129: 64;
  130: 65;
  131: 65;
  132: 66;
  133: 66;
  134: 67;
  135: 67;
  136: 68;
  137: 68;
  138: 69;
  139: 69;
  140: 70;
  141: 70;
  142: 71;
  143: 71;
  144: 72;
  145: 72;
  146: 73;
  147: 73;
  148: 74;
  149: 74;
  150: 75;
  151: 75;
  152: 76;
  153: 76;
  154: 77;
  155: 77;
  156: 78;
  157: 78;
  158: 79;
  159: 79;
  160: 80;
  161: 80;
  162: 81;
  163: 81;
  164: 82;
  165: 82;
  166: 83;
  167: 83;
  168: 84;
  169: 84;
  170: 85;
  171: 85;
  172: 86;
  173: 86;
  174: 87;
  175: 87;
  176: 88;
  177: 88;
  178: 89;
  179: 89;
  180: 90;
  181: 90;
  182: 91;
  183: 91;
  184: 92;
  185: 92;
  186: 93;
  187: 93;
  188: 94;
  189: 94;
  190: 95;
  191: 95;
  192: 96;
  193: 96;
  194: 97;
  195: 97;
  196: 98;
  197: 98;
  198: 99;
  199: 99;
  200: 100;
  201: 100;
  202: 101;
  203: 101;
  204: 102;
  205: 102;
  206: 103;
  207: 103;
  208: 104;
  209: 104;
  210: 105;
  211: 105;
  212: 106;
  213: 106;
  214: 107;
  215: 107;
  216: 108;
  217: 108;
  218: 109;
  219: 109;
  220: 110;
  221: 110;
  222: 111;
  223: 111;
  224: 112;
  225: 112;
  226: 113;
  227: 113;
  228: 114;
  229: 114;
  230: 115;
  231: 115;
  232: 116;
  233: 116;
  234: 117;
  235: 117;
  236: 118;
  237: 118;
  238: 119;
  239: 119;
  240: 120;
  241: 120;
  242: 121;
  243: 121;
  244: 122;
  245: 122;
  246: 123;
  247: 123;
  248: 124;
  249: 124;
  250: 125;
};

export type DivideUsingHalfMap<N extends number> = N extends keyof HalfMap
  ? HalfMap[N]
  : never;
