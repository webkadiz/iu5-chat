import theme from './theme';
import { Colors, Displays, Flexs, Fonts, Margins } from './types';

export const marginMixin = ({ mt, mb, ml, mr }: Margins) => {
    let margins = '';

    if (mt) margins += `margin-top: ${mt}px;`;
    if (mb) margins += `margin-bottom: ${mb}px;`;
    if (ml) margins += `margin-left: ${ml}px;`;
    if (mr) margins += `margin-right: ${mr}px;`;

    return margins;
};

export const fontMixin = ({
    tiny,
    small,
    middle,
    large,
    reqular,
    medium,
    bold,
}: Fonts) => {
    let font = '';

    if (tiny) font += `font-size: 12px;`;
    if (small) font += `font-size: 14px;`;
    if (middle) font += `font-size: 16px;`;
    if (large) font += `font-size: 20px;`;
    if (reqular) font += `font-weight: 400;`;
    if (medium) font += `font-weight: 500;`;
    if (bold) font += `font-weight: 700;`;

    return font;
};

export const displayMixin = ({
    dblock,
    diblock,
    dinline,
    dflex,
    dnone,
}: Displays) => {
    let display = '';

    if (dblock) display += `display: block;`;
    if (diblock) display += `display: inline-block;`;
    if (dinline) display += `display: inline;`;
    if (dflex) display += `display: flex;`;
    if (dnone) display += `display: none;`;

    return display;
};

export const flexMixin = ({ ai, jc }: Flexs) => {
    let flex = '';

    if (ai) flex += `align-items: ${ai};`;
    if (jc) flex += `justify-content: ${jc};`;

    return flex;
};

export const colorMixin = ({ primary, secondary, brand }: Colors) => {
    let color = '';

    if (primary) color += `color: ${theme.colors.primary};`;
    if (secondary) color += `color: ${theme.colors.secondary};`;
    if (brand) color += `color: ${theme.colors.brand};`;

    return color;
};
